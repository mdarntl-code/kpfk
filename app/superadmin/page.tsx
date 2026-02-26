import { SiteHeader } from "@/components/site-header"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import { ShieldAlert, Database, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function SuperadminDashboardPage() {
    const sessionUser = await getSession();

    if (!sessionUser || sessionUser.role !== 'SUPERADMIN') {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                        Superadmin Controls
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        System-level management and configuration.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Card className="border-border bg-card/80 backdrop-blur-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                Database Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Database Status</span>
                                <span className="text-success font-medium">Healthy</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Records</span>
                                <span className="font-medium">24,591</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card/80 backdrop-blur-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                System Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            Configure global platform settings, API keys, and access controls here.
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
