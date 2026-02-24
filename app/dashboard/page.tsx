import { prisma } from "@/lib/db"
import { getSessions } from "@/actions/session"
import { DashboardView } from "@/components/dashboard-view"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // In a real app, we would get the session/user from auth
  // For this demo, we use the seeded learner
  const user = await prisma.user.findUnique({
    where: { email: 'learner@example.com' }
  })

  if (!user) {
    return <div>User not found. Please run seed script.</div>
  }

  // We fetch sessions for this user
  // Adapting the result to match the Session interface expected by DashboardView
  const sessionsData = await getSessions(user.id, 'learner')

  const sessions = sessionsData.map(s => ({
    id: s.id,
    mentorId: s.mentorId,
    mentorName: s.mentor.name,
    mentorAvatar: s.mentor.avatar || "MN",
    skill: s.title || s.mentor.skill || "Mentorship",
    date: s.scheduledAt.toISOString().split('T')[0], // Extract YYYY-MM-DD
    time: s.scheduledAt.toISOString().split('T')[1].substring(0, 5), // Extract HH:mm
    status: s.status === 'UPCOMING' ? 'upcoming' as const :
      s.status === 'COMPLETED' ? 'completed' as const :
        'cancelled' as const,
    learnerId: s.learnerId,
    learnerName: s.learner.name
  }))

  return <DashboardView sessions={sessions} userRole="learner" />
}
