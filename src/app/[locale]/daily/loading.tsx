import { Skeleton } from "@/components/ui/skeleton"

export default function DailyLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="space-y-6">
        <Skeleton className="aspect-video w-full rounded-xl shadow-lg" />

        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-64 mx-auto" />
            <div className="space-y-4">
              <Skeleton className="h-14 w-full rounded-lg" />
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}