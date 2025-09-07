"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { prisma } from "@/lib/server/db"
import { actionClient } from "@/lib/client/safe-action"
import { getCurrentSession } from "@/lib/server/auth/session"

const COOKIE_NAME = "daily_game_progress"
const MAX_ATTEMPTS = 5

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

interface CookieGameState {
  date: string
  attempts: number
  completed: boolean
  won: boolean
  imageId: string
  guesses: GuessHint[]
}

async function getTodayDate(): Promise<Date> {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

async function getOrCreateTodayImage() {
  const today = await getTodayDate()

  let dailyImage = await prisma.dailyImage.findUnique({
    where: { date: today }
  })

  if (!dailyImage) {
    dailyImage = await prisma.dailyImage.create({
      data: {
        cloudinaryUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
        year: 1895,
        description: "Classic mountain landscape",
        date: today
      }
    })
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
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
}

export async function getTodayImage() {
  const dailyImage = await getOrCreateTodayImage()
  const today = await getTodayDate()
  const todayStr = today.toISOString().split('T')[0]

  let cookieState = await getCookieGameState()

  if (!cookieState || cookieState.date !== todayStr || cookieState.imageId !== dailyImage.id) {
    cookieState = {
      date: todayStr,
      attempts: 0,
      completed: false,
      won: false,
      imageId: dailyImage.id,
      guesses: []
    }
  }

  let dailyStats = undefined
  if (cookieState.completed) {
    const todayWins = await prisma.dailyGameProgress.count({
      where: {
        date: today,
        won: true
      }
    })
    dailyStats = { todayWins }
  }

  return {
    imageUrl: dailyImage.cloudinaryUrl,
    attempts: cookieState.attempts,
    completed: cookieState.completed,
    won: cookieState.won,
    correctYear: dailyImage.year,
    dailyStats,
    guesses: cookieState.guesses || []
  }
}

const submitGuessSchema = z.object({
  year: z.number().int().min(1800).max(new Date().getFullYear())
})

export const submitGuess = actionClient
  .metadata({ actionName: "submitGuess" })
  .schema(submitGuessSchema)
  .action(async ({ parsedInput: { year } }) => {
    const dailyImage = await getOrCreateTodayImage()
    const today = await getTodayDate()
    const todayStr = today.toISOString().split('T')[0]

    let cookieState = await getCookieGameState()

    if (!cookieState || cookieState.date !== todayStr || cookieState.imageId !== dailyImage.id) {
      cookieState = {
        date: todayStr,
        attempts: 0,
        completed: false,
        won: false,
        imageId: dailyImage.id,
        guesses: []
      }
    }

    if (cookieState.completed) {
      throw new Error("Game already completed for today")
    }

    if (cookieState.attempts >= MAX_ATTEMPTS) {
      throw new Error("Maximum attempts reached")
    }

    cookieState.attempts += 1
    const isCorrect = year === dailyImage.year
    const difference = Math.abs(year - dailyImage.year)
    const direction = isCorrect ? "correct" as const :
      year < dailyImage.year ? "higher" as const : "lower" as const

    const guess: GuessHint = {
      year,
      difference,
      direction
    }

    cookieState.guesses = cookieState.guesses || []
    cookieState.guesses.push(guess)

    const gameCompleted = isCorrect || cookieState.attempts >= MAX_ATTEMPTS

    if (gameCompleted) {
      cookieState.completed = true
      cookieState.won = isCorrect
    }

    await setCookieGameState(cookieState)

    let user = null
    try {
      const session = await getCurrentSession()
      user = session.user
    } catch {
      // User not logged in, that's fine
    }

    if (gameCompleted && user) {
      await prisma.dailyGameProgress.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        },
        create: {
          userId: user.id,
          imageId: dailyImage.id,
          attempts: cookieState.attempts,
          completed: true,
          won: isCorrect,
          date: today
        },
        update: {
          attempts: cookieState.attempts,
          completed: true,
          won: isCorrect
        }
      })
    }

    let dailyStats = undefined
    if (gameCompleted) {
      const todayWins = await prisma.dailyGameProgress.count({
        where: {
          date: today,
          won: true
        }
      })
      dailyStats = { todayWins }
    }

    return {
      imageUrl: dailyImage.cloudinaryUrl,
      attempts: cookieState.attempts,
      completed: cookieState.completed,
      won: cookieState.won,
      correctYear: dailyImage.year,
      dailyStats,
      guesses: cookieState.guesses || [],
      shouldTrack: true
    }
  })