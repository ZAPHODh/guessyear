import { getLobbyHistory } from '../actions'
import { LobbyHistoryTable } from '@/components/layout/lobby-history-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import { getScopedI18n } from '@/locales/server'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function LobbyHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 10
  const profileT = await getScopedI18n('profile')

  const result = await getLobbyHistory(page, pageSize)

  if ('error' in result) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-2">{profileT('lobbyHistory.errorLoading')}</p>
            <p className="text-sm text-muted-foreground">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { games, pagination } = result

  if (games.length === 0) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">{profileT('lobbyHistory.noGames')}</p>
            <p className="text-sm text-muted-foreground">
              {profileT('lobbyHistory.noGamesHint')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {profileT('lobbyHistory.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LobbyHistoryTable
            data={games as any}
            pageIndex={page - 1}
            pageSize={pageSize}
            totalPages={pagination.totalPages}
          />
        </CardContent>
      </Card>
    </div>
  )
}
