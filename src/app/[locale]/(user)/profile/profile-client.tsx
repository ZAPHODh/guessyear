'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Stats03 from '@/components/stats-03'
import { Calendar, Trophy, Target, Gamepad2, Award } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      title: 'Total Games',
      value: stats.totalGames.toString(),
      change: stats.totalGames > 0 ? '+' + stats.totalGames : '0',
      trend: 'up' as const,
      icon: Gamepad2,
    },
    {
      title: 'Lobby Games',
      value: stats.totalLobbyGames.toString(),
      change: stats.totalLobbyGames > 0 ? '+' + stats.totalLobbyGames : '0',
      trend: 'up' as const,
      icon: Trophy,
    },
    {
      title: 'Daily Challenges',
      value: stats.totalDailyGames.toString(),
      change: stats.totalDailyGames > 0 ? '+' + stats.totalDailyGames : '0',
      trend: 'up' as const,
      icon: Calendar,
    },
    {
      title: 'Completed Daily Games',
      value: stats.completedDailyGames.toString(),
      change: stats.completedDailyGames > 0 ? stats.completedDailyGames + ' won' : '0',
      trend: 'up' as const,
      icon: Award,
    },
  ]

  const navItems = [
    {
      href: '/profile',
      label: 'Overview',
      icon: Target,
    },
    {
      href: '/profile/lobby-history',
      label: 'Lobby History',
      icon: Trophy,
    },
    {
      href: '/profile/daily-history',
      label: 'Daily History',
      icon: Calendar,
    },
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={user.picture || undefined} alt={user.name || 'User'} />
          <AvatarFallback className="text-2xl font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{user.name || 'Anonymous'}</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Member since {memberSince}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <Stats03 stats={statsData} />
      </div>

      <Separator className="my-8" />

      {/* Navigation */}
      <div className="flex gap-2 border-b">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href ||
            (item.href !== '/profile' && pathname?.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="gap-2 rounded-b-none"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
