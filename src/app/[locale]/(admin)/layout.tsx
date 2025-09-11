import { getAllImages } from "./admin/actions"
import { ImagesProvider } from "@/components/images-context"
import { requireAdmin } from "@/lib/server/dto"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"
import { getCurrentSession } from "@/lib/server/auth/session"

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
    <ImagesProvider 
      initialImages={images}
      refreshImages={getAllImages}
    >
      <SidebarProvider>
        <div className="flex flex-1">
          <AdminSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
        {imageModal}
      </SidebarProvider>
    </ImagesProvider>
  )
}