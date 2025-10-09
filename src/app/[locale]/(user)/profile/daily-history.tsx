'use client'

import { useEffect, useState } from 'react'
import { getDailyHistory } from './actions'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

export default function DailyHistory() {
  const [games, setGames] = useState<DailyGame[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadGames()
  }, [page])

  const loadGames = async () => {
    setLoading(true)
    const result = await getDailyHistory(page, 10)

    if ('error' in result) {
      console.error(result.error)
      setLoading(false)
      return
    }

    setGames(result.games)
    setTotalPages(result.pagination.totalPages)
    setLoading(false)
  }

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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-2">No daily challenges completed yet</p>
          <p className="text-sm text-muted-foreground">
            Play the daily challenge to start building your history!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Challenge History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your recent daily challenges</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">
                  {new Date(game.image.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {game.image.description || 'No description'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{game.image.year}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{game.attempts}</span> / 5
                  {game.won && game.winAttempt && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (Won on {game.winAttempt})
                    </span>
                  )}
                </TableCell>
                <TableCell>{getPerformanceBadge(game)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
