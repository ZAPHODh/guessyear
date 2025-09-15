"use client"

import { useScopedI18n } from "@/locales/client"
import { DailyStatsChart } from "@/components/charts/daily-stats-chart"
import { ShareButton } from "@/components/ui/share-button"
import { GuessHistory } from "./guess-history"

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

interface GameCompleteProps {
  won: boolean
  correctYear: number
  attempts: number
  guesses: GuessHint[]
  dailyStats?: {
    chartData: {
      attempt: number
      winPercentage: number
      gameCount: number
      isUserAttempt: boolean
    }[]
    totalGames: number
  }
}

export function GameComplete({
  won,
  correctYear,
  attempts,
  guesses,
  dailyStats
}: GameCompleteProps) {
  const t = useScopedI18n("daily")

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="text-3xl font-bold">
          {won ? t("congratulations") : t("betterLuck")}
        </div>
        <div className="text-xl">
          <span className="font-bold text-3xl ml-2">
            {correctYear}
          </span>
        </div>
        {won && (
          <ShareButton
            attempts={attempts}
            won={won}
            correctYear={correctYear}
            className="mt-4"
          />
        )}
      </div>

      {dailyStats && (
        <DailyStatsChart
          data={dailyStats.chartData}
          totalGames={dailyStats.totalGames}
          userAttempt={attempts}
          gameWon={won}
        />
      )}

      <GuessHistory guesses={guesses} />
    </div>
  )
}