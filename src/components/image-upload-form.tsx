"use client"

import { useState, useRef } from "react"
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
import { LoaderCircle, Upload, X, ImageIcon } from "lucide-react"
import { uploadImage } from "@/app/[locale]/(admin)/admin/actions"
import { toast } from "sonner"
import { useScopedI18n } from "@/locales/client"
import { MultiLanguageTextarea } from "@/components/ui/multi-language-textarea"
import type { LocalizedTips } from "@/types/tip"
import { createEmptyLocalizedTips } from "@/types/tip"
import { useImages } from "@/components/images-context"
import Image from "next/image"

const createImageUploadSchema = (t: any) => z.object({
  year: z.number().int().min(1800, t("year.minError")).max(new Date().getFullYear(), t("year.maxError")),
  description: z.string().optional(),
  tips: z.any().optional(),
})

interface ImageUploadFormProps {
  onSuccess?: () => void
  defaultValues?: Partial<{
    year: number
    description: string
    tips: LocalizedTips
  }>
}

export function ImageUploadForm({ onSuccess, defaultValues }: ImageUploadFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useScopedI18n("admin.forms.upload")
  const { refreshImages } = useImages()

  const imageUploadSchema = createImageUploadSchema(t)
  type ImageUploadFormValues = z.infer<typeof imageUploadSchema>

  const form = useForm<ImageUploadFormValues>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      year: defaultValues?.year || new Date().getFullYear(),
      description: defaultValues?.description || "",
      tips: defaultValues?.tips || createEmptyLocalizedTips(),
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadedUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadToCloudinary = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
      toast.success('Image uploaded to Cloudinary')
    } catch (error) {
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  async function onSubmit(values: ImageUploadFormValues) {
    if (!uploadedUrl) {
      toast.error('Please upload an image first')
      return
    }

    setIsSubmitting(true)
    try {
      await uploadImage({
        cloudinaryUrl: uploadedUrl,
        ...values,
      })
      toast.success(t("success"))
      form.reset()
      handleRemoveFile()

      await refreshImages()

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
        <div className="space-y-4">
          <FormLabel>Image File</FormLabel>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {!previewUrl ? (
              <div className="space-y-4">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSubmitting}
                  >
                    Select Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select an image file to upload
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full max-w-md mx-auto aspect-video">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  {!uploadedUrl ? (
                    <>
                      <Button
                        type="button"
                        onClick={handleUploadToCloudinary}
                        disabled={isUploading || isSubmitting}
                      >
                        {isUploading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        <Upload className="mr-2 h-4 w-4" />
                        Upload to Cloudinary
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFile}
                        disabled={isUploading || isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">✓ Uploaded to Cloudinary</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

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

        <Button type="submit" disabled={isSubmitting || !uploadedUrl} className="w-full">
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          <Upload className="mr-2 h-4 w-4" />
          {t("button")}
        </Button>
      </form>
    </Form>
  )
}