import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MentorCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-start gap-4 p-5">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="border-t border-border px-5 py-3">
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
