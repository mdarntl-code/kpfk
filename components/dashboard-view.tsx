"use client"

import { CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SessionCard } from "@/components/session-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Session } from "@/lib/data"

interface DashboardViewProps {
    sessions: Session[]
    userRole: "learner" | "mentor"
}

export function DashboardView({ sessions, userRole }: DashboardViewProps) {
    const upcoming = sessions.filter((s) => s.status === "upcoming")
    const completed = sessions.filter((s) => s.status === "completed")
    const cancelled = sessions.filter((s) => s.status === "cancelled")

    const stats = [
        {
            label: "Upcoming",
            value: upcoming.length,
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

                    <Tabs defaultValue="upcoming" className="space-y-4">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="upcoming" className="gap-2">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Upcoming ({upcoming.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed ({completed.length})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled" className="gap-2">
                                <XCircle className="h-3.5 w-3.5" />
                                Cancelled ({cancelled.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-3">
                            {upcoming.length === 0 ? (
                                <EmptyState
                                    icon={CalendarDays}
                                    title="No upcoming sessions"
                                    description="Book a session with a mentor to get started on your learning journey."
                                />
                            ) : (
                                upcoming.map((session) => (
                                    <SessionCard key={session.id} session={session} />
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
                                    <SessionCard key={session.id} session={session} />
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
                                    <SessionCard key={session.id} session={session} />
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
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
