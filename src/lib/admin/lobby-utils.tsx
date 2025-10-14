"use client"

import { Badge } from "@/components/ui/badge"
import { useScopedI18n } from "@/locales/client"
import type { Lobby } from "./lobby-types"

export function StatusBadge({ status }: { status: string }) {
  const t = useScopedI18n("admin.lobbies")

  switch (status) {
    case "WAITING":
      return <Badge variant="secondary">{t("status.waiting")}</Badge>
    case "PLAYING":
      return <Badge variant="default">{t("status.playing")}</Badge>
    case "FINISHED":
      return <Badge variant="outline">{t("status.finished")}</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function GameModeBadge({ mode }: { mode: string }) {
  const t = useScopedI18n("admin.lobbies")

  switch (mode) {
    case "CLASSIC":
      return <Badge variant="secondary">{t("gameMode.classic")}</Badge>
    case "ELIMINATION":
      return <Badge variant="destructive">{t("gameMode.elimination")}</Badge>
    case "MARATHON":
      return <Badge variant="default">{t("gameMode.marathon")}</Badge>
    default:
      return <Badge>{mode}</Badge>
  }
}

export function filterActiveLobbies(lobbies: Lobby[]) {
  return lobbies.filter(l => l.status !== "FINISHED")
}

export function filterFinishedLobbies(lobbies: Lobby[]) {
  return lobbies.filter(l => l.status === "FINISHED")
}

export function getWinner(lobby: Lobby) {
  return lobby.players.sort((a, b) => b.score - a.score)[0]
}
