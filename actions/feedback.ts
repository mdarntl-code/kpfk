'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createFeedback(data: {
    sessionId: number,
    rating: number,
    comment?: string
}) {
    try {
        // Check if feedback already exists for this session
        const existingFeedback = await prisma.feedback.findUnique({
            where: { sessionId: data.sessionId }
        })

        if (existingFeedback) {
            return { success: false, error: "You have already reviewed this session." }
        }

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
    } catch (error: any) {
        console.error("Error creating feedback:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "You have already reviewed this session." }
        }
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

export async function getAllFeedbacks() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                session: {
                    include: {
                        learner: true,
                        mentor: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return feedbacks
    } catch (error) {
        console.error("Error getting all feedbacks:", error)
        return []
    }
}

export async function deleteFeedback(id: number) {
    try {
        const feedback = await prisma.feedback.findUnique({
            where: { id },
            include: { session: true }
        })
        if (!feedback) return { success: false, error: "Not found" }

        await prisma.feedback.delete({
            where: { id }
        })

        // Recalculate mentor stats
        const mentorId = feedback.session.mentorId
        const stats = await prisma.feedback.aggregate({
            where: { session: { mentorId } },
            _avg: { rating: true },
            _count: { rating: true }
        })

        await prisma.user.update({
            where: { id: mentorId },
            data: {
                rating: stats._avg.rating || 0,
                reviewCount: stats._count.rating
            }
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error("Error deleting feedback:", error)
        return { success: false, error: "Failed to delete feedback" }
    }
}
