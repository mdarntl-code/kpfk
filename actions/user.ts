'use server'

import { prisma } from "@/lib/db"

export async function getMentors(category?: string, query?: string) {
    try {
        const where: any = {
            role: 'MENTOR'
        }

        if (category && category !== 'All') {
            where.category = category
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { skill: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } },
            ]
        }

        const mentors = await prisma.user.findMany({
            where,
            orderBy: {
                rating: 'desc'
            }
        })

        return mentors
    } catch (error) {
        console.error('Error fetching mentors:', error)
        return []
    }
}

export async function getMentorById(id: number) {
    try {
        const mentor = await prisma.user.findUnique({
            where: { id },
            include: {
                sessionsAsMentor: true
            }
        })
        return mentor
    } catch (error) {
        console.error('Error fetching mentor:', error)
        return null
    }
}

export async function updateMentorProfile(userId: number, data: any) {
    try {
        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                skill: data.skill,
                category: data.category,
                bio: data.bio,
                location: data.location,
                rate: parseFloat(data.rate),
                videoPresentation: data.videoPresentation,
                availability: data.availability
            }
        })
        return { success: true, user: updated }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function getMentorWallet(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true, withdrawals: { orderBy: { createdAt: 'desc' } } }
        })
        return user || { balance: 0, withdrawals: [] }
    } catch (error) {
        console.error("Error fetching mentor wallet:", error)
        return { balance: 0, withdrawals: [] }
    }
}

export async function requestWithdrawal(userId: number, amount: number) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user || user.balance < amount) {
            return { success: false, error: "Insufficient balance" }
        }

        // Create withdrawal request and deduct balance in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            }),
            prisma.withdrawalRequest.create({
                data: {
                    userId,
                    amount,
                    status: 'PENDING'
                }
            })
        ])

        return { success: true }
    } catch (error) {
        console.error("Error requesting withdrawal:", error)
        return { success: false, error: "Failed to process withdrawal" }
    }
}
