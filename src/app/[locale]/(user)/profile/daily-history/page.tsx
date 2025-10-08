'use client'

import { useEffect, useState } from 'react'
import { getDailyHistory } from '../actions'
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
import { Loader2, ChevronLeft, ChevronRight, Calendar, Trophy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type DailyGame = {
  id: string
  attempts: number
  completed: boolean
  won: boolean
  winAttempt: number | null
  date: Date
  createdAt: Date
  image: {
    id: string
    date: Date
    year: number
    description: string | null
  }
}

export default function DailyHistoryPage() {
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

    setGames(result.games as DailyGame[])
    setTotalPages(result.pagination.totalPages)
    setLoading(false)
  }

  const getResultBadge = (won: boolean, completed: boolean) => {
    if (won) {
      return <Badge className="bg-green-500"><Trophy className="h-3 w-3 mr-1" />Won</Badge>
    } else if (completed) {
      return <Badge variant="secondary">Completed</Badge>
    } else {
      return <Badge variant="outline">In Progress</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No daily challenges played yet</p>
            <p className="text-sm text-muted-foreground">
              Play the daily challenge to start building your history!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Challenge History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Your recent daily challenges</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Win Attempt</TableHead>
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
                    <span className="font-semibold">{game.attempts}</span>
                  </TableCell>
                  <TableCell>
                    {game.winAttempt ? (
                      <span className="font-semibold text-green-600">{game.winAttempt}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getResultBadge(game.won, game.completed)}</TableCell>
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
    </div>
  )
}
