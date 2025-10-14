import { LobbyManagement } from "@/components/layout/lobby-management"
import { getScopedI18n } from "@/locales/server"
import { getAllLobbies } from "./actions"

export default async function AdminLobbiesPage() {
  const t = await getScopedI18n("admin.lobbies")
  const lobbies = await getAllLobbies()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <LobbyManagement initialLobbies={lobbies} />
      </div>
    </div>
  )
}
