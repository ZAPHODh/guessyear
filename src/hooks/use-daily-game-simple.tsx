"use client";

import { useState, useCallback, useMemo } from "react";
import { useCurrentLocale } from "@/locales/client";
import { useSmartRange } from "./use-smart-range";
import { submitGuess } from "@/app/[locale]/(game)/daily/actions";
import type { GameState } from "@/components/layout/daily-game";

const MAX_ATTEMPTS = 5;

export function useDailyGameSimple(initialGameState: GameState) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = useCurrentLocale();

  // Calculate smart range for year inputs
  const { minYear, maxYear, confidence } = useSmartRange({
    correctYear: gameState.correctYear,
    guesses: gameState.guesses || [],
    attempts: gameState.attempts || 0
  });

  const remainingAttempts = useMemo(() => {
    return MAX_ATTEMPTS - gameState.attempts;
  }, [gameState.attempts]);

  const handleSubmitGuess = useCallback(async (year: number) => {
    if (gameState.completed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await submitGuess({
        year,
        locale,
        userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      if (result?.data) {
        setGameState(result.data);
      }
    } catch (error) {
      console.error("Failed to submit guess:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [gameState.completed, isSubmitting, locale]);

  return {
    gameState,
    isSubmitting,
    handleSubmitGuess,
    minYear,
    maxYear,
    confidence,
    remainingAttempts
  };
}