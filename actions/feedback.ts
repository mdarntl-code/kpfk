'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createFeedback(data: {
    sessionId: number,
    rating: number,
    comment?: string
}) {
    try {
        // First check if session is completed to allow review?
        // For simplicity, we create it.
        // Also update mentor stats? That would be good.

        const feedback = await prisma.feedback.create({
            data: {
                sessionId: data.sessionId,
                rating: data.rating,
                comment: data.comment
            },
            include: {
                session: {
                    include: {
                        mentor: true
                    }
                }
            }
        })

        // Update mentor rating stats
        const mentorId = feedback.session.mentorId
        const stats = await prisma.feedback.aggregate({
            where: {
                session: {
                    mentorId: mentorId
                }
            },
            _avg: {
                rating: true
            },
            _count: {
                rating: true
            }
        })

        if (stats._avg.rating) {
            await prisma.user.update({
                where: { id: mentorId },
                data: {
                    rating: stats._avg.rating,
                    reviewCount: stats._count.rating
                }
            })
        }

        revalidatePath(`/mentor/${mentorId}`)
        return { success: true, feedback }
    } catch (error) {
        console.error("Error creating feedback:", error)
        return { success: false, error: "Failed to create feedback" }
    }
}

export async function getFeedbackByMentor(mentorId: number) {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: {
                session: {
                    mentorId: mentorId
                }
            },
            include: {
                session: {
                    include: {
                        learner: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return feedbacks
    } catch (error) {
        console.error("Error getting feedback:", error)
        return []
    }
}
