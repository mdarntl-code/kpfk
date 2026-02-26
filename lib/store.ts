import { create } from "zustand"
import type { Session, Review } from "./data"

interface AppState {
  sessions: Session[]
  reviews: Review[]
  userRole: "learner" | "mentor"
  addSession: (session: Session) => void
  cancelSession: (sessionId: string) => void
  addReview: (review: Review) => void
  setUserRole: (role: "learner" | "mentor") => void
}

export const useAppStore = create<AppState>((set) => ({
  sessions: [],
  reviews: [],
  userRole: "learner",
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  cancelSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "cancelled" as const } : s
      ),
    })),
  addReview: (review) =>
    set((state) => ({ reviews: [...state.reviews, review] })),
  setUserRole: (role) => set({ userRole: role }),
}))
