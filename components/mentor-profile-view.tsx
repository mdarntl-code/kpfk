"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    CalendarDays,
    MessageSquare,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/star-rating"
import { ReviewList } from "@/components/review-list"
import { ReviewForm } from "@/components/review-form"
import { BookingModal } from "@/components/booking-modal"
import type { Mentor, Review } from "@/lib/data"

interface MentorProfileViewProps {
    mentor: Mentor
    reviews: Review[]
}

export function MentorProfileView({ mentor, reviews }: MentorProfileViewProps) {
    const [bookingOpen, setBookingOpen] = useState(false)

    // Filter reviews for this mentor (though passed reviews should already be filtered)
    // The passed `reviews` are already filtered by the server action.
    const mentorReviews = reviews

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Discovery
                    </Button>
                </Link>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border bg-card overflow-hidden">
                            <div className="bg-primary/5 p-6 sm:p-8">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                    <Avatar className="h-20 w-20 border-4 border-card text-lg font-bold shadow-sm">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {mentor.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                                                    {mentor.name}
                                                </h1>
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                                                    {mentor.category}
                                                </Badge>
                                            </div>
                                            <p className="mt-0.5 text-base font-medium text-foreground/80">
                                                {mentor.skill}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {mentor.location}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                30 min sessions
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                                {mentor.rating} ({mentor.reviewCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 sm:p-8">
                                <h2 className="text-base font-semibold text-foreground">About</h2>
                                <p className="mt-2 leading-relaxed text-foreground/80">
                                    {mentor.bio}
                                </p>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="reviews" className="space-y-4">
                            <TabsList className="bg-muted">
                                <TabsTrigger value="reviews" className="gap-2">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Reviews ({mentorReviews.length})
                                </TabsTrigger>
                                <TabsTrigger value="availability" className="gap-2">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Availability
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="reviews" className="space-y-4">
                                <ReviewList reviews={mentorReviews} />
                                <ReviewForm mentor={mentor} />
                            </TabsContent>

                            <TabsContent value="availability">
                                <Card className="border-border bg-card">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-semibold text-foreground">
                                            Available Time Slots
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.availability.map((time) => (
                                                <Badge
                                                    key={time}
                                                    variant="outline"
                                                    className="border-primary/30 px-3 py-1.5 text-foreground"
                                                >
                                                    {time}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="mt-4 text-xs text-muted-foreground">
                                            Availability may vary. Book a session to secure your slot.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-4">
                        <Card className="sticky top-24 border-border bg-card">
                            <CardContent className="p-6 space-y-5">
                                <div className="text-center">
                                    <span className="text-3xl font-bold text-foreground">
                                        ${mentor.rate}
                                    </span>
                                    <span className="text-sm text-muted-foreground">/session</span>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium text-foreground">30 minutes</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Format</span>
                                        <span className="font-medium text-foreground">1-on-1</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Rating</span>
                                        <div className="flex items-center gap-1.5">
                                            <StarRating rating={mentor.rating} size="sm" />
                                            <span className="font-medium text-foreground">{mentor.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => setBookingOpen(true)}
                                >
                                    Book for ${mentor.rate}
                                </Button>
                                <p className="text-center text-xs text-muted-foreground">
                                    Free cancellation up to 24 hours before
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <BookingModal
                mentor={mentor}
                open={bookingOpen}
                onOpenChange={setBookingOpen}
            />
        </div>
    )
}
