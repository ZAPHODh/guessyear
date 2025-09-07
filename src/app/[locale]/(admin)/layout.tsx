import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getAllImages } from "./admin/actions"
import { ImagesProvider } from "@/components/images-context"

export default async function AdminLayout({
  children,
  imageModal,
}: {
  children: React.ReactNode
  imageModal: React.ReactNode
}) {
  const session = await getCurrentSession()

  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const images = await getAllImages()

  return (
    <ImagesProvider initialImages={images}>
      {children}
      {imageModal}
    </ImagesProvider>
  )
}