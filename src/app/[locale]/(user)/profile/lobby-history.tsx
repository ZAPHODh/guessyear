'use client'

import { useEffect, useState } from 'react'
import { getLobbyHistory } from './actions'
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

export default function LobbyHistory() {
  const [games, setGames] = useState<LobbyGame[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadGames()
  }, [page])

  const loadGames = async () => {
    setLoading(true)
    const result = await getLobbyHistory(page, 10)

    if ('error' in result) {
      console.error(result.error)
      setLoading(false)
      return
    }

    setGames(result.games as LobbyGame[])
    setTotalPages(result.pagination.totalPages)
    setLoading(false)
  }

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
          <p className="text-muted-foreground mb-2">No lobby games yet</p>
          <p className="text-sm text-muted-foreground">
            Join a multiplayer lobby to start playing!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lobby Game History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your recent lobby games</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Lobby Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">{game.lobby.name}</TableCell>
                <TableCell>{getStatusBadge(game.lobby.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{game.score} pts</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {game.lobby.maxPlayers} players
                </TableCell>
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
