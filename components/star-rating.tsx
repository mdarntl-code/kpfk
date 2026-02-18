"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRate?: (rating: number) => void
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating)
        const partial = i === Math.floor(rating) && rating % 1 > 0

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              "relative",
              interactive && "cursor-pointer transition-transform hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-accent text-accent"
                  : partial
                    ? "text-accent"
                    : "text-border"
              )}
            />
            {partial && (
              <Star
                className={cn(
                  sizeMap[size],
                  "absolute inset-0 fill-accent text-accent"
                )}
                style={{ clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
