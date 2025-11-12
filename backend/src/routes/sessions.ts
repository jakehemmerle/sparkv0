import express, { Request, Response } from 'express'

const router = express.Router()

// GET /api/sessions - List all sessions
router.get('/', (req: Request, res: Response) => {
  res.json({ sessions: [] })
})

// POST /api/sessions - Create session & upload audio
router.post('/', (req: Request, res: Response) => {
  res.json({ message: 'Session creation endpoint - to be implemented' })
})

// GET /api/sessions/:id - Get session details + transcript
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ message: `Get session ${id} - to be implemented` })
})

// PATCH /api/sessions/:id/speakers - Swap Jake/Edmund assignment
router.patch('/:id/speakers', (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ message: `Swap speakers for session ${id} - to be implemented` })
})

// POST /api/sessions/:id/questions - Ask question about session
router.post('/:id/questions', (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ message: `Ask question for session ${id} - to be implemented` })
})

// GET /api/sessions/:id/questions - Get Q&A history
router.get('/:id/questions', (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ questions: [] })
})

export default router
