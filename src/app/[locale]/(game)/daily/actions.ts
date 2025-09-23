"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { startOfDay, format, addDays } from "date-fns"
import { toZonedTime, fromZonedTime } from "date-fns-tz"
import { prisma } from "@/lib/server/db"
import { actionClient } from "@/lib/client/safe-action"
import { getCurrentSession } from "@/lib/server/auth/session"
import { getLocalizedTip, type SupportedLocale, type LocalizedTips } from "@/types/tip"
import type { GuessHint, CookieGameState } from "@/types"

const COOKIE_NAME = "daily_game_progress"
const SESSION_COOKIE_NAME = "daily_game_session"
const MAX_ATTEMPTS = 5

function getTodayDate(userTimezone?: string): Date {
  const now = new Date()

  if (userTimezone) {
    // Convert to user's timezone and get start of day there
    const zonedDate = toZonedTime(now, userTimezone)
    const startOfDayInZone = startOfDay(zonedDate)
    // Convert back to UTC for consistent storage
    return fromZonedTime(startOfDayInZone, userTimezone)
  }

  // Fallback to UTC if no timezone provided
  return startOfDay(now)
}

function formatDateForCookie(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

function createFutureDate(): Date {
  return new Date('2099-01-01')
}

async function findDailyImageByDate(date: Date) {
  return prisma.dailyImage.findUnique({
    where: { date }
  })
}

async function countUnscheduledImages(): Promise<number> {
  const futureDate = createFutureDate()
  return prisma.dailyImage.count({
    where: {
      date: { gte: futureDate }
    }
  })
}

async function findRandomUnscheduledImage() {
  const futureDate = createFutureDate()
  const totalCount = await countUnscheduledImages()

  if (totalCount === 0) return null

  return prisma.dailyImage.findFirst({
    where: {
      date: { gte: futureDate }
    },
    orderBy: { id: 'asc' },
    skip: Math.floor(Math.random() * totalCount)
  })
}

async function scheduleImageForToday(imageId: string, today: Date) {
  return prisma.dailyImage.update({
    where: { id: imageId },
    data: { date: today }
  })
}

async function createDefaultDailyImage(today: Date) {
  return prisma.dailyImage.create({
    data: {
      cloudinaryUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      year: 2012,
      description: "Classic mountain landscape",
      date: today
    }
  })
}

async function getOrCreateTodayImage(userTimezone?: string) {
  const today = getTodayDate(userTimezone)

  let dailyImage = await findDailyImageByDate(today)

  if (!dailyImage) {
    const randomImage = await findRandomUnscheduledImage()

    if (randomImage) {
      dailyImage = await scheduleImageForToday(randomImage.id, today)
    } else {
      dailyImage = await createDefaultDailyImage(today)
    }
  }

  return dailyImage
}

async function getCookieGameState(): Promise<CookieGameState | null> {
  try {
    const cookieStore = await cookies()
    const cookieValue = cookieStore.get(COOKIE_NAME)?.value
    if (!cookieValue) return null

    return JSON.parse(cookieValue) as CookieGameState
  } catch {
    return null
  }
}

async function setCookieGameState(state: CookieGameState) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, JSON.stringify(state), {
    expires: addDays(new Date(), 1),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
}

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      expires: addDays(new Date(), 30),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })
  }

  return sessionId
}

async function countCompletedGames(date: Date): Promise<number> {
  return prisma.dailyGameProgress.count({
    where: {
      date,
      completed: true
    }
  })
}

async function getWinningGames(date: Date) {
  return prisma.dailyGameProgress.findMany({
    where: {
      date,
      completed: true,
      won: true,
      winAttempt: {
        not: null
      }
    },
    select: {
      winAttempt: true,
      userId: true,
      sessionId: true
    }
  })
}

function createChartData(winningGames: any[], totalGames: number, userAttempts?: number, userWon?: boolean) {
  const totalWinningGames = winningGames.length

  return Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
    const attempt = i + 1
    const winsAtThisAttempt = winningGames.filter(game => game.winAttempt === attempt)
    const winCount = winsAtThisAttempt.length

    return {
      attempt,
      winPercentage: totalWinningGames > 0 ? Math.round((winCount / totalWinningGames) * 100) : 0,
      gameCount: winCount,
      isUserAttempt: Boolean(userWon && userAttempts === attempt)
    }
  })
}

async function getTodayGames(today: Date, userAttempts?: number, userWon?: boolean) {
  const totalGames = await countCompletedGames(today)
  const allWinningGames = await getWinningGames(today)
  const chartData = createChartData(allWinningGames, totalGames, userAttempts, userWon)

  return { chartData, totalGames }
}

function createInitialCookieState(todayStr: string, imageId: string): CookieGameState {
  return {
    date: todayStr,
    attempts: 0,
    completed: false,
    won: false,
    imageId,
    guesses: []
  }
}

