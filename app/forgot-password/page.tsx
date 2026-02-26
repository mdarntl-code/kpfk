"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { recoverPassword } from "@/actions/recovery"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await recoverPassword(formData)

        setLoading(false)

        if (result.success) {
            setSubmitted(true)
            toast.success("Recovery email sent")
        } else {
            toast.error(result.error || "Failed to process request")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Recover Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                {!submitted ? (
                    <form onSubmit={onSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center text-sm">
                                Remember your password?{" "}
                                <Link href="/login" className="underline">
                                    Login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    <CardContent className="flex flex-col items-center gap-4 py-6">
                        <div className="text-center text-sm text-muted-foreground">
                            If an account exists with that email, a password reset link has been sent.
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login">Return to login</Link>
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
