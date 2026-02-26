"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { loginUser } from "@/actions/auth"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await loginUser(formData)

        setLoading(false)

        if (result.success) {
            toast.success("Logged in successfully")
            router.push("/dashboard")
        } else {
            toast.error(result.error || "Failed to login")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
            <div className="absolute inset-0 z-0 bg-background/80 backdrop-blur-3xl" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            <Card className="z-10 w-full max-w-sm border-border/50 bg-card/60 shadow-lg backdrop-blur-xl sm:rounded-3xl p-2">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" className="h-11 bg-background/50 text-base shadow-none sm:text-sm" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="text-xs font-semibold uppercase text-muted-foreground">Password</Label>
                                <Link href="/forgot-password" className="ml-auto inline-block text-xs font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" className="h-11 bg-background/50 text-base shadow-none sm:text-sm" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="h-11 w-full rounded-xl font-medium" disabled={loading}>
                            {loading ? "Logging in..." : "Sign in"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-medium text-foreground hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
