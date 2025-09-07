import { AdminDashboard } from "@/components/layout/admin-dashboard"
import { getScopedI18n } from "@/locales/server"

export default async function AdminPage() {
  const t = await getScopedI18n("admin.dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  )
}