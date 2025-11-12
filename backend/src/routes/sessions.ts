import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import prisma from '../services/database'
import { submitTranscription, getTranscriptionStatus, processCompletedTranscript } from '../services/transcription'

const router = express.Router()

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads')

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['audio/mp4', 'audio/x-m4a', 'audio/m4a']
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (ext === '.m4a' || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only M4A audio files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})

// GET /api/sessions - List all sessions
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

// POST /api/sessions - Create session & upload audio
router.post('/', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    const session = await prisma.session.create({
      data: {
        fileName: req.file.originalname,
        filePath: req.file.path,
        status: 'uploading'
      }
    })

    // Start transcription
    try {
      const assemblyId = await submitTranscription(req.file.path)
      
      await prisma.session.update({
        where: { id: session.id },
        data: { 
          status: 'processing',
          assemblyId 
        }
      })

      const updatedSession = await prisma.session.findUnique({
        where: { id: session.id }
      })
      res.status(201).json({ session: updatedSession })
    } catch (transcriptionError: any) {
      console.error('Error submitting transcription:', transcriptionError)
      
      // Mark session as failed
      await prisma.session.update({
        where: { id: session.id },
        data: { status: 'failed' }
      })
      
      return res.status(500).json({ 
        error: 'Failed to submit transcription',
        details: transcriptionError.message 
      })
    }
  } catch (error: any) {
    console.error('Error creating session:', error)
    if (error.message === 'Only M4A audio files are allowed') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// GET /api/sessions/:id - Get session details + transcript
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        transcripts: true,
        questions: true
      }
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json({ session })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

// GET /api/sessions/:id/status - Get session status and poll AssemblyAI if processing
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        transcripts: true
      }
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    // Fetch latest status from AssemblyAI if still processing
    if (session.status === 'processing' && session.assemblyId) {
      try {
        const transcript = await getTranscriptionStatus(session.assemblyId)
        
        // Update database if completed/failed
        if (transcript.status === 'completed') {
          await processCompletedTranscript(session.id, transcript)
          
          // Fetch updated session
          const updatedSession = await prisma.session.findUnique({
            where: { id },
            include: { transcripts: true }
          })
          
          return res.json({ session: updatedSession })
        } else if (transcript.status === 'error') {
          await prisma.session.update({
            where: { id: session.id },
            data: { status: 'failed' }
          })
          
          const failedSession = await prisma.session.findUnique({
            where: { id },
            include: { transcripts: true }
          })
          
          return res.json({ 
            session: failedSession,
            error: transcript.error 
          })
        }
        
        // Still processing, return current status
        return res.json({ 
          session,
          assemblyStatus: transcript.status 
        })
      } catch (assemblyError: any) {
        console.error('Error fetching AssemblyAI status:', assemblyError)
        // Return current database status even if AssemblyAI fails
        return res.json({ session })
      }
    }

    // Session not processing, just return current state
    res.json({ session })
  } catch (error) {
    console.error('Error fetching session status:', error)
    res.status(500).json({ error: 'Failed to fetch session status' })
  }
})

// PATCH /api/sessions/:id/speakers - Swap Jake/Edmund assignment
router.patch('/:id/speakers', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const transcript = await prisma.transcript.findFirst({
      where: { sessionId: id }
    })

    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    const updated = await prisma.transcript.update({
      where: { id: transcript.id },
      data: { speakerAIsJake: !transcript.speakerAIsJake }
    })

    res.json({ transcript: updated })
  } catch (error) {
    console.error('Error swapping speakers:', error)
    res.status(500).json({ error: 'Failed to swap speakers' })
  }
})

// POST /api/sessions/:id/questions - Ask question about session
router.post('/:id/questions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { question } = req.body

    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    // TODO: Implement OpenAI GPT-4o integration
    const answer = 'Q&A feature coming soon - OpenAI integration pending'

    const savedQuestion = await prisma.question.create({
      data: {
        sessionId: id,
        question,
        answer,
        tokenCount: 0
      }
    })

    res.status(201).json({ question: savedQuestion })
  } catch (error) {
    console.error('Error creating question:', error)
    res.status(500).json({ error: 'Failed to create question' })
  }
})

// GET /api/sessions/:id/questions - Get Q&A history
router.get('/:id/questions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const questions = await prisma.question.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' }
    })

    res.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

export default router
