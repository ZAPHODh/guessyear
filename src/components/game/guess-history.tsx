"use client"

import { useScopedI18n } from "@/locales/client"

interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

interface GuessHistoryProps {
  guesses: GuessHint[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  const t = useScopedI18n("daily")

  if (!guesses || guesses.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {guesses.slice().reverse().map((hint, index) => (
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
  )
}