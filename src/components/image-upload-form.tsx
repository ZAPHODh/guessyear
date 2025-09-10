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
import { LoaderCircle, Upload } from "lucide-react"
import { uploadImage } from "@/app/[locale]/(admin)/admin/actions"
import { toast } from "sonner"
import { useScopedI18n } from "@/locales/client"
import { MultiLanguageTextarea } from "@/components/ui/multi-language-textarea"
import type { LocalizedTips } from "@/types/tip"
import { createEmptyLocalizedTips } from "@/types/tip"

const createImageUploadSchema = (t: any) => z.object({
  cloudinaryUrl: z.string().url({ message: t("cloudinaryUrl.error") }),
  year: z.number().int().min(1800, t("year.minError")).max(new Date().getFullYear(), t("year.maxError")),
  description: z.string().optional(),
  tips: z.any().optional(),
})

interface ImageUploadFormProps {
  onSuccess?: () => void
  defaultValues?: Partial<{
    cloudinaryUrl: string
    year: number
    description: string
    tips: LocalizedTips
  }>
}

export function ImageUploadForm({ onSuccess, defaultValues }: ImageUploadFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useScopedI18n("admin.forms.upload")
  
  const imageUploadSchema = createImageUploadSchema(t)
  type ImageUploadFormValues = z.infer<typeof imageUploadSchema>

  const form = useForm<ImageUploadFormValues>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      cloudinaryUrl: defaultValues?.cloudinaryUrl || "",
      year: defaultValues?.year || new Date().getFullYear(),
      description: defaultValues?.description || "",
      tips: defaultValues?.tips || createEmptyLocalizedTips(),
    },
  })

  async function onSubmit(values: ImageUploadFormValues) {
    setIsSubmitting(true)
    try {
      await uploadImage(values)
      toast.success(t("success"))
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error(t("error"))
      console.error("Upload error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cloudinaryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("cloudinaryUrl.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("cloudinaryUrl.placeholder")}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t("cloudinaryUrl.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("year.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1800}
                  max={new Date().getFullYear()}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t("year.description")}
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

        <FormField
          control={form.control}
          name="tips"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tip.label")}</FormLabel>
              <FormControl>
                <MultiLanguageTextarea
                  value={field.value || createEmptyLocalizedTips()}
                  onChange={field.onChange}
                  placeholder={t("tip.placeholder")}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t("tip.description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          <Upload className="mr-2 h-4 w-4" />
          {t("button")}
        </Button>
      </form>
    </Form>
  )
}