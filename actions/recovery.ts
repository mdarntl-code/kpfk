'use server'

import { z } from "zod";
import { prisma } from "@/lib/db"

const RecoverySchema = z.object({
    email: z.string().email(),
});

export async function recoverPassword(formData: FormData) {
    const rawData = {
        email: formData.get('email') as string,
    }

    const parsed = RecoverySchema.safeParse(rawData);
    if (!parsed.success) return { success: false, error: "Invalid email" };

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        // We still return true to avoid email enumeration attacks
        return { success: true };
    }

    // In a real application, we would generate a token and send an email here.
    // For this demonstration, we just simulate a successful request.

    return { success: true };
}
