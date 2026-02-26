"use client"

import { Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { deleteFeedback } from "@/actions/feedback"
import { toast } from "sonner"
import { useState } from "react"

export function AdminReviewItem({ feedback }: { feedback: any }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteFeedback(feedback.id)
        if (result.success) {
            toast.success("Review deleted successfully")
        } else {
            toast.error("Failed to delete review")
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex items-start justify-between p-6">
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                            {feedback.session.learner.name}
                        </p>
                        <span className="text-muted-foreground text-xs">reviewed</span>
                        <p className="font-medium text-sm text-primary">
                            {feedback.session.mentor.name}
                        </p>
                    </div>
                    <StarRating rating={feedback.rating} size="sm" />
                    {feedback.comment && (
                        <p className="mt-2 text-sm text-foreground/90 leading-relaxed italic border-l-2 border-primary/20 pl-3">
                            "{feedback.comment}"
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive shrink-0"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
        </div>
    )
}
