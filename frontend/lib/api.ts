const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export interface Session {
  id: string
  fileName: string
  filePath: string
  duration: number | null
  status: 'uploading' | 'processing' | 'ready' | 'failed'
  assemblyId: string | null
  tokenCount: number
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  sessionId: string
  question: string
  answer: string
  tokenCount: number
  createdAt: string
}

export interface Transcript {
  id: string
  sessionId: string
  segments: string
  speakerAIsJake: boolean
}

export interface SessionWithDetails extends Session {
  transcripts: Transcript[]
  questions: Question[]
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function uploadAudio(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Session> {
  const formData = new FormData()
  formData.append('audio', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response.session)
        } catch (error) {
          reject(new ApiError(xhr.status, 'Failed to parse response'))
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject(new ApiError(xhr.status, error.error || 'Upload failed'))
        } catch {
          reject(new ApiError(xhr.status, 'Upload failed'))
        }
      }
    })

    xhr.addEventListener('error', () => {
      reject(new ApiError(0, 'Network error'))
    })

    xhr.open('POST', `${API_BASE_URL}/api/sessions`)
    xhr.send(formData)
  })
}

export async function getSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE_URL}/api/sessions`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch sessions' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.sessions
}

export async function getSession(id: string): Promise<SessionWithDetails> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${id}`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch session' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.session
}

export async function getSessionStatus(id: string): Promise<SessionWithDetails> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${id}/status`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch session status' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.session
}

export async function swapSpeakers(sessionId: string): Promise<Transcript> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/speakers`, {
    method: 'PATCH'
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to swap speakers' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.transcript
}

export async function askQuestion(sessionId: string, question: string): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to ask question' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.question
}

export async function getQuestions(sessionId: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/questions`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch questions' }))
    throw new ApiError(response.status, error.error)
  }

  const data = await response.json()
  return data.questions
}
