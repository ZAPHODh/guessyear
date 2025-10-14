"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useScopedI18n } from "@/locales/client"

interface LobbyCleanupTabProps {
  finishedLobbiesCount: number
  onDeleteFinished: () => void
  onDeleteOld: (days: number) => void
  isPending: boolean
}

export function LobbyCleanupTab({
  finishedLobbiesCount,
  onDeleteFinished,
  onDeleteOld,
  isPending
}: LobbyCleanupTabProps) {
  const t = useScopedI18n("admin.lobbies")
  const [deleteOldDays, setDeleteOldDays] = useState(7)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDeleteOld(deleteOldDays)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("cleanup.deleteFinished")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("cleanup.deleteFinishedDesc")}
          </p>
          <Button
            variant="destructive"
            onClick={onDeleteFinished}
            disabled={isPending || finishedLobbiesCount === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("cleanup.deleteFinishedButton")} ({finishedLobbiesCount})
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">{t("cleanup.deleteOld")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t("cleanup.deleteOldDesc")}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="days">{t("cleanup.days")}</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                value={deleteOldDays}
                onChange={(e) => setDeleteOldDays(parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("cleanup.deleteOldButton")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