function shouldResetCookieState(cookieState: CookieGameState | null, todayStr: string, imageId: string): boolean {
  return !cookieState ||
    cookieState.date !== todayStr ||
    cookieState.imageId !== imageId
}

function getLocalizedTipIfEligible(attempts: number, tip: LocalizedTips | null | undefined, locale: SupportedLocale) {
  return attempts >= 3 && tip ? getLocalizedTip(tip, locale) : undefined
}

export async function getTodayImage(locale: SupportedLocale = 'en', userTimezone?: string) {
  const dailyImage = await getOrCreateTodayImage(userTimezone)
  const today = getTodayDate(userTimezone)
  const todayStr = formatDateForCookie(today)

  let cookieState = await getCookieGameState()

  if (shouldResetCookieState(cookieState, todayStr, dailyImage.id) || !cookieState) {
    cookieState = createInitialCookieState(todayStr, dailyImage.id)
  }

  let dailyStats = undefined
  if (cookieState.completed) {
    dailyStats = await getTodayGames(today, cookieState.attempts, cookieState.won)
  }

  const localizedTip = getLocalizedTipIfEligible(
    cookieState.attempts,
    dailyImage.tip as LocalizedTips,
    locale
  )

  return {
    imageUrl: dailyImage.cloudinaryUrl,
    attempts: cookieState.attempts,
    completed: cookieState.completed,
    won: cookieState.won,
    correctYear: dailyImage.year,
    dailyStats,
    guesses: cookieState.guesses || [],
    tip: localizedTip
  }
}

const submitGuessSchema = z.object({
  year: z.number().int().min(1800).max(new Date().getFullYear())
})

const submitGuessWithLocaleSchema = submitGuessSchema.extend({
  locale: z.string().optional().default('en'),
  userTimezone: z.string().optional()
})

function validateGameState(cookieState: CookieGameState) {
  if (cookieState.completed) {
    throw new Error("Game already completed for today")
  }

  if (cookieState.attempts >= MAX_ATTEMPTS) {
    throw new Error("Maximum attempts reached")
  }
}

function createGuessHint(year: number, correctYear: number): GuessHint {
  const isCorrect = year === correctYear
  const difference = Math.abs(year - correctYear)
  const direction = isCorrect ? "correct" as const :
    year < correctYear ? "higher" as const : "lower" as const

  return { year, difference, direction }
}

function updateGameState(cookieState: CookieGameState, guess: GuessHint): boolean {
  cookieState.attempts += 1
  cookieState.guesses = cookieState.guesses || []
  cookieState.guesses.push(guess)

  const gameCompleted = guess.direction === "correct" || cookieState.attempts >= MAX_ATTEMPTS

  if (gameCompleted) {
    cookieState.completed = true
    cookieState.won = guess.direction === "correct"
  }

  return gameCompleted
}

async function getCurrentUser() {
  try {
    const session = await getCurrentSession()
    return session.user
  } catch {
    return null
  }
}

function createGameProgressData(cookieState: CookieGameState, imageId: string, date: Date) {
  return {
    imageId,
    attempts: cookieState.attempts,
    completed: true,
    won: cookieState.won,
    winAttempt: cookieState.won ? cookieState.attempts : null,
    date
  }
}


export const submitGuess = actionClient
  .metadata({ actionName: "submitGuess" })
  .schema(submitGuessWithLocaleSchema)
  .action(async ({ parsedInput: { year, locale, userTimezone } }) => {
    const dailyImage = await getOrCreateTodayImage(userTimezone)
    const today = getTodayDate(userTimezone)
    const todayStr = formatDateForCookie(today)

    let cookieState = await getCookieGameState()

    if (shouldResetCookieState(cookieState, todayStr, dailyImage.id) || !cookieState) {
      cookieState = createInitialCookieState(todayStr, dailyImage.id)
    }

    validateGameState(cookieState)

    const guess = createGuessHint(year, dailyImage.year)
    const gameCompleted = updateGameState(cookieState, guess)

    await setCookieGameState(cookieState)

    let dailyStats = undefined
    if (gameCompleted) {
      dailyStats = await getTodayGames(today, cookieState.attempts, cookieState.won)
    }

    const localizedTip = getLocalizedTipIfEligible(
      cookieState.attempts,
      dailyImage.tip as LocalizedTips,
      locale as SupportedLocale
    )

    return {
      imageUrl: dailyImage.cloudinaryUrl,
      attempts: cookieState.attempts,
      completed: cookieState.completed,
      won: cookieState.won,
      correctYear: dailyImage.year,
      dailyStats,
      guesses: cookieState.guesses || [],
      gameCompleted,
      tip: localizedTip
    }
  })