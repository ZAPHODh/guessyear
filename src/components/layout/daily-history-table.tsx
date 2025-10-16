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

type DailyGame = {
  id: string
  attempts: number
  completed: boolean
  won: boolean
  winAttempt: number | null
  createdAt: Date
  image: {
    id: string
    date: Date
    year: number
    description: string | null
  }
}

interface DailyHistoryTableProps {
  data: DailyGame[]
  pageIndex: number
  pageSize: number
  totalPages: number
}

export function DailyHistoryTable({
  data,
  pageIndex,
  pageSize,
  totalPages,
}: DailyHistoryTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])

  const getPerformanceBadge = (game: DailyGame) => {
    if (game.won && game.winAttempt) {
      if (game.winAttempt === 1) {
        return <Badge className="bg-green-500">Perfect!</Badge>
      } else if (game.winAttempt <= 2) {
        return <Badge className="bg-blue-500">Great</Badge>
      } else if (game.winAttempt <= 3) {
        return <Badge className="bg-yellow-500">Good</Badge>
      } else {
        return <Badge variant="secondary">Complete</Badge>
      }
    } else if (game.completed) {
      return <Badge variant="destructive">Failed</Badge>
    } else {
      return <Badge variant="outline">In Progress</Badge>
    }
  }

  const columns = useMemo<ColumnDef<DailyGame>[]>(
    () => [
      {
        accessorKey: "image.date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="font-medium">
              {new Date(row.original.image.date).toLocaleDateString()}
            </div>
          )
        },
      },
      {
        accessorKey: "image.description",
        header: "Description",
        cell: ({ row }) => {
          return (
            <div className="max-w-[200px] truncate">
              {row.original.image.description || "No description"}
            </div>
          )
        },
      },
      {
        accessorKey: "image.year",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Year
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return <Badge variant="outline">{row.original.image.year}</Badge>
        },
      },
      {
        accessorKey: "attempts",
        header: "Attempts",
        cell: ({ row }) => {
          const game = row.original
          return (
            <div>
              <span className="font-semibold">{game.attempts}</span> / 5
              {game.won && game.winAttempt && (
                <span className="text-xs text-muted-foreground ml-1">
                  (Won on {game.winAttempt})
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "won",
        header: "Result",
        cell: ({ row }) => getPerformanceBadge(row.original),
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
      <div className="rounded-md border">
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
            Previous
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
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
