"use client"

import { SiteHeader } from "@/components/site-header"
import { MentorDiscovery } from "@/components/mentor-discovery"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <MentorDiscovery />
      </main>
    </div>
  )
}
