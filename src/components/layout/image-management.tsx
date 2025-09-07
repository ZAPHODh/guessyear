"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Upload, Trash2, Clock, Edit } from "lucide-react"
import Image from "next/image"
import {
  setTodayImage,
  deleteImage,
  bulkScheduleRandom
} from "@/app/[locale]/(admin)/admin/actions"
import { useImages } from "@/components/images-context"
import { useScopedI18n } from "@/locales/client"
import Link from "next/link"

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

export function ImageManagement() {
  const {
    images,
    scheduledImages,
    unscheduledImages
  } = useImages()
  const t = useScopedI18n("admin.images")
  const tActions = useScopedI18n("admin.actions")

  const [bulkScheduleForm, setBulkScheduleForm] = useState({
    startDate: "",
    days: 30
  })

  const handleSetToday = async (imageId: string) => {
    try {
      await setTodayImage({ imageId })
    } catch (error) {
      console.error("Failed to set today's image:", error)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm(tActions("confirmDelete"))) return

    try {
      await deleteImage({ imageId })
    } catch (error) {
      console.error("Failed to delete image:", error)
    }
  }

  const handleBulkSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await bulkScheduleRandom(bulkScheduleForm)
      setBulkScheduleForm({ startDate: "", days: 30 })
      alert(t("bulk.success", { count: result.data?.scheduled || 0 }))
    } catch (error) {
      console.error("Failed to bulk schedule:", error)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">{t("tabs.upload")}</TabsTrigger>
          <TabsTrigger value="scheduled">{t("tabs.scheduled")}</TabsTrigger>
          <TabsTrigger value="unscheduled">{t("tabs.unscheduled")}</TabsTrigger>
          <TabsTrigger value="bulk">{t("tabs.bulk")}</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("upload.title")}</CardTitle>
              <CardDescription>
                {t("upload.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Link href="/admin/images/new">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  {t("upload.button")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("scheduled.title", { count: scheduledImages.length })}</CardTitle>
              <CardDescription>
                {t("scheduled.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {scheduledImages.map((image) => {
                  const imgDate = new Date(image.date)
                  const isToday = imgDate.getTime() === today.getTime()
                  const isPast = imgDate < today

                  return (
                    <div key={image.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="relative w-24 h-16 rounded overflow-hidden">
                        <Image
                          src={image.cloudinaryUrl}
                          alt={image.description || "Daily image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {imgDate.toLocaleDateString()}
                          </span>
                          {isToday && <Badge>{t("scheduled.today")}</Badge>}
                          {isPast && <Badge variant="secondary">{t("scheduled.past")}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("scheduled.year", { year: image.year })} • {t("scheduled.games", { count: image._count.gameProgress })}
                        </div>
                        {image.description && (
                          <div className="text-sm text-muted-foreground">
                            {image.description}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!isToday && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetToday(image.id)}
                          >
                            {t("scheduled.setToday")}
                          </Button>
                        )}
                        <Link href={`/admin/images/${image.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {image._count.gameProgress === 0 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {scheduledImages.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    {t("scheduled.noImages")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unscheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("unscheduled.title", { count: unscheduledImages.length })}</CardTitle>
              <CardDescription>
                {t("unscheduled.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {unscheduledImages.map((image) => (
                  <div key={image.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative w-24 h-16 rounded overflow-hidden">
                      <Image
                        src={image.cloudinaryUrl}
                        alt={image.description || "Daily image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{t("unscheduled.year", { year: image.year })}</div>
                      {image.description && (
                        <div className="text-sm text-muted-foreground">
                          {image.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSetToday(image.id)}
                      >
                        {t("unscheduled.setToday")}
                      </Button>
                      <Link href={`/admin/images/${image.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {unscheduledImages.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    {t("unscheduled.noImages")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("bulk.title")}</CardTitle>
              <CardDescription>
                {t("bulk.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBulkSchedule} className="space-y-4">
                <div>
                  <Label htmlFor="startDate">{t("bulk.startDate")}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={bulkScheduleForm.startDate}
                    onChange={(e) => setBulkScheduleForm({ ...bulkScheduleForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="days">{t("bulk.days")}</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="365"
                    value={bulkScheduleForm.days}
                    onChange={(e) => setBulkScheduleForm({ ...bulkScheduleForm, days: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit" disabled={unscheduledImages.length === 0}>
                  <Clock className="mr-2 h-4 w-4" />
                  {t("bulk.button", { count: unscheduledImages.length })}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}