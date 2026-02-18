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
}

export interface Session {
  id: string | number
  mentorId: string | number
  mentorName: string
  mentorAvatar: string
  skill: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  learnerId: string | number
  learnerName: string
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

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC",
    skill: "Guitar Basics",
    category: "Music",
    bio: "Professional guitar instructor with 10 years of experience teaching beginners. Passionate about helping you play your first song in just one session.",
    rating: 4.9,
    reviewCount: 47,
    rate: 15,
    availability: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "2:00 PM", "2:30 PM", "3:00 PM"],
    location: "Brooklyn, NY",
  },
  {
    id: "2",
    name: "Marcus Rivera",
    avatar: "MR",
    skill: "Math Helper",
    category: "Academic",
    bio: "Former high school math teacher turned private tutor. Specializing in algebra, geometry, and pre-calculus for students of all levels.",
    rating: 4.8,
    reviewCount: 63,
    rate: 15,
    availability: ["11:00 AM", "11:30 AM", "12:00 PM", "4:00 PM", "4:30 PM", "5:00 PM"],
    location: "Austin, TX",
  },
  {
    id: "3",
    name: "Aiko Tanaka",
    avatar: "AT",
    skill: "Japanese for Beginners",
    category: "Language",
    bio: "Native Japanese speaker and certified language instructor. Learn conversational Japanese through immersive, practical lessons.",
    rating: 5.0,
    reviewCount: 31,
    rate: 15,
    availability: ["8:00 AM", "8:30 AM", "9:00 AM", "1:00 PM", "1:30 PM"],
    location: "San Francisco, CA",
  },
  {
    id: "4",
    name: "David Okafor",
    avatar: "DO",
    skill: "Python Programming",
    category: "Technology",
    bio: "Senior software engineer at a top tech company. I love breaking down complex coding concepts into simple, digestible lessons.",
    rating: 4.7,
    reviewCount: 82,
    rate: 15,
    availability: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
    location: "Seattle, WA",
  },
  {
    id: "5",
    name: "Elena Volkov",
    avatar: "EV",
    skill: "Watercolor Painting",
    category: "Art & Design",
    bio: "Fine arts graduate and gallery-exhibited watercolor artist. Discover the joy of painting through guided, meditative sessions.",
    rating: 4.9,
    reviewCount: 28,
    rate: 15,
    availability: ["10:00 AM", "10:30 AM", "11:00 AM", "3:00 PM", "3:30 PM"],
    location: "Portland, OR",
  },
  {
    id: "6",
    name: "James Wright",
    avatar: "JW",
    skill: "Yoga & Meditation",
    category: "Fitness",
    bio: "Certified yoga instructor with 8 years of practice. Personalized sessions designed to improve flexibility, strength, and mindfulness.",
    rating: 4.6,
    reviewCount: 55,
    rate: 15,
    availability: ["6:00 AM", "6:30 AM", "7:00 AM", "5:00 PM", "5:30 PM"],
    location: "Denver, CO",
  },
  {
    id: "7",
    name: "Priya Sharma",
    avatar: "PS",
    skill: "Indian Cooking",
    category: "Cooking",
    bio: "Home chef and food blogger sharing authentic family recipes. Learn to make restaurant-quality Indian dishes from scratch.",
    rating: 4.8,
    reviewCount: 39,
    rate: 15,
    availability: ["11:00 AM", "11:30 AM", "12:00 PM", "5:00 PM", "5:30 PM", "6:00 PM"],
    location: "Chicago, IL",
  },
  {
    id: "8",
    name: "Tom Bradley",
    avatar: "TB",
    skill: "Public Speaking",
    category: "Business",
    bio: "Executive presentation coach and former TEDx speaker. Build confidence and captivate any audience with proven techniques.",
    rating: 4.7,
    reviewCount: 44,
    rate: 15,
    availability: ["9:00 AM", "9:30 AM", "10:00 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
    location: "New York, NY",
  },
]

