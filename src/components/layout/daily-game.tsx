"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import Image from "next/image"
import Link from "next/link"
import { useDailyGame } from "@/hooks/use-daily-game"
import { GameForm, GameComplete, GameHints, GuessHistory } from "@/components/game"

export interface GameState {
  imageUrl: string
  attempts: number
  completed: boolean
  won: boolean
  correctYear?: number
  dailyStats?: {
    chartData: {
      attempt: number
      winPercentage: number
      gameCount: number
      isUserAttempt: boolean
    }[]
    totalGames: number
  }
  guesses: {
    year: number
    difference: number
    direction: "higher" | "lower" | "correct"
  }[]
  tip?: string
}

interface DailyGameProps {
  initialGameState: GameState
}

export function DailyGame({ initialGameState }: DailyGameProps) {
  const t = useScopedI18n("daily")
  const {
    gameState,
    isSubmitting,
    handleSubmitGuess,
    minYear,
    maxYear,
    confidence,
    remainingAttempts
  } = useDailyGame(initialGameState)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/daily/how-to-play">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4 mr-1" />
            {t("howToPlay")}
          </Button>
        </Link>
        {!gameState.completed && <Badge variant={gameState.completed ? "destructive" : "secondary"}>
          {remainingAttempts} {t("attemptsLeft")}
        </Badge>}
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

        {!gameState.completed ? (
          <div className="space-y-6">
            <GameForm
              minYear={minYear}
              maxYear={maxYear}
              confidence={confidence}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitGuess}
              resetTrigger={gameState.guesses}
            />

            <GameHints attempts={gameState.attempts} tip={gameState.tip} />

            <GuessHistory guesses={gameState.guesses || []} />
          </div>
        ) : (
          <GameComplete
            won={gameState.won}
            correctYear={gameState.correctYear!}
            attempts={gameState.attempts}
            guesses={gameState.guesses || []}
            dailyStats={gameState.dailyStats}
          />
        )}
      </div>
    </div>
  )
}