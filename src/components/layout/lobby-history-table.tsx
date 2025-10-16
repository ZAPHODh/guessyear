"use client"

import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

type LobbyGame = {
  id: string
  username: string
  score: number
  isReady: boolean
  createdAt: Date
  lobby: {
    id: string
    name: string
    status: string
    maxPlayers: number
    createdAt: Date
    updatedAt: Date
  }
}

interface LobbyHistoryTableProps {
  data: LobbyGame[]
  pageIndex: number
  pageSize: number
  totalPages: number
}

export function LobbyHistoryTable({
  data,
  pageIndex,
  pageSize,
  totalPages,
}: LobbyHistoryTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <Badge variant="secondary">Waiting</Badge>
      case 'PLAYING':
        return <Badge variant="default">Playing</Badge>
      case 'FINISHED':
        return <Badge variant="outline">Finished</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const columns = useMemo<ColumnDef<LobbyGame>[]>(
    () => [
      {
        accessorKey: "lobby.name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Lobby Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="font-medium">
              {row.original.lobby.name}
            </div>
          )
        },
      },
      {
        accessorKey: "lobby.status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.lobby.status),
      },
      {
        accessorKey: "score",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Score
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return <Badge variant="outline">{row.original.score} pts</Badge>
        },
      },
      {
        accessorKey: "lobby.maxPlayers",
        header: "Players",
        cell: ({ row }) => {
          return (
            <div className="text-muted-foreground">
              {row.original.lobby.maxPlayers} players
            </div>
          )
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
              Played
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="text-muted-foreground">
              {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount: totalPages,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 2)}
            disabled={pageIndex + 1 >= totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
