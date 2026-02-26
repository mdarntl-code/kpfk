"use client"

import { useState } from "react"
import { CheckCircle2, User, BookOpen, Clock, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { categories } from "@/lib/data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { updateMentorProfile } from "@/actions/user"
import { getSession } from "@/actions/auth"

const timeSlots = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM",
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM",
]

export default function CreateProfilePage() {
  const [name, setName] = useState("")
  const [skill, setSkill] = useState("")
  const [category, setCategory] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [rate, setRate] = useState("15")
  const [videoPresentation, setVideoPresentation] = useState("")
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !skill || !category || !bio || !location || !rate) {
      toast.error("Please fill in all required fields")
      return
    }
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one available time slot")
      return
    }

    setIsSubmitting(true)

    const session = await getSession();
    if (!session) {
      toast.error("You must be logged in to create a profile");
      setIsSubmitting(false)
      return;
    }

    const result = await updateMentorProfile(session.id, {
      name, skill, category, bio, location, rate, videoPresentation, availability: selectedSlots
    })

    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
      toast.success("Profile created!", {
        description: "Your mentor profile is now live.",
      })
    } else {
      toast.error(result.error || "An error occurred")
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Welcome aboard!
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Your mentor profile has been created successfully. Learners can now
            find you and book sessions.
          </p>
          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Edit Profile
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              View Discovery
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Become a Mentor
          </h1>
          <p className="mt-1 text-muted-foreground">
            Share your expertise and help others learn. Fill out the form below to
            create your mentor profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription>Tell learners about yourself.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Brooklyn, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell learners about your experience and teaching style..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="resize-none bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length}/300 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoPresentation">Video Presentation Link (Optional)</Label>
                <Input
                  id="videoPresentation"
                  placeholder="e.g., https://youtube.com/watch?v=..."
                  value={videoPresentation}
                  onChange={(e) => setVideoPresentation(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Skill Details</CardTitle>
                  <CardDescription>What will you teach?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Skill Name</Label>
                <Input
                  id="skill"
                  placeholder="e.g., Guitar Basics, Python Programming"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="rate">Session Rate ($ per 30 mins)</Label>
                <Input
                  id="rate"
                  type="number"
                  min="5"
                  placeholder="15"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Availability</CardTitle>
                  <CardDescription>
                    Select your available time slots for 30-minute sessions.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlots.includes(slot)
                  return (
                    <Badge
                      key={slot}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer px-3 py-1.5 text-xs transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => toggleSlot(slot)}
                    >
                      {slot}
                    </Badge>
                  )
                })}
              </div>
              {selectedSlots.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {selectedSlots.length} time slot{selectedSlots.length > 1 ? "s" : ""} selected
                </p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Mentor Profile"}
          </Button>
        </form>
      </main>
    </div>
  )
}
