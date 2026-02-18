"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MentorCard } from "@/components/mentor-card"
import { MentorCardSkeleton } from "@/components/mentor-card-skeleton"
// import { mentors } from "@/lib/data" // Removed
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { getMentors } from "@/actions/user"

export function MentorDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [mentors, setMentors] = useState<any[]>([]) // Using any[] to bypass strict type check for now, or we can import User type

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true)
      try {
        const data = await getMentors(activeCategory, searchQuery)
        setMentors(data)
      } catch (error) {
        console.error("Failed to fetch mentors", error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchMentors()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, activeCategory])

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find Your Perfect Mentor
        </h1>
        <p className="mx-auto max-w-xl text-pretty text-muted-foreground">
          Connect with local experts for personalized 30-minute sessions.
          Learn something new today.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mentors, skills, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 bg-card"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full",
              activeCategory === category
                ? ""
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MentorCardSkeleton key={i} />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
          <Search className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No mentors found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            // Verify MentorCard can accept this mentor object (which has int id)
            // We might need to map it or cast it.
            // MentorCard expects Mentor interface.
            // Let's modify MentorCard next to accept this structure.
            <MentorCard key={mentor.id} mentor={mentor as any} />
          ))}
        </div>
      )}
    </div>
  )
}
