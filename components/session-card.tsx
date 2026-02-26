"use client"

import { format, parse } from "date-fns"
import { CalendarDays, Clock, X, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Session } from "@/lib/data"
import { updateSessionStatus } from "@/actions/session"
import { SessionStatus } from "@prisma/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { ReviewForm } from "@/components/review-form"
import { useState } from "react"

interface SessionCardProps {
  session: Session
  userRole?: "learner" | "mentor"
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

export function SessionCard({ session, userRole }: SessionCardProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const handleCancel = async () => {
    const result = await updateSessionStatus(Number(session.id), SessionStatus.CANCELLED)
    if (result.success) {
      toast.success("Session cancelled", {
        description: `Your session with ${session.mentorName} has been cancelled.`,
      })
    } else {
      toast.error("Failed to cancel session")
    }
  }

  const handleConfirm = async () => {
    const result = await updateSessionStatus(Number(session.id), SessionStatus.CONFIRMED)
    if (result.success) {
      toast.success("Session confirmed")
    } else {
      toast.error("Failed to confirm session")
    }
  }

  const handleComplete = async () => {
    const result = await updateSessionStatus(Number(session.id), SessionStatus.COMPLETED)
    if (result.success) {
      toast.success("Session marked as completed")
    } else {
      toast.error("Failed to complete session")
    }
  }

  return (
    <Card className="border-border bg-card transition-all hover:shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {session.mentorAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {session.mentorName}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0 text-xs capitalize",
                  statusStyles[session.status]
                )}
              >
                {session.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs font-medium text-foreground/70">
              {session.skill}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(parse(session.date, 'yyyy-MM-dd', new Date()), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.time}
              </span>
            </div>
          </div>
        </div>
        {(session.status === "pending" || session.status === "confirmed") && (
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            {(userRole === "mentor" && session.status === "pending") && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleConfirm}
                className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Confirm
              </Button>
            )}
            {(session.status === "confirmed") && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
                className="gap-1.5 border-success/30 text-success hover:bg-success/5 hover:text-success"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Completed
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel Session
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel your session with {session.mentorName} on{" "}
                    {format(parse(session.date, 'yyyy-MM-dd', new Date()), "MMMM d")} at {session.time}.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Session</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {(session.status === "completed" && !session.isReviewed) && (
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Leave Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle className="sr-only">Leave Feedback</DialogTitle>
                <ReviewForm
                  sessionId={Number(session.id)}
                  mentorName={session.mentorName}
                  onSuccess={() => setIsReviewOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
