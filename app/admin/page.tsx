import { SiteHeader } from "@/components/site-header"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import { Shield, Users, Activity, Trash2, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllFeedbacks } from "@/actions/feedback"
import { AdminReviewItem } from "@/components/admin-review-item"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const sessionUser = await getSession();

    if (!sessionUser || !['ADMIN', 'SUPERADMIN'].includes(sessionUser.role)) {
        redirect('/')
    }

    const feedbacks = await getAllFeedbacks();

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Shield className="h-8 w-8 text-primary" />
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage platform activity and moderate content.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    <Card className="border-border bg-card/50 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Total Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">1,248</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-card/50 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Active Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">42</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4 tracking-tight">Recent Reviews (Moderation)</h2>
                    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
                        {feedbacks.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No reviews found in the system.
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {feedbacks.map((feedback: any) => (
                                    <AdminReviewItem key={feedback.id} feedback={feedback} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