export const reviews: Review[] = [
  {
    id: "r1",
    mentorId: "1",
    learnerName: "Alex Kim",
    learnerAvatar: "AK",
    rating: 5,
    comment: "Sarah is an incredible guitar teacher! She made learning chords so easy and fun. I was playing a simple song by the end of our session.",
    date: "2026-02-10",
    skill: "Guitar Basics",
  },
  {
    id: "r2",
    mentorId: "1",
    learnerName: "Jordan Lee",
    learnerAvatar: "JL",
    rating: 5,
    comment: "Very patient and knowledgeable. She really tailors the lesson to your level. Highly recommend for any beginner!",
    date: "2026-02-05",
    skill: "Guitar Basics",
  },
  {
    id: "r3",
    mentorId: "1",
    learnerName: "Casey Morgan",
    learnerAvatar: "CM",
    rating: 4,
    comment: "Great session overall. Sarah has a wonderful teaching style. I wish the sessions were a bit longer though!",
    date: "2026-01-28",
    skill: "Guitar Basics",
  },
  {
    id: "r4",
    mentorId: "2",
    learnerName: "Taylor Swift",
    learnerAvatar: "TS",
    rating: 5,
    comment: "Marcus explained quadratic equations in a way that finally clicked for me. He is a gifted teacher.",
    date: "2026-02-12",
    skill: "Math Helper",
  },
  {
    id: "r5",
    mentorId: "2",
    learnerName: "Riley Brown",
    learnerAvatar: "RB",
    rating: 5,
    comment: "My kid went from hating math to looking forward to sessions with Marcus. Truly transformative.",
    date: "2026-02-01",
    skill: "Math Helper",
  },
  {
    id: "r6",
    mentorId: "3",
    learnerName: "Sam Patel",
    learnerAvatar: "SP",
    rating: 5,
    comment: "Aiko-sensei is the best! I learned more Japanese in 30 minutes than I did in a week with an app.",
    date: "2026-02-14",
    skill: "Japanese for Beginners",
  },
  {
    id: "r7",
    mentorId: "4",
    learnerName: "Morgan Liu",
    learnerAvatar: "ML",
    rating: 5,
    comment: "David helped me debug my first Python project. He explains concepts clearly and patiently.",
    date: "2026-02-08",
    skill: "Python Programming",
  },
  {
    id: "r8",
    mentorId: "5",
    learnerName: "Harper Gray",
    learnerAvatar: "HG",
    rating: 5,
    comment: "Elena made me fall in love with watercolors. The session was so relaxing and I created something beautiful!",
    date: "2026-02-11",
    skill: "Watercolor Painting",
  },
]

export const sessions: Session[] = [
  {
    id: "s1",
    mentorId: "1",
    mentorName: "Sarah Chen",
    mentorAvatar: "SC",
    skill: "Guitar Basics",
    date: "2026-02-20",
    time: "10:00 AM",
    status: "upcoming",
    learnerId: "learner1",
    learnerName: "You",
  },
  {
    id: "s2",
    mentorId: "4",
    mentorName: "David Okafor",
    mentorAvatar: "DO",
    skill: "Python Programming",
    date: "2026-02-22",
    time: "6:30 PM",
    status: "upcoming",
    learnerId: "learner1",
    learnerName: "You",
  },
  {
    id: "s3",
    mentorId: "2",
    mentorName: "Marcus Rivera",
    mentorAvatar: "MR",
    skill: "Math Helper",
    date: "2026-02-10",
    time: "11:00 AM",
    status: "completed",
    learnerId: "learner1",
    learnerName: "You",
  },
  {
    id: "s4",
    mentorId: "3",
    mentorName: "Aiko Tanaka",
    mentorAvatar: "AT",
    skill: "Japanese for Beginners",
    date: "2026-01-30",
    time: "1:00 PM",
    status: "completed",
    learnerId: "learner1",
    learnerName: "You",
  },
  {
    id: "s5",
    mentorId: "5",
    mentorName: "Elena Volkov",
    mentorAvatar: "EV",
    skill: "Watercolor Painting",
    date: "2026-02-15",
    time: "10:30 AM",
    status: "cancelled",
    learnerId: "learner1",
    learnerName: "You",
  },
]
