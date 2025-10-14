"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  deleteLobby,
  deleteFinishedLobbies,
  deleteOldLobbies,
  getLobbyById
} from "@/app/[locale]/(admin)/admin/lobbies/actions"
import { useScopedI18n } from "@/locales/client"
import { ptBR, enUS } from "date-fns/locale"
import { useCurrentLocale } from "@/locales/client"
import { filterActiveLobbies, filterFinishedLobbies } from "@/lib/admin/lobby-utils"
import { ActiveLobbiesTable } from "@/components/admin/active-lobbies-table"
import { FinishedLobbiesTable } from "@/components/admin/finished-lobbies-table"
import { LobbyDetailDialog } from "@/components/admin/lobby-detail-dialog"
import { LobbyCleanupTab } from "@/components/admin/lobby-cleanup-tab"
import type { Lobby, DetailedLobby } from "@/lib/admin/lobby-types"

interface LobbyManagementProps {
  initialLobbies: Lobby[]
}

export function LobbyManagement({ initialLobbies }: LobbyManagementProps) {
  const [selectedLobby, setSelectedLobby] = useState<DetailedLobby | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const t = useScopedI18n("admin.lobbies")
  const tActions = useScopedI18n("admin.actions")
  const locale = useCurrentLocale()

  const dateLocale = locale === "pt" ? ptBR : enUS

  const activeLobbies = filterActiveLobbies(initialLobbies)
  const finishedLobbies = filterFinishedLobbies(initialLobbies)

  const handleViewDetails = async (lobbyId: string) => {
    try {
      const data = await getLobbyById(lobbyId)
      if (data) {
        setSelectedLobby(data as DetailedLobby)
        setIsDetailDialogOpen(true)
      }
    } catch (error) {
      console.error("Failed to load lobby details:", error)
    }
  }

  const handleDelete = async (lobbyId: string) => {
    if (!confirm(tActions("confirmDelete"))) return

    startTransition(async () => {
      try {
        await deleteLobby({ lobbyId })
      } catch (error) {
        console.error("Failed to delete lobby:", error)
      }
    })
  }

  const handleDeleteFinished = () => {
    if (!confirm(t("confirmDeleteFinished"))) return

    startTransition(async () => {
      try {
        const result = await deleteFinishedLobbies({})
        alert(t("deleteSuccess", { count: result.data?.deleted || 0 }))
      } catch (error) {
        console.error("Failed to delete finished lobbies:", error)
      }
    })
  }

  const handleDeleteOld = (days: number) => {
    if (!confirm(t("confirmDeleteOld", { days }))) return

    startTransition(async () => {
      try {
        const result = await deleteOldLobbies({ days })
        alert(t("deleteSuccess", { count: result.data?.deleted || 0 }))
      } catch (error) {
        console.error("Failed to delete old lobbies:", error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            {t("tabs.active")} ({activeLobbies.length})
          </TabsTrigger>
          <TabsTrigger value="finished">
            {t("tabs.finished")} ({finishedLobbies.length})
          </TabsTrigger>
          <TabsTrigger value="cleanup">{t("tabs.cleanup")}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("active.title")}</CardTitle>
              <CardDescription>{t("active.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveLobbiesTable
                data={activeLobbies}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                isPending={isPending}
                dateLocale={dateLocale}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("finished.title")}</CardTitle>
              <CardDescription>{t("finished.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FinishedLobbiesTable
                data={finishedLobbies}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                isPending={isPending}
                dateLocale={dateLocale}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("cleanup.title")}</CardTitle>
              <CardDescription>{t("cleanup.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LobbyCleanupTab
                finishedLobbiesCount={finishedLobbies.length}
                onDeleteFinished={handleDeleteFinished}
                onDeleteOld={handleDeleteOld}
                isPending={isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LobbyDetailDialog
        lobby={selectedLobby}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  )
}
