"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { User } from "@prisma/client"
import { useTransition, useMemo, useRef, useState } from "react"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, X } from "lucide-react"
import { updateSettings } from "@/app/[locale]/(user)/settings/actions"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"

type SettingsFormProps = {
  user: User
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const t = useScopedI18n("settings")

  const FormSchema = useMemo(() => z.object({
    name: z.string().min(2, {
      message: t("nameError"),
    }),
    email: z.string().email({
      message: t("emailError"),
    }),
    picture: z.string().optional(),
  }), [t])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      picture: user.picture || "",
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("fileSizeError"));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t("fileTypeError"));
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("uploadError"));
      }

      form.setValue("picture", data.url);
      toast.success(t("uploadSuccess"));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : t("uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    form.setValue("picture", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await updateSettings(data)

      if (result.success) {
        toast.success(t("updateSuccess"))
        router.refresh()
      } else {
        toast.error(result.error || t("updateError"))
      }
    })
  }

  const pictureUrl = form.watch("picture")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={pictureUrl || undefined} alt={form.getValues("name")} />
            <AvatarFallback className="text-2xl">
              {form.getValues("name")?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">
              {t("profilePictureHint")}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? t("uploading") : t("uploadImage")}
              </Button>
              {pictureUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("remove")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t("maxFileSize")}</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormDescription>
                {t("nameDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormDescription>
                {t("emailDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending || isUploading}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("saveChanges")}
        </Button>
      </form>
    </Form>
  )
}