"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays, Clock, CreditCard, CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
// import { useAppStore } from "@/lib/store" // Removed
import { createSession } from "@/actions/session"
import type { Mentor } from "@/lib/data"
import { toast } from "sonner"

interface BookingModalProps {
  mentor: Mentor
  learnerId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "date" | "time" | "checkout" | "success"

export function BookingModal({ mentor, learnerId, open, onOpenChange }: BookingModalProps) {
  const [step, setStep] = useState<Step>("date")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  // const { addSession } = useAppStore()

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) setStep("time")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep("checkout")
  }

  const handlePayment = async () => {
    if (!learnerId || learnerId === 0) {
      toast.error("Authentication required", {
        description: "Please log in to book a session."
      })
      window.location.href = '/login'
      return
    }

    setIsProcessing(true)

    // In a real app, strict date/time handling is needed.
    // Here we assume selectedDate and selectedTime are valid.
    if (!selectedDate || !selectedTime) return

    const dateStr = format(selectedDate, "yyyy-MM-dd")

    const result = await createSession({
      mentorId: typeof mentor.id === 'string' ? parseInt(mentor.id) : mentor.id,
      learnerId: learnerId,
      title: mentor.skill,
      date: dateStr,
      time: selectedTime,
      price: mentor.rate
    })

    setIsProcessing(false)

    if (result.success) {
      setStep("success")
      toast.success("Session booked successfully!", {
        description: `Your session with ${mentor.name} has been confirmed.`,
      })
    } else {
      toast.error("Booking failed", {
        description: "Please try again later."
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep("date")
      setSelectedDate(undefined)
      setSelectedTime(null)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card p-0 gap-0 overflow-hidden">
        <div className="bg-primary/5 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {step === "success" ? "Booking Confirmed" : `Book a Session`}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {mentor.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{mentor.name}</p>
              <p className="text-xs text-muted-foreground">{mentor.skill}</p>
            </div>
            <Badge className="ml-auto bg-primary text-primary-foreground">
              {mentor.rate} credits
            </Badge>
          </div>
        </div>

        <div className="px-6 py-5">
          {step === "date" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Select a Date
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-lg border border-border mx-auto"
              />
            </div>
          )}

          {step === "time" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Select a Time Slot
              </div>
              {selectedDate && (
                <p className="text-xs text-muted-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {mentor.availability.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("date")}
                className="text-muted-foreground"
              >
                Back to calendar
              </Button>
            </div>
          )}

          {step === "checkout" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                Checkout Summary
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mentor</span>
                  <span className="font-medium text-foreground">{mentor.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skill</span>
                  <span className="font-medium text-foreground">{mentor.skill}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">30 minutes</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {mentor.rate} credits
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("time")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${mentor.rate} credits`
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                You{"'"}re all set!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your session with {mentor.name} is confirmed for{" "}
                {selectedDate && format(selectedDate, "MMM d")} at {selectedTime}.
              </p>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={() => (window.location.href = "/dashboard")}>
                  View Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        {step !== "success" && step !== "checkout" && (
          <div className="border-t border-border bg-muted/30 px-6 py-3">
            <div className="flex items-center gap-2">
              {(["date", "time", "checkout"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      step === s || (["date", "time", "checkout"].indexOf(step) > i)
                        ? "bg-primary"
                        : "bg-border"
                    )}
                  />
                  {i < 2 && (
                    <div
                      className={cn(
                        "h-px w-8 transition-colors",
                        ["date", "time", "checkout"].indexOf(step) > i
                          ? "bg-primary"
                          : "bg-border"
                      )}
                    />
                  )}
                </div>
              ))}
              <span className="ml-2 text-xs text-muted-foreground">
                Step {["date", "time", "checkout"].indexOf(step) + 1} of 3
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
