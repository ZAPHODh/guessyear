import { getDailyHistory } from '../actions'
import { DailyHistoryTable } from '@/components/layout/daily-history-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { getScopedI18n } from '@/locales/server'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function DailyHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 10
  const profileT = await getScopedI18n('profile')

  const result = await getDailyHistory(page, pageSize)

  if ('error' in result) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-2">{profileT('dailyHistory.errorLoading')}</p>
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
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">{profileT('dailyHistory.noChallenges')}</p>
            <p className="text-sm text-muted-foreground">
              {profileT('dailyHistory.noChallengesHint')}
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
            <Calendar className="h-5 w-5" />
            {profileT('dailyHistory.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DailyHistoryTable
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
