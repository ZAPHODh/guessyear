"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Info } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { submitGuess } from "../../app/[locale]/daily/actions"
import { useScopedI18n } from "@/locales/client"
import { useCurrentLocale } from "@/locales/client"
import Image from "next/image"
import Link from "next/link"
import { useSmartRange } from "@/hooks/use-smart-range"
import { DailyStatsChart } from "@/components/charts/daily-stats-chart"
import { GoogleAd } from "@/components/ads/google-ad"

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

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
      isUserAttempt: boolean
    }[]
    totalGames: number
  }
  guesses: GuessHint[]
  tip?: string
}

type GuessForm = {
  year: string
}

interface DailyGameProps {
  initialGameState: GameState
}

export function DailyGame({ initialGameState }: DailyGameProps) {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const t = useScopedI18n("daily")
  const locale = useCurrentLocale()

  const { minYear, maxYear, confidence } = useSmartRange({
    correctYear: gameState.correctYear,
    guesses: gameState.guesses || [],
    attempts: gameState.attempts || 0
  })


  const schema = useMemo(() => {
    return z.object({
      year: z
        .string()
        .nonempty(t("invalidYear"))
        .refine((val) => !isNaN(Number(val)), {
          message: t("invalidYear"),
        })
        .refine((val) => {
          const num = Number(val)
          return num >= minYear && num <= maxYear
        }, {
          message: t("validRange", { min: minYear, max: maxYear }),
        })
    })
  }, [minYear, maxYear, t])

  const form = useForm<GuessForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: ""
    },
    mode: "onChange"
  })


  useEffect(() => {
    form.setValue("year", "", { shouldValidate: false })
  }, [gameState.guesses, form])

  const onSubmit = async (data: GuessForm) => {
    if (gameState.completed) return

    try {
      const year = Number(data.year)
      const result = await submitGuess({ year, locale })
      if (result?.data) {
        setGameState(result.data)
      }
      form.reset({ year: "" })
    } catch (error) {
      console.error("Failed to submit guess:", error)
    }
  }



  const remainingAttempts = 5 - gameState.attempts

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormLabel className="block text-lg font-medium text-center">
                  {t("guessPrompt")}
                </FormLabel>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={minYear}
                            max={maxYear}
                            {...field}
                            placeholder={t("yearPlaceholder")}
                            className="text-center text-xl py-3"
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-center text-sm text-muted-foreground mt-2 space-y-1">
                          <div>{t("validRange", { min: minYear, max: maxYear })}</div>
                          {confidence > 0 && (
                            <div className="text-xs flex items-center justify-center gap-2">
                              <div className="flex items-center gap-1">
                                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${confidence}%` }}
                                  />
                                </div>
                                <span>{confidence}% {t("rangeNarrowed")}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold"
                disabled={form.formState.isSubmitting || !form.watch("year")?.trim()}
              >
                {form.formState.isSubmitting ? t("submitting") : t("submitGuess")}
              </Button>
            </form>
            {gameState.attempts >= 3 && gameState.tip && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tip">
                  <AccordionTrigger className="text-left">
                    {t("needHint")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      {gameState.tip}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {gameState.guesses && gameState.guesses.length > 0 && (
              <div className="space-y-2">
                {gameState.guesses.slice().reverse().map((hint, index) => (
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
                          {t(`${hint.direction}`)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      {hint.direction === "correct" && (
                        <span className="font-medium">
                          ✓ {t("correct")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}


          </Form>
        ) : (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {gameState.won ? t("congratulations") : t("betterLuck")}
              </div>
              <div className="text-xl">
                <span className="font-bold text-3xl ml-2">
                  {gameState.correctYear}
                </span>
              </div>
            </div>

            {gameState.dailyStats && (
              <div className="py-6 px-6 border rounded-xl">
                <DailyStatsChart
                  data={gameState.dailyStats.chartData}
                  totalGames={gameState.dailyStats.totalGames}
                  userAttempt={gameState.attempts}
                />
              </div>
            )}

            {gameState.guesses && gameState.guesses.length > 0 && (
              <div className="space-y-2">
                {gameState.guesses.slice().reverse().map((hint, index) => (
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
                          {t(`${hint.direction}`)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      {hint.direction === "correct" && (
                        <span className="font-medium">
                          ✓ {t("correct")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* <Button
              onClick={() => window.open("https://buymeacoffee.com/zaphodh", "_blank")}
              variant="outline"
            >
              {t("donate")}
            </Button> */}
            <div className="py-4">
              <GoogleAd
                adSlot={'2528645043'}
                adFormat="rectangle"
                className="flex justify-center"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}