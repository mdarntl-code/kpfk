"use client"

import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/data"

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                {review.learnerAvatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {review.learnerName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="mt-0.5">
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
