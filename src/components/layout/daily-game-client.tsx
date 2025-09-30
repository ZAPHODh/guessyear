"use client";

import { useDailyGameSimple } from "@/hooks/use-daily-game-simple";
import { GameForm, GameHints, GuessHistory } from "@/components/game";
import type { GameState } from "./daily-game";

interface DailyGameClientProps {
  initialGameState: GameState;
}

export function DailyGameClient({ initialGameState }: DailyGameClientProps) {
  const {
    gameState,
    isSubmitting,
    handleSubmitGuess,
    minYear,
    maxYear,
    confidence,
    remainingAttempts
  } = useDailyGameSimple(initialGameState);

  if (gameState.completed) {
    return null; // Let server component handle completed state
  }

  return (
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
  );
}