import { ImageUploadForm } from "@/components/image-upload-form"
import { getScopedI18n } from "@/locales/server"

export default async function NewImagePage() {
  const t = await getScopedI18n("admin.forms.upload")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ImageUploadForm />
      </div>
    </div>
  )
}