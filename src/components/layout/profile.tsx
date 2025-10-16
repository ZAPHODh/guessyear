'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Stats03 from '@/components/stats-03'
import { Calendar, Trophy, Target, Gamepad2, Award } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useScopedI18n } from '@/locales/client'

interface ProfileClientProps {
  user: {
    id: string
    name: string | null
    email: string | null
    picture: string | null
    createdAt: Date
  }
  stats: {
    totalLobbyGames: number
    totalDailyGames: number
    totalGames: number
    completedDailyGames: number
    bestWinAttempt: number | null
    totalLobbyScore: number
  }
}

export default function ProfileClient({ user, stats }: ProfileClientProps) {
  const pathname = usePathname()
  const profileT = useScopedI18n('profile')

  const userInitials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const statsData = [
    {
      name: profileT('stats.totalGames'),
      stat: stats.totalGames.toString(),
      change: stats.totalGames > 0 ? '+' + stats.totalGames : '0',
      changeType: 'positive' as const,
      icon: Gamepad2,
    },
    {
      name: profileT('stats.lobbyGames'),
      stat: stats.totalLobbyGames.toString(),
      change: stats.totalLobbyGames > 0 ? '+' + stats.totalLobbyGames : '0',
      changeType: 'positive' as const,
      icon: Trophy,
    },
    {
      name: profileT('stats.dailyChallenges'),
      stat: stats.totalDailyGames.toString(),
      change: stats.totalDailyGames > 0 ? '+' + stats.totalDailyGames : '0',
      changeType: 'positive' as const,
      icon: Calendar,
    },
    {
      name: profileT('stats.completedDailyGames'),
      stat: stats.completedDailyGames.toString(),
      change: stats.completedDailyGames > 0 ? stats.completedDailyGames + ' ' + profileT('stats.won') : '0',
      changeType: 'positive' as const,
      icon: Award,
    },
  ]

  const navItems = [
    {
      href: '/profile',
      label: profileT('navigation.overview'),
      icon: Target,
    },
    {
      href: '/profile/lobby-history',
      label: profileT('navigation.lobbyHistory'),
      icon: Trophy,
    },
    {
      href: '/profile/daily-history',
      label: profileT('navigation.dailyHistory'),
      icon: Calendar,
    },
  ]

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border">
          <AvatarImage src={user.picture || undefined} alt={user.name || 'User'} />
          <AvatarFallback className="text-xl sm:text-2xl font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user.name || 'Anonymous'}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-2 break-all">{user.email}</p>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {profileT('memberSince')} {memberSince}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <Stats03 stats={statsData} />
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="mb-4">
        <div className="flex gap-2 border-b overflow-x-auto scrollbar-hide pb-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== '/profile' && pathname?.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href} className="flex-shrink-0">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-b-none whitespace-nowrap",
                    "text-xs sm:text-sm"
                  )}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
