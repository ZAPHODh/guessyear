import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getAllImages } from "./admin/actions"
import { ImagesProvider } from "@/components/images-context"
import { requireAdmin } from "@/lib/server/dto"

export default async function AdminLayout({
  children,
  imageModal,
}: {
  children: React.ReactNode
  imageModal: React.ReactNode
}) {
  await requireAdmin()

  const images = await getAllImages()

  return (
    <ImagesProvider initialImages={images}>
      {children}
      {imageModal}
    </ImagesProvider>
  )
}