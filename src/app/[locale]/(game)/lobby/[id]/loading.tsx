import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>

          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-2" />
            <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto" />
          </div>

          <div className="flex justify-center gap-6">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Players section skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-5 w-8 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Player cards skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Card key={i} className="aspect-square p-0">
                <CardContent className="p-3 h-full w-full flex flex-col">
                  <div className="flex justify-between items-start mb-2 min-h-6">
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-8 bg-muted rounded animate-pulse" />
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                    <div className="text-center space-y-1">
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="h-8 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}