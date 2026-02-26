'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { SessionStatus, PaymentStatus } from "@prisma/client"
import { parse } from "date-fns"

export async function createSession(data: {
    mentorId: number,
    learnerId: number,
    title: string,
    date: string,
    time: string,
    price: number
}) {
    // Parse '2026-02-28' and '1:30 PM' into a valid Date object using date-fns
    const dateTimeString = `${data.date} ${data.time}`
    const scheduledAt = parse(dateTimeString, 'yyyy-MM-dd h:mm a', new Date())

    try {
        const session = await prisma.session.create({
            data: {
                mentorId: data.mentorId,
                learnerId: data.learnerId,
                title: data.title,
                scheduledAt: scheduledAt,
                price: data.price,
                status: SessionStatus.PENDING,
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
                payment: true,
                feedback: true
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

export async function updateSessionStatus(sessionId: number, status: SessionStatus) {
    try {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { payment: true }
        })

        if (!session) return { success: false, error: "Session not found" }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                status: status,
                ...(status === SessionStatus.COMPLETED && session.payment ? {
                    payment: {
                        update: { status: PaymentStatus.COMPLETED }
                    }
                } : {}),
                ...(status === SessionStatus.CANCELLED && session.payment ? {
                    payment: {
                        update: { status: PaymentStatus.FAILED }
                    }
                } : {})
            }
        })

        // If newly marked as completed, credit the mentor's balance
        if (status === SessionStatus.COMPLETED && session.status !== SessionStatus.COMPLETED) {
            await prisma.user.update({
                where: { id: session.mentorId },
                data: { balance: { increment: session.price } }
            })
        }

        revalidatePath('/dashboard')
        return { success: true, session: updatedSession }
    } catch (error) {
        console.error("Error updating session status:", error)
        return { success: false, error: "Failed to update session status" }
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
