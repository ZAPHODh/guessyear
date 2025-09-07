"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoaderCircle, Save, Trash2 } from "lucide-react"
import { scheduleImage, deleteImage } from "@/app/[locale]/(admin)/admin/actions"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useScopedI18n } from "@/locales/client"
import Image from "next/image"

const createImageEditSchema = (t: any) => z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: t("date.error")
  }),
  description: z.string().optional(),
})

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

interface ImageEditFormProps {
  image: DailyImage
  onSuccess?: () => void
  onDelete?: () => void
}

export function ImageEditForm({ image, onSuccess, onDelete }: ImageEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const t = useScopedI18n("admin.forms.edit")
  
  const imageEditSchema = createImageEditSchema(t)
  type ImageEditFormValues = z.infer<typeof imageEditSchema>

  const form = useForm<ImageEditFormValues>({
    resolver: zodResolver(imageEditSchema),
    defaultValues: {
      date: new Date(image.date).toISOString().split('T')[0],
      description: image.description || "",
    },
  })

  async function onSubmit(values: ImageEditFormValues) {
    setIsSubmitting(true)
    try {
      await scheduleImage({
        imageId: image.id,
        date: values.date
      })
      toast.success(t("updateSuccess"))
      onSuccess?.()
    } catch (error) {
      toast.error(t("updateError"))
      console.error("Update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (image._count.gameProgress > 0) {
      toast.error(t("deleteBlocked"))
      return
    }

    setIsDeleting(true)
    try {
      await deleteImage({ imageId: image.id })
      toast.success(t("deleteSuccess"))
      onDelete?.()
    } catch (error) {
      toast.error(t("deleteError"))
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const canDelete = image._count.gameProgress === 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-32 h-20 rounded-lg overflow-hidden">
          <Image
            src={image.cloudinaryUrl}
            alt={image.description || "Image"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{t("year", { year: image.year })}</h3>
          <p className="text-sm text-muted-foreground">
            {t("gamesPlayed", { count: image._count.gameProgress })}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("date.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  {t("date.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("description.placeholder")}
                    className="resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  {t("description.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {t("saveButton")}
            </Button>

            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("deleteButton")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      {t("delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}