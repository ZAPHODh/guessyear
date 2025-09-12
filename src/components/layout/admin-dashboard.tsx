"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Image as ImageIcon, Upload, Clock, Users } from "lucide-react"
import Link from "next/link"
import { queueNext, getRandomUnscheduledImage } from "@/app/[locale]/(admin)/admin/actions"
import { useImages } from "@/components/images-context"
import { useScopedI18n } from "@/locales/client"
import Image from "next/image"

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.totalImages")}</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.scheduled")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledImages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.unscheduled")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unscheduledImages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.gamesPlayed")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {images.reduce((sum, img) => sum + img._count.gameProgress, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("todayImage.title")}</CardTitle>
          <CardDescription>
            {t("todayImage.subtitle", { date: today.toLocaleDateString() })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayImage ? (
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                <Image
                  src={todayImage.cloudinaryUrl}
                  alt={todayImage.description || "Today's image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t("todayImage.year", { year: todayImage.year })}</div>
                <div className="text-sm text-muted-foreground">
                  {todayImage.description}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("todayImage.gamesPlayed", { count: todayImage._count.gameProgress })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("todayImage.noImage")}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={handleRandomImage} variant="outline">
              {t("todayImage.setRandom")}
            </Button>
            <Link href="/admin/images">
              <Button variant="outline">
                {t("todayImage.chooseSpecific")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("recentImages.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scheduledImages.slice(0, 5).map((image) => (
              <div key={image.id} className="flex items-center justify-between text-sm">
                <span>{new Date(image.date).toLocaleDateString()}</span>
                <Badge variant="secondary">{t("recentImages.year", { year: image.year })}</Badge>
              </div>
            ))}
            {scheduledImages.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("recentImages.noScheduled")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}