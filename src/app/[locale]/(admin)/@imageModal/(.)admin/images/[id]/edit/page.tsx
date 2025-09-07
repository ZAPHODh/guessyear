import { notFound } from "next/navigation"
import { getImageById } from "../../../../../admin/actions"
import ImageEditModal from "@/components/layout/image-edit-modal"

interface EditImageModalProps {
  params: Promise<{ id: string }>
}

export default async function EditImageModal({ params }: EditImageModalProps) {
  const { id } = await params
  const image = await getImageById(id)

  if (!image) {
    notFound()
  }

  return <ImageEditModal image={image} />
}