"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { User } from "@prisma/client"
import { useTransition, useMemo } from "react"

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
import { Loader2 } from "lucide-react"
import { updateSettings } from "@/app/[locale]/settings/actions"
import { useRouter } from "next/navigation"
import { useScopedI18n } from "@/locales/client"

type SettingsFormProps = {
  user: User
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useScopedI18n("settings")

  const FormSchema = useMemo(() => z.object({
    name: z.string().min(2, {
      message: t("nameError"),
    }),
    email: z.string().email({
      message: t("emailError"),
    }),
    picture: z.string().url({
      message: t("pictureError"),
    }).optional().or(z.literal("")),
  }), [t])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      picture: user.picture || "",
    },
  })

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
          <div className="text-sm text-muted-foreground">
            {t("profilePictureHint")}
          </div>
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

        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("picture")}</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder={t("picturePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("pictureDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("saveChanges")}
        </Button>
      </form>
    </Form>
  )
}