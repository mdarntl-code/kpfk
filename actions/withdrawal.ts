'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { WithdrawalStatus } from "@prisma/client"

export async function getAllWithdrawals() {
    try {
        const withdrawals = await prisma.withdrawalRequest.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return withdrawals
    } catch (error) {
        console.error('Error fetching withdrawals:', error)
        return []
    }
}

export async function updateWithdrawalStatus(id: number, status: WithdrawalStatus) {
    try {
        const withdrawal = await prisma.withdrawalRequest.findUnique({
            where: { id }
        })

        if (!withdrawal) {
            return { success: false, error: "Withdrawal not found" }
        }

        // Processing based on status
        if (status === 'REJECTED' && withdrawal.status !== 'REJECTED') {
            // Refund the user if rejected (only if it wasn't already rejected)
            await prisma.$transaction([
                prisma.withdrawalRequest.update({
                    where: { id },
                    data: { status }
                }),
                prisma.user.update({
                    where: { id: withdrawal.userId },
                    data: { balance: { increment: withdrawal.amount } }
                })
            ])
        } else {
            // Just update the status (e.g. to COMPLETED)
            await prisma.withdrawalRequest.update({
                where: { id },
                data: { status }
            })
        }

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Error updating withdrawal status:', error)
        return { success: false, error: "Failed to update withdrawal status" }
    }
}
