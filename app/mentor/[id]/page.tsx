import { getMentorById } from "@/actions/user"
import { getFeedbackByMentor } from "@/actions/feedback"
import { MentorProfileView } from "@/components/mentor-profile-view"
import { notFound } from "next/navigation"

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const mentorId = parseInt(id)

  if (isNaN(mentorId)) {
    return notFound()
  }

  const mentor = await getMentorById(mentorId)
  if (!mentor) {
    return notFound()
  }

  const reviewsData = await getFeedbackByMentor(mentorId)

  // Map reviewsData to frontend Review interface
  const reviews = reviewsData.map(r => ({
    id: r.id,
    mentorId: r.session.mentorId,
    learnerName: r.session.learner.name,
    learnerAvatar: r.session.learner.avatar || "LU",
    rating: r.rating,
    comment: r.comment || "",
    date: r.createdAt.toISOString(),
    skill: r.session.title || "Session"
  }))

  // Ensure mentor matches Mentor interface (handle nulls)
  const formattedMentor = {
    ...mentor,
    bio: mentor.bio || "",
    avatar: mentor.avatar || "MN",
    skill: mentor.skill || "Mentor",
    category: mentor.category || "General",
    location: mentor.location || "Remote",
    rate: mentor.rate || 0,
    availability: mentor.availability || []
  }

  return <MentorProfileView mentor={formattedMentor} reviews={reviews} />
}
