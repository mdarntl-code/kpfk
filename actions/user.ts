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
