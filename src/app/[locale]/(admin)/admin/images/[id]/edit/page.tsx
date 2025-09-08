import { notFound } from "next/navigation"
import { ImageEditForm } from "@/components/image-edit-form"
import { getImageById } from "../../../actions"
import { getScopedI18n } from "@/locales/server"

interface EditImagePageProps {
  params: Promise<{ id: string }>
}

export default async function EditImagePage({ params }: EditImagePageProps) {
  const { id } = await params
  const image = await getImageById(id)
  const t = await getScopedI18n("admin.forms.edit")

  if (!image) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <ImageEditForm image={image} />
      </div>
    </div>
  )
}