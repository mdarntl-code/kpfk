"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
// import { useAppStore } from "@/lib/store" // Removed
import { toast } from "sonner"
import { createFeedback } from "@/actions/feedback"
import { getLastSession } from "@/actions/session"
import type { Mentor } from "@/lib/data"

interface ReviewFormProps {
  mentor: Mentor
}

export function ReviewForm({ mentor }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  // const { addReview } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }
    if (!comment.trim()) {
      toast.error("Please write a comment")
      return
    }

    // Find a session to attach this review to
    // Hardcoded learnerId = 1 for demo
    const session = await getLastSession(typeof mentor.id === 'string' ? parseInt(mentor.id) : mentor.id, 1)

    if (!session) {
      toast.error("No session found", {
        description: "You need to book a session with this mentor before leaving a review."
      })
      return
    }

    const result = await createFeedback({
      sessionId: session.id,
      rating,
      comment
    })

    if (result.success) {
      setRating(0)
      setComment("")
      toast.success("Review submitted!", {
        description: "Thank you for your feedback.",
      })
    } else {
      toast.error("Submission failed", {
        description: "Could not submit review. You might have already reviewed this session."
      })
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Rating
            </label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRate={setRating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Experience
            </label>
            <Textarea
              placeholder={`Share your experience with ${mentor.name}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none bg-background"
            />
          </div>
          <Button type="submit" size="sm" className="gap-2">
            <Send className="h-3.5 w-3.5" />
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
