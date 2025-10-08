'use server'

import { getCurrentSession } from '@/lib/server/auth/session'
import { prisma } from '@/lib/server/db'

export async function getUserProfile() {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        createdAt: true,
      }
    })

    if (!dbUser) {
      return { error: 'User not found' }
    }

    return { user: dbUser }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { error: 'Failed to fetch profile' }
  }
}

export async function getUserStats() {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    // Get lobby games stats
    const lobbyGamesCount = await prisma.lobbyPlayer.count({
      where: { userId: user.id }
    })

    // Get daily games stats
    const dailyGamesCount = await prisma.dailyGameProgress.count({
      where: { userId: user.id }
    })

    // Get completed daily games count (best performance metric)
    const completedDailyGames = await prisma.dailyGameProgress.count({
      where: {
        userId: user.id,
        completed: true,
        won: true
      }
    })

    // Get best win attempt (lowest attempts to win)
    const bestWinAttempt = await prisma.dailyGameProgress.findFirst({
      where: {
        userId: user.id,
        won: true,
        winAttempt: { not: null }
      },
      orderBy: { winAttempt: 'asc' },
      select: { winAttempt: true }
    })

    // Get total lobby score (sum of all scores)
    const lobbyScores = await prisma.lobbyPlayer.aggregate({
      where: { userId: user.id },
      _sum: { score: true }
    })

    return {
      stats: {
        totalLobbyGames: lobbyGamesCount,
        totalDailyGames: dailyGamesCount,
        totalGames: lobbyGamesCount + dailyGamesCount,
        completedDailyGames: completedDailyGames,
        bestWinAttempt: bestWinAttempt?.winAttempt || null,
        totalLobbyScore: lobbyScores._sum.score || 0,
      }
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return { error: 'Failed to fetch stats' }
  }
}

export async function getLobbyHistory(page = 1, pageSize = 10) {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const skip = (page - 1) * pageSize

    const lobbyGames = await prisma.lobbyPlayer.findMany({
      where: { userId: user.id },
      include: {
        lobby: {
          select: {
            id: true,
            name: true,
            status: true,
            maxPlayers: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    const total = await prisma.lobbyPlayer.count({
      where: { userId: user.id }
    })

    return {
      games: lobbyGames,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  } catch (error) {
    console.error('Error fetching lobby history:', error)
    return { error: 'Failed to fetch lobby history' }
  }
}

export async function getDailyHistory(page = 1, pageSize = 10) {
  try {
    const { user } = await getCurrentSession()

    if (!user) {
      return { error: 'Not authenticated' }
    }

    const skip = (page - 1) * pageSize

    const dailyGames = await prisma.dailyGameProgress.findMany({
      where: { userId: user.id },
      include: {
        image: {
          select: {
            id: true,
            date: true,
            year: true,
            description: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    })

    const total = await prisma.dailyGameProgress.count({
      where: { userId: user.id }
    })

    return {
      games: dailyGames,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  } catch (error) {
    console.error('Error fetching daily history:', error)
    return { error: 'Failed to fetch daily history' }
  }
}
