'use server'

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client";

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['LEARNER', 'MENTOR'])
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export async function registerUser(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role') || 'LEARNER'
    }

    // Since FormData values can be null, we cast or default them
    // However, safeParse handles validation.
    // Wait, role is optional in schema? No, required enum.
    // Default above handles null.

    // Type assertion for validation input
    const input = {
        name: rawData.name as string,
        email: rawData.email as string,
        password: rawData.password as string,
        role: rawData.role as 'LEARNER' | 'MENTOR'
    }

    const parsed = RegisterSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input data. Password must be at least 6 characters." };
    }

    const { email, password, name, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) return { success: false, error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role as Role,
                avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
            }
        })
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: "Database error" }
    }
}

export async function loginUser(formData: FormData) {
    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const parsed = LoginSchema.safeParse(rawData);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) return { success: false, error: "Invalid credentials" };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { success: false, error: "Invalid credentials" };

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
}

export async function logoutUser() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return { success: true };
}

export async function getSession() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie?.value) return null;
    try {
        return JSON.parse(sessionCookie.value) as { id: number, name: string, role: string };
    } catch (e) {
        return null;
    }
}
