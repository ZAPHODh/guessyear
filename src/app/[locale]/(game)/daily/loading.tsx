import { Skeleton } from "@/components/ui/skeleton"
import { Info } from "lucide-react"

export default function DailyLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground animate-pulse" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <Skeleton className="h-full w-full animate-pulse" />
          </div>


          <div className="space-y-6">
            <div className="space-y-4">

              <Skeleton className="h-6 w-64 mx-auto" />

              <div className="space-y-4">
                <Skeleton className="h-14 w-full rounded-lg" />

                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-48 mx-auto" />
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-16 h-1 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />

            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}