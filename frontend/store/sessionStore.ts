import { create } from 'zustand'
import { Session, getSessions, uploadAudio } from '@/lib/api'

interface SessionStore {
  sessions: Session[]
  loading: boolean
  error: string | null
  
  fetchSessions: () => Promise<void>
  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  uploadSession: (file: File, onProgress?: (progress: number) => void) => Promise<Session>
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null })
    try {
      const sessions = await getSessions()
      set({ sessions, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addSession: (session: Session) => {
    set((state) => ({
      sessions: [session, ...state.sessions]
    }))
  },

  updateSession: (id: string, updates: Partial<Session>) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      )
    }))
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
  }
}))
