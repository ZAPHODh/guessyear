"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { submitGuess, getTodayImage } from "./actions"
import { useI18n } from "@/locales/client"
import Image from "next/image"

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

interface GameState {
  imageUrl: string
  attempts: number
  completed: boolean
  won: boolean
  correctYear?: number
  dailyStats?: {
    todayWins: number
  }
  guesses: GuessHint[]
}

export function DailyGame() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [guess, setGuess] = useState("")
  const [rangeGuess, setRangeGuess] = useState(Math.floor((1800 + new Date().getFullYear()) / 2))
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const t = useI18n()


  // Calculate smart range based on previous guesses
  const getSmartRange = () => {
    const currentYear = new Date().getFullYear()
    let minYear = 1800
    let maxYear = currentYear

    if (gameState?.guesses && gameState.guesses.length > 0) {
      gameState.guesses.forEach(guess => {
        if (guess.direction === "higher") {
          // Answer is higher than this guess, so min should be at least guess + 1
          minYear = Math.max(minYear, guess.year + 1)
        } else if (guess.direction === "lower") {
          // Answer is lower than this guess, so max should be at most guess - 1
          maxYear = Math.min(maxYear, guess.year - 1)
        }
      })
    }

    return { minYear, maxYear }
  }

  useEffect(() => {
    loadGameState()
  }, [])

  // Update range guess when gameState changes
  useEffect(() => {
    if (gameState) {
      const { minYear, maxYear } = getSmartRange()
      setRangeGuess(Math.floor((minYear + maxYear) / 2))
    }
  }, [gameState?.guesses])

  const loadGameState = async () => {
    try {
      const result = await getTodayImage()
      setGameState(result)
    } catch (error) {
      console.error("Failed to load game state:", error)
    } finally {
      setLoading(false)
    }
  }

  const { minYear, maxYear } = getSmartRange()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guess.trim() || submitting || !gameState || gameState.completed) return

    setSubmitting(true)
    try {
      const year = parseInt(guess)
      if (isNaN(year) || year < minYear || year > maxYear) {
        alert(t("daily.invalidYear"))
        return
      }

      const result = await submitGuess({ year })
      if (result?.data) {
        setGameState(result.data)
      }
      setGuess("")
    } catch (error) {
      console.error("Failed to submit guess:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGuessChange = (value: string) => {
    setGuess(value)
    const year = parseInt(value)
    if (!isNaN(year) && year >= minYear && year <= maxYear) {
      setRangeGuess(year)
    }
  }

  const handleRangeChange = (value: number) => {
    setRangeGuess(value)
    setGuess(value.toString())
  }

  if (loading) {
    return <div className="text-center">{t("daily.loading")}</div>
  }

  if (!gameState) {
    return <div className="text-center">{t("daily.failedToLoad")}</div>
  }

  const remainingAttempts = 5 - gameState.attempts

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("daily.title")}</h1>
        <Badge variant={gameState.completed ? "destructive" : "secondary"}>
          {remainingAttempts} {t("daily.attemptsLeft")}
        </Badge>
      </div>

      <div className="space-y-6">
        {!gameState.completed && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <Image
              src={gameState.imageUrl}
              alt="Daily challenge image"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {gameState.guesses && gameState.guesses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t("daily.previousGuesses")}</h3>
            <div className="space-y-2">
              {gameState.guesses.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-medium">
                      {hint.year}
                    </span>
                    {hint.direction !== "correct" && (
                      <span className="text-sm flex items-center gap-1">
                        <span className="text-lg">{hint.direction === "higher" ? "↑" : "↓"}</span>
                        {t(`daily.${hint.direction}`)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    {hint.direction === "correct" && (
                      <span className="font-medium">
                        ✓ {t("daily.correct")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!gameState.completed ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="year" className="block text-lg font-medium text-center">
                {t("daily.guessPrompt")}
              </label>
              <div className="space-y-4">
                <Input
                  id="year"
                  type="number"
                  min={minYear}
                  max={maxYear}
                  value={guess}
                  onChange={(e) => handleGuessChange(e.target.value)}
                  placeholder={t("daily.yearPlaceholder")}
                  className="text-center text-xl py-3"
                  disabled={submitting}
                />
                <div className="space-y-3 p-4 rounded-lg border">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{minYear}</span>
                    <span className="text-lg font-bold">
                      {rangeGuess}
                    </span>
                    <span>{maxYear}</span>
                  </div>
                  <Slider
                    value={[rangeGuess]}
                    onValueChange={(value) => handleRangeChange(value[0])}
                    min={minYear}
                    max={maxYear}
                    step={1}
                    className="w-full"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold"
              disabled={submitting || !guess.trim()}
            >
              {submitting ? t("daily.submitting") : t("daily.submitGuess")}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {gameState.won ? t("daily.congratulations") : t("daily.betterLuck")}
              </div>
              <div className="text-xl">
                {t("daily.correctYear")}
                <span className="font-bold text-3xl ml-2">
                  {gameState.correctYear}
                </span>
              </div>
              <div className="text-sm">
                {gameState.attempts}/{5} {t("daily.attemptsLeft")}
              </div>
            </div>

            {gameState.dailyStats && (
              <div className="py-6 px-6 border rounded-xl">
                <div className="text-center space-y-2">
                  <p className="text-sm uppercase tracking-wide">
                    {t("daily.todaysWins")}
                  </p>
                  <p className="text-5xl font-bold">
                    {gameState.dailyStats.todayWins}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => window.open("/donate", "_blank")}
              variant="outline"
            >
              {t("daily.donate")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}