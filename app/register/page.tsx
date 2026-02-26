"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { registerUser } from "@/actions/auth"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await registerUser(formData)

        setLoading(false)

        if (result.success) {
            toast.success("Account created successfully")
            router.push("/login")
        } else {
            toast.error(result.error || "Failed to create account")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
            <div className="absolute inset-0 z-0 bg-background/80 backdrop-blur-3xl" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            <Card className="z-10 w-full max-w-sm border-border/50 bg-card/60 shadow-lg backdrop-blur-xl sm:rounded-3xl p-2">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your details to get started
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Name</Label>
                            <Input id="name" name="name" type="text" placeholder="John Doe" className="h-11 bg-background/50 text-base shadow-none sm:text-sm" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" className="h-11 bg-background/50 text-base shadow-none sm:text-sm" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-semibold uppercase text-muted-foreground">Password</Label>
                            <Input id="password" name="password" type="password" className="h-11 bg-background/50 text-base shadow-none sm:text-sm" required />
                        </div>
                        <div className="grid gap-3 pt-2">
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">I want to join as a:</Label>
                            <RadioGroup defaultValue="LEARNER" name="role" className="grid grid-cols-2 gap-4">
                                <div className="flex h-11 items-center space-x-2 rounded-xl border border-border/50 bg-background/50 px-3 transition-colors hover:bg-muted/50">
                                    <RadioGroupItem value="LEARNER" id="learner" />
                                    <Label htmlFor="learner" className="cursor-pointer flex-1 font-medium">Learner</Label>
                                </div>
                                <div className="flex h-11 items-center space-x-2 rounded-xl border border-border/50 bg-background/50 px-3 transition-colors hover:bg-muted/50">
                                    <RadioGroupItem value="MENTOR" id="mentor" />
                                    <Label htmlFor="mentor" className="cursor-pointer flex-1 font-medium">Mentor</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-2">
                        <Button className="h-11 w-full rounded-xl font-medium" disabled={loading}>
                            {loading ? "Creating account..." : "Continue"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-foreground hover:underline">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
