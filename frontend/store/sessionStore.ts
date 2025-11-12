import { create } from 'zustand'
import { Session, getSessions, uploadAudio, getSessionStatus } from '@/lib/api'

interface SessionStore {
  sessions: Session[]
  loading: boolean
  error: string | null
  pollingIntervals: Map<string, NodeJS.Timeout>
  
  fetchSessions: () => Promise<void>
  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  uploadSession: (file: File, onProgress?: (progress: number) => void) => Promise<Session>
  startPolling: (sessionId: string) => void
  stopPolling: (sessionId: string) => void
  stopAllPolling: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  loading: false,
  error: null,
  pollingIntervals: new Map(),

  fetchSessions: async () => {
    set({ loading: true, error: null })
    try {
      const sessions = await getSessions()
      set({ sessions, loading: false })
      
      // Start polling for any processing sessions
      sessions.forEach((session) => {
        if (session.status === 'processing') {
          get().startPolling(session.id)
        }
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addSession: (session: Session) => {
    set((state) => ({
      sessions: [session, ...state.sessions]
    }))
    
    // Start polling if status is processing
    if (session.status === 'processing') {
      get().startPolling(session.id)
    }
  },

  updateSession: (id: string, updates: Partial<Session>) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      )
    }))
    
    // Stop polling if session is no longer processing
    if (updates.status && updates.status !== 'processing') {
      get().stopPolling(id)
    }
  },

  uploadSession: async (file: File, onProgress?: (progress: number) => void) => {
    set({ error: null })
    try {
      const session = await uploadAudio(file, onProgress)
      get().addSession(session)
      return session
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  startPolling: (sessionId: string) => {
    const { pollingIntervals } = get()
    
    // Don't start if already polling
    if (pollingIntervals.has(sessionId)) {
      return
    }
    
    let errorCount = 0
    const maxErrors = 5
    
    const interval = setInterval(async () => {
      try {
        const session = await getSessionStatus(sessionId)
        errorCount = 0 // Reset on success
        get().updateSession(sessionId, session)
        
        // Stop polling if no longer processing
        if (session.status !== 'processing') {
          get().stopPolling(sessionId)
        }
      } catch (error: any) {
        console.error('Error polling session status:', error)
        errorCount++
        if (errorCount >= maxErrors) {
          console.error(`Max polling errors reached for session ${sessionId}, stopping poll`)
          get().stopPolling(sessionId)
          get().updateSession(sessionId, { status: 'failed' })
        }
      }
    }, 3000) // Poll every 3 seconds
    
    set((state) => ({
      pollingIntervals: new Map(state.pollingIntervals).set(sessionId, interval)
    }))
  },

  stopPolling: (sessionId: string) => {
    const { pollingIntervals } = get()
    const interval = pollingIntervals.get(sessionId)
    
    if (interval) {
      clearInterval(interval)
      pollingIntervals.delete(sessionId)
      set({ pollingIntervals: new Map(pollingIntervals) })
    }
  },

  stopAllPolling: () => {
    const { pollingIntervals } = get()
    pollingIntervals.forEach((interval) => clearInterval(interval))
    set({ pollingIntervals: new Map() })
  }
}))
