import { getAllImages } from "./admin/actions"
import { ImagesProvider } from "@/components/images-context"
import { requireAdmin } from "@/lib/server/dto"
import { getCurrentSession } from "@/lib/server/auth/session"
import AppSidebar from "@/components/app-sidebar"
import AppSidebarNav from "@/components/app-sidebar-nav"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
  imageModal,
}: {
  children: React.ReactNode
  imageModal: React.ReactNode
}) {
  await requireAdmin()

  const images = await getAllImages()
  const { user } = await getCurrentSession()

  return (
    <ImagesProvider
      initialImages={images}
      refreshImages={getAllImages}
    >
      <SidebarProvider>
        <AppSidebar collapsible="dock" user={user} />
        <SidebarInset>
          <AppSidebarNav user={user} />
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </SidebarInset>
        {imageModal}
      </SidebarProvider>
    </ImagesProvider>
  )
}