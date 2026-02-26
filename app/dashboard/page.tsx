import { getSessions } from "@/actions/session"
import { getSession } from "@/actions/auth"
import { getMentorWallet } from "@/actions/user"
import { DashboardView } from "@/components/dashboard-view"
import { SessionStatus } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    return <div>User not found. Please log in first.</div>
  }

  const role = sessionUser.role.toLowerCase() as 'mentor' | 'learner';

  // We fetch sessions for this user
  // Adapting the result to match the Session interface expected by DashboardView
  const sessionsData = await getSessions(sessionUser.id, role)

  const sessions = sessionsData.map(s => ({
    id: s.id,
    mentorId: s.mentorId,
    mentorName: s.mentor.name,
    mentorAvatar: s.mentor.avatar || "MN",
    skill: s.title || s.mentor.skill || "Mentorship",
    date: s.scheduledAt.toISOString().split('T')[0], // Extract YYYY-MM-DD
    time: s.scheduledAt.toISOString().split('T')[1].substring(0, 5), // Extract HH:mm
    status: s.status === SessionStatus.PENDING ? 'pending' as const :
      s.status === SessionStatus.CONFIRMED ? 'confirmed' as const :
        s.status === SessionStatus.COMPLETED ? 'completed' as const :
          'cancelled' as const,
    learnerId: s.learnerId,
    learnerName: s.learner.name,
    price: s.price,
    isReviewed: Boolean(s.feedback)
  }))

  let wallet: { balance: number, withdrawals: any[] } | undefined = undefined;
  if (role === 'mentor') {
    wallet = (await getMentorWallet(sessionUser.id)) as { balance: number, withdrawals: any[] };
  }

  return <DashboardView sessions={sessions} userRole={role} wallet={wallet} userId={sessionUser.id} />
}
