"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Image as ImageIcon, Upload, Clock, Users, TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { queueNext, getRandomUnscheduledImage } from "@/app/[locale]/(admin)/admin/actions"
import { useImages } from "@/components/images-context"
import { useScopedI18n } from "@/locales/client"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DailyImage {
  id: string
  cloudinaryUrl: string
  year: number
  description: string | null
  date: Date
  _count: {
    gameProgress: number
  }
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "inline-flex items-center gap-1 text-xs font-medium mt-2",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <TrendingUp className="h-3 w-3" />
            {trend.value}
          </div>
        )}
      </CardContent>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/5" />
    </Card>
  )
}

export function AdminDashboard() {
  const {
    images,
    todayImage,
    scheduledImages,
    unscheduledImages,
  } = useImages()
  const t = useScopedI18n("admin.dashboard")

  const handleRandomImage = async () => {
    try {
      const randomImage = await getRandomUnscheduledImage()
      if (randomImage) {
        const result = await queueNext({ imageId: randomImage.id })
        if (result.data?.isToday) {
          alert("Random image set for today!")
        } else {
          alert(`Random image scheduled for ${result.data?.scheduledFor}`)
        }
      }
    } catch (error) {
      console.error("Failed to queue random image:", error)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalGamesPlayed = images.reduce((sum, img) => sum + img._count.gameProgress, 0)

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("stats.totalImages")}
          value={images.length}
          icon={<ImageIcon className="h-4 w-4" />}
          description="Total images in library"
        />
        <StatCard
          title={t("stats.scheduled")}
          value={scheduledImages.length}
          icon={<Calendar className="h-4 w-4" />}
          description="Ready for deployment"
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title={t("stats.unscheduled")}
          value={unscheduledImages.length}
          icon={<Clock className="h-4 w-4" />}
          description="Awaiting schedule"
          className="border-l-4 border-l-amber-500"
        />
        <StatCard
          title={t("stats.gamesPlayed")}
          value={totalGamesPlayed}
          icon={<Users className="h-4 w-4" />}
          description="Total engagement"
          className="border-l-4 border-l-blue-500"
        />
      </div>

      {/* Today's Image Section */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{t("todayImage.title")}</CardTitle>
              <CardDescription className="text-base mt-1">
                {t("todayImage.subtitle", { date: today.toLocaleDateString() })}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {todayImage ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-muted">
                  <Image
                    src={todayImage.cloudinaryUrl}
                    alt={todayImage.description || "Today's image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Year</div>
                    <div className="text-3xl font-bold">{todayImage.year}</div>
                  </div>
                  {todayImage.description && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Description</div>
                      <p className="text-sm">{todayImage.description}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold">{todayImage._count.gameProgress}</div>
                      <div className="text-xs text-muted-foreground">Games played</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleRandomImage} variant="outline" className="flex-1">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t("todayImage.setRandom")}
                </Button>
                <Link href="/admin/images" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("todayImage.chooseSpecific")}
                  </Button>
                </Link>
                <Link href="/admin/images/new" className="flex-1">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">{t("todayImage.noImage")}</p>
              <p className="text-sm text-muted-foreground mb-6">Set an image for today to get started</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleRandomImage} variant="outline">
                  {t("todayImage.setRandom")}
                </Button>
                <Link href="/admin/images">
                  <Button>
                    {t("todayImage.chooseSpecific")}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("recentImages.title")}</CardTitle>
              <CardDescription>Next 5 scheduled images</CardDescription>
            </div>
            <Link href="/admin/images">
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {scheduledImages.length > 0 ? (
            <div className="space-y-3">
              {scheduledImages.slice(0, 5).map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">
                        {new Date(image.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {image.description || 'No description'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {t("recentImages.year", { year: image.year })}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t("recentImages.noScheduled")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}