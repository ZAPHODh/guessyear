import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { getScopedI18n } from "@/locales/server"
import Image from "next/image"
import Link from "next/link"
import { GameComplete } from "@/components/game"
import { DailyGameClient } from "./daily-game-client"
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom"
import { Suspense } from "react"

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
  gameCompleted?: boolean
  tip?: string
}

interface DailyGameProps {
  initialGameState: GameState
}

export async function DailyGame({ initialGameState }: DailyGameProps) {
  const t = await getScopedI18n("daily")
  const remainingAttempts = 5 - initialGameState.attempts

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
        {!initialGameState.completed && (
          <Badge variant="secondary">
            {remainingAttempts} {t("attemptsLeft")}
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {!initialGameState.completed && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <ImageZoom className="w-full h-full">
              <Image
                src={initialGameState.imageUrl}
                alt="Daily challenge image"
                fill
                className="object-cover cursor-zoom-in"
                priority
              />
            </ImageZoom>
          </div>
        )}

        {!initialGameState.completed ? (
          <Suspense fallback={<div className="space-y-6">
            <div className="h-20 bg-muted rounded-lg animate-pulse" />
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            <div className="h-16 bg-muted rounded-lg animate-pulse" />
          </div>}>
            <DailyGameClient initialGameState={initialGameState} />
          </Suspense>
        ) : (
          <GameComplete
            won={initialGameState.won}
            correctYear={initialGameState.correctYear!}
            attempts={initialGameState.attempts}
            guesses={initialGameState.guesses || []}
            dailyStats={initialGameState.dailyStats}
          />
        )}
      </div>
    </div>
  )
}