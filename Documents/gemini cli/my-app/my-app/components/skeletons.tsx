import { Card, CardContent } from "@/components/ui/card"

export function PostCardSkeleton() {
  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] bg-muted" />
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatusCardSkeleton() {
  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="relative h-[60px] sm:h-[90px] md:h-[129px] bg-muted" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4 mx-auto" />
        <div className="h-8 bg-muted rounded" />
        <div className="h-8 bg-muted rounded w-2/3" />
      </CardContent>
    </Card>
  )
}

export function PredictionCardSkeleton() {
  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LiveMatchCardSkeleton() {
  return (
    <Card className="group border border-border bg-card/60 backdrop-blur-sm overflow-hidden animate-pulse">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-8" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}