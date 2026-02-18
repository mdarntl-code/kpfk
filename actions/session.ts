'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { SessionStatus, PaymentStatus } from "@prisma/client"

export async function createSession(data: {
    mentorId: number,
    learnerId: number,
    title: string,
    date: string,
    time: string,
    price: number
}) {
    const scheduledAt = new Date(`${data.date}T${data.time}:00`)

    try {
        const session = await prisma.session.create({
            data: {
                mentorId: data.mentorId,
                learnerId: data.learnerId,
                title: data.title,
                scheduledAt: scheduledAt,
                price: data.price,
                status: SessionStatus.UPCOMING,
                payment: {
                    create: {
                        amount: data.price,
                        status: PaymentStatus.PENDING
                    }
                }
            },
            include: {
                payment: true,
                mentor: true,
                learner: true
            }
        })
        revalidatePath('/dashboard')
        return { success: true, session }
    } catch (error) {
        console.error("Error creating session:", error)
        return { success: false, error: "Failed to create session" }
    }
}

export async function getSessions(userId: number, role: 'mentor' | 'learner') {
    try {
        const where = role === 'mentor'
            ? { mentorId: userId }
            : { learnerId: userId }

        const sessions = await prisma.session.findMany({
            where,
            include: {
                mentor: true,
                learner: true,
                payment: true
            },
            orderBy: {
                scheduledAt: 'desc'
            }
        })
        return sessions
    } catch (error) {
        console.error("Error getting sessions:", error)
        return []
    }
}

export async function cancelSession(sessionId: number) {
    try {
        const session = await prisma.session.update({
            where: { id: sessionId },
            data: {
                status: SessionStatus.CANCELLED
            }
        })
        revalidatePath('/dashboard')
        return { success: true, session }
    } catch (error) {
        console.error("Error cancelling session:", error)
        return { success: false, error: "Failed to cancel session" }
    }
}

export async function getLastSession(mentorId: number, learnerId: number) {
    try {
        const session = await prisma.session.findFirst({
            where: {
                mentorId,
                learnerId,
                // In real app, only allow reviewing COMPLETED sessions
                // status: SessionStatus.COMPLETED 
            },
            orderBy: {
                scheduledAt: 'desc'
            }
        })
        return session
    } catch (error) {
        console.error("Error fetching last session:", error)
        return null
    }
}
