"use client"

import { useState, useEffect, useMemo } from "react"
import { useCurrentLocale } from "@/locales/client"
import { useUserTimezone } from "./use-user-timezone"
import { useSmartRange } from "./use-smart-range"
import { submitGuess, getTodayImage } from "@/app/[locale]/(game)/daily/actions"
import { socket } from "@/lib/socket"
import type { GameState } from "@/components/layout/daily-game"

const MAX_ATTEMPTS = 5

export function useDailyGame(initialGameState: GameState) {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [isTimezoneReady, setIsTimezoneReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  const locale = useCurrentLocale()
  const userTimezone = useUserTimezone()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect()
      }
    }

    const handleConnect = () => {
      setSocketConnected(true)
    }

    const handleDisconnect = () => {
      setSocketConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    connectSocket()

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [])

  const { minYear, maxYear, confidence } = useSmartRange({
    correctYear: isHydrated ? gameState.correctYear : undefined,
    guesses: isHydrated ? (gameState.guesses || []) : [],
    attempts: isHydrated ? (gameState.attempts || 0) : 0
  })

  const remainingAttempts = useMemo(() => {
    return MAX_ATTEMPTS - gameState.attempts
  }, [gameState.attempts])


  useEffect(() => {
    if (userTimezone && !isTimezoneReady) {
      const revalidateGameState = async () => {
        try {
          const updatedGameState = await getTodayImage(locale, userTimezone || undefined)
          setGameState(updatedGameState)
          setIsTimezoneReady(true)
        } catch (error) {
          console.error("Failed to revalidate game state with timezone:", error)
          setIsTimezoneReady(true)
        }
      }
      revalidateGameState()
    }
  }, [userTimezone, locale, isTimezoneReady])

  const handleSubmitGuess = async (year: number) => {
    if (gameState.completed || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await submitGuess({ year, locale, userTimezone: userTimezone || undefined })
      if (result?.data) {
        setGameState(result.data)

        if (result.data.gameCompleted && socketConnected) {
          socket.emit('daily-game-completed', {
            attempts: result.data.attempts,
            completed: result.data.completed,
            won: result.data.won,
            winAttempt: result.data.won ? result.data.attempts : null,
            locale,
            userTimezone: userTimezone || undefined
          })
        }
      }
    } catch (error) {
      console.error("Failed to submit guess:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    gameState,
    isSubmitting,
    isTimezoneReady,
    socketConnected,
    handleSubmitGuess,
    minYear,
    maxYear,
    confidence,
    remainingAttempts
  }
}