export interface Mentor {
  id: string | number
  name: string
  avatar: string
  skill: string
  category: string
  bio: string
  rating: number
  reviewCount: number
  rate: number
  availability: string[]
  location: string
  videoPresentation?: string | null
}

export interface Session {
  id: string | number
  mentorId: string | number
  mentorName: string
  mentorAvatar: string
  skill: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  learnerId: string | number
  learnerName: string
  isReviewed?: boolean
}

export interface Review {
  id: string | number
  mentorId: string | number
  learnerName: string
  learnerAvatar: string
  rating: number
  comment: string
  date: string
  skill: string
}

export interface Payment {
  id: string | number
  sessionId: string | number
  amount: number
  status: "pending" | "completed" | "failed"
  date: string
}

export const categories = [
  "All",
  "Music",
  "Academic",
  "Technology",
  "Language",
  "Art & Design",
  "Fitness",
  "Cooking",
  "Business",
]


