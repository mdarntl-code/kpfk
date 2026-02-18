"use client"

import { format } from "date-fns"
import { CalendarDays, Clock, X } from "lucide-react"
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
import { useAppStore } from "@/lib/store"
import type { Session } from "@/lib/data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: Session
}

const statusStyles: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

export function SessionCard({ session }: SessionCardProps) {
  const { cancelSession } = useAppStore()

  const handleCancel = () => {
    cancelSession(session.id)
    toast.success("Session cancelled", {
      description: `Your session with ${session.mentorName} has been cancelled.`,
    })
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
                {format(new Date(session.date), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {session.time}
              </span>
            </div>
          </div>
        </div>
        {session.status === "upcoming" && (
          <div className="mt-4 flex justify-end">
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
                    {format(new Date(session.date), "MMMM d")} at {session.time}.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Session</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
