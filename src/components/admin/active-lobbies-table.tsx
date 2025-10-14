"use client"

import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Users, ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { StatusBadge, GameModeBadge } from "@/lib/admin/lobby-utils"
import { useScopedI18n } from "@/locales/client"
import { DataTable } from "./data-table"
import type { Lobby } from "@/lib/admin/lobby-types"
import type { Locale } from "date-fns"

interface ActiveLobbiesTableProps {
  data: Lobby[]
  onViewDetails: (lobbyId: string) => void
  onDelete: (lobbyId: string) => void
  isPending: boolean
  dateLocale: Locale
}

export function ActiveLobbiesTable({
  data,
  onViewDetails,
  onDelete,
  isPending,
  dateLocale
}: ActiveLobbiesTableProps) {
  const t = useScopedI18n("admin.lobbies")

  const columns = useMemo<ColumnDef<Lobby>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const lobby = row.original
        return (
          <div>
            <div className="font-medium">{lobby.name}</div>
            {lobby.inviteCode && (
              <div className="text-xs text-muted-foreground">
                Code: {lobby.inviteCode}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "host",
      header: t("table.host"),
      cell: ({ row }) => {
        const host = row.original.host
        return (
          <div>
            <div className="text-sm">{host.name || "Anonymous"}</div>
            <div className="text-xs text-muted-foreground">{host.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "gameMode",
      header: t("table.mode"),
      cell: ({ row }) => <GameModeBadge mode={row.original.gameMode} />,
    },
    {
      accessorKey: "players",
      header: t("table.players"),
      cell: ({ row }) => {
        const lobby = row.original
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {lobby._count.players}/{lobby.maxPlayers}
          </div>
        )
      },
    },
    {
      accessorKey: "rounds",
      header: t("table.rounds"),
      cell: ({ row }) => {
        const lobby = row.original
        return `${lobby.currentRound}/${lobby.rounds}`
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.created")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(row.original.createdAt), {
              addSuffix: true,
              locale: dateLocale
            })}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("table.actions")}</div>,
      cell: ({ row }) => {
        const lobby = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(lobby.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(lobby.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ], [t, dateLocale, isPending, onViewDetails, onDelete])

  return <DataTable columns={columns} data={data} />
}
