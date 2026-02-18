'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { PaymentStatus } from "@prisma/client"

export async function createPayment(data: {
    sessionId: number,
    amount: number,
    status: PaymentStatus
}) {
    try {
        const payment = await prisma.payment.create({
            data: {
                sessionId: data.sessionId,
                amount: data.amount,
                status: data.status
            }
        })
        return { success: true, payment }
    } catch (error) {
        console.error("Error creating payment:", error)
        return { success: false, error: "Failed to create payment" }
    }
}

export async function updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    try {
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: { status }
        })
        revalidatePath('/dashboard')
        return { success: true, payment }
    } catch (error) {
        console.error("Error updating payment:", error)
        return { success: false, error: "Failed to update payment" }
    }
}
