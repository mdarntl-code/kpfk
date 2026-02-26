"use client"

import { useState, useEffect } from "react"

import { CalendarDays, CheckCircle2, XCircle, Clock, Wallet, ArrowRightLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SessionCard } from "@/components/session-card"
import { requestWithdrawal } from "@/actions/user"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Session } from "@/lib/data"

interface DashboardViewProps {
    sessions: Session[]
    userRole: "learner" | "mentor"
    wallet?: { balance: number, withdrawals: any[] }
    userId: number
}

export function DashboardView({ sessions, userRole, wallet, userId }: DashboardViewProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const pending = sessions.filter((s) => s.status === "pending")
    const confirmed = sessions.filter((s) => s.status === "confirmed")
    const completed = sessions.filter((s) => s.status === "completed")
    const cancelled = sessions.filter((s) => s.status === "cancelled")

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                    <div className="h-24 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const stats = [
        {
            label: "Pending",
            value: pending.length,
            icon: Clock,
            color: "text-amber-500 bg-amber-500/10",
        },
        {
            label: "Confirmed",
            value: confirmed.length,
            icon: CalendarDays,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Completed",
            value: completed.length,
            icon: CheckCircle2,
            color: "text-success bg-success/10",
        },
        {
            label: "Cancelled",
            value: cancelled.length,
            icon: XCircle,
            color: "text-destructive bg-destructive/10",
        },
        {
            label: "Total Hours",
            value: `${(completed.length * 0.5).toFixed(1)}h`,
            icon: Clock,
            color: "text-accent-foreground bg-accent/30",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                            {userRole === "mentor" ? "Mentor" : "Learner"} Dashboard
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {userRole === "mentor"
                                ? "Manage your teaching sessions and availability."
                                : "Track your learning sessions and progress."}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <Card key={stat.label} className="border-border bg-card">
                                    <CardContent className="flex items-center gap-4 p-5">
                                        <div
                                            className={cn(
                                                "flex h-11 w-11 items-center justify-center rounded-lg",
                                                stat.color
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-foreground">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <Tabs defaultValue="pending" className="space-y-4">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="pending" className="gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                Pending ({pending.length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed" className="gap-2">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Confirmed ({confirmed.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed ({completed.length})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled" className="gap-2">
                                <XCircle className="h-3.5 w-3.5" />
                                Cancelled ({cancelled.length})
                            </TabsTrigger>
                            {userRole === 'mentor' && (
                                <TabsTrigger value="wallet" className="gap-2">
                                    <Wallet className="h-3.5 w-3.5" />
                                    Wallet
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="pending" className="space-y-3">
                            {pending.length === 0 ? (
                                <EmptyState
                                    icon={Clock}
                                    title="No pending sessions"
                                    description="You don't have any sessions awaiting confirmation."
                                />
                            ) : (
                                pending.map((session) => (
                                    <SessionCard key={session.id} session={session} userRole={userRole} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="confirmed" className="space-y-3">
                            {confirmed.length === 0 ? (
                                <EmptyState
                                    icon={CalendarDays}
                                    title="No confirmed sessions"
                                    description="Book a session with a mentor to get started on your learning journey."
                                />
                            ) : (
                                confirmed.map((session) => (
                                    <SessionCard key={session.id} session={session} userRole={userRole} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-3">
                            {completed.length === 0 ? (
                                <EmptyState
                                    icon={CheckCircle2}
                                    title="No completed sessions"
                                    description="Your completed sessions will appear here."
                                />
                            ) : (
                                completed.map((session) => (
                                    <SessionCard key={session.id} session={session} userRole={userRole} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="cancelled" className="space-y-3">
                            {cancelled.length === 0 ? (
                                <EmptyState
                                    icon={XCircle}
                                    title="No cancelled sessions"
                                    description="Your cancelled sessions will appear here."
                                />
                            ) : (
                                cancelled.map((session) => (
                                    <SessionCard key={session.id} session={session} userRole={userRole} />
                                ))
                            )}
                        </TabsContent>

                        {userRole === 'mentor' && wallet && (
                            <TabsContent value="wallet" className="mt-6">
                                <WalletTab wallet={wallet} userId={userId} />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

function WalletTab({ wallet, userId }: { wallet: { balance: number, withdrawals: any[] }, userId: number }) {
    const handleWithdraw = async (formData: FormData) => {
        const amount = parseFloat(formData.get("amount") as string);
        if (amount > 0 && amount <= wallet.balance) {
            await requestWithdrawal(userId, amount);
        }
    }

    return (
        <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-border bg-card/60 backdrop-blur-xl sm:col-span-1 border-primary/20 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Wallet className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Available Balance</p>
                            <p className="text-4xl font-bold tracking-tight text-foreground mt-2">${wallet.balance.toFixed(2)}</p>
                        </div>
                        <form action={handleWithdraw} className="mt-4 flex flex-col gap-3">
                            <input type="hidden" name="amount" value={wallet.balance} />
                            <button
                                type="submit"
                                disabled={wallet.balance <= 0}
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Withdraw Funds
                            </button>
                            <p className="text-xs text-muted-foreground">Allows withdrawing full amount.</p>
                        </form>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card/60 backdrop-blur-xl sm:col-span-2 shadow-sm">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold tracking-tight">Withdrawal History</h3>
                </div>
                <CardContent className="p-0">
                    {wallet.withdrawals.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">
                            No withdrawal history yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {wallet.withdrawals.map((w: any) => (
                                <div key={w.id} className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Withdrawal</p>
                                            <p className="text-sm text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">-${w.amount.toFixed(2)}</p>
                                        <p className={cn(
                                            "text-xs font-medium uppercase",
                                            w.status === 'COMPLETED' ? 'text-success' :
                                                w.status === 'PENDING' ? 'text-amber-500' : 'text-destructive'
                                        )}>{w.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
            <Icon className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
