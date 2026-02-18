"use client"

import Link from "next/link"
import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import type { Mentor } from "@/lib/data"

interface MentorCardProps {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-start gap-4 p-5">
            <Avatar className="h-14 w-14 border-2 border-primary/10 text-sm font-semibold">
              <AvatarFallback className="bg-primary/10 text-primary">
                {mentor.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/mentor/${mentor.id}`}
                  className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {mentor.name}
                </Link>
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-primary/10 text-primary hover:bg-primary/10"
                >
                  {mentor.category}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                {mentor.skill}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={mentor.rating} size="sm" />
                  <span className="text-xs font-medium text-foreground">
                    {mentor.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({mentor.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-5 py-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {mentor.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                30 min
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="text-lg font-bold text-foreground">
              ${mentor.rate}
              <span className="text-xs font-normal text-muted-foreground">
                /session
              </span>
            </span>
            <Link href={`/mentor/${mentor.id}`}>
              <Button size="sm" className="gap-1">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
