import { useMemo } from "react"

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

interface UseSmartRangeParams {
  correctYear?: number
  guesses: GuessHint[]
  attempts: number
}

interface SmartRangeResult {
  minYear: number
  maxYear: number
  confidence: number // 0-100, how narrow the range is
}

export function useSmartRange({ correctYear, guesses, attempts }: UseSmartRangeParams): SmartRangeResult {
  return useMemo(() => {
    console.log('useSmartRange recalculating:', { correctYear, guessesLength: guesses.length, attempts, guesses })

    const currentYear = new Date().getFullYear()
    let currentMin = 1800
    let currentMax = currentYear

    guesses.forEach((guess) => {
      if (guess.direction === "higher") {
        currentMin = Math.max(currentMin, guess.year + 1)
      } else if (guess.direction === "lower") {
        currentMax = Math.min(currentMax, guess.year - 1)
      }
    })

    if (guesses.length === 0) {
      return {
        minYear: currentMin,
        maxYear: currentMax,
        confidence: 0
      }
    }


    const totalRange = currentYear - 1800
    const currentRange = currentMax - currentMin
    const confidence = Math.round(((totalRange - currentRange) / totalRange) * 100)

    if (correctYear) {
      const getPercentageForAttempt = (attemptNumber: number): number => {
        const percentages = [0.8, 0.6, 0.4, 0.25, 0.1]
        return percentages[attemptNumber] || 0.05
      }

      const currentAttempt = guesses.length
      const percentage = getPercentageForAttempt(currentAttempt)

      const idealSpread = Math.floor((currentYear - 1800) * percentage)

      const seed = correctYear * 17 + attempts * 31 + currentAttempt * 7
      const randomFactor = 0.9 + ((seed % 1000) / 1000) * 0.2
      const adjustedSpread = Math.floor(idealSpread * randomFactor)

      const idealMin = Math.max(1800, correctYear - adjustedSpread)
      const idealMax = Math.min(currentYear, correctYear + adjustedSpread)

      const finalMin = Math.max(currentMin, idealMin)
      const finalMax = Math.min(currentMax, idealMax)

      const minYear = Math.min(finalMin, finalMax - 1)
      const maxYear = Math.max(finalMax, finalMin + 1)

      return {
        minYear,
        maxYear,
        confidence: Math.min(confidence, 95)
      }
    }

    return {
      minYear: currentMin,
      maxYear: currentMax,
      confidence: Math.min(confidence, 95) // max 95%
    }
  }, [correctYear, guesses, attempts])
}