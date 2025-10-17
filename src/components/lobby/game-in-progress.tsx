"use client";

import { GameView } from './game-view';
import type { RoundData, Player } from '@/lib/types/lobby';

interface GameInProgressProps {
  currentRound: RoundData | null;
  timeRemaining: number;
  guess: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
  players: Player[];
  leaderboard: Player[];
  currentPlayer: Player | undefined;
}

export function GameInProgress({
  currentRound,
  timeRemaining,
  guess,
  onGuessChange,
  onSubmitGuess,
  hasSubmittedGuess,
  lobbyTimer,
  players,
  leaderboard,
  currentPlayer
}: GameInProgressProps) {
  return (
    <div className="min-w-0 overflow-hidden">
      {currentRound && (
        <GameView
          round={currentRound}
          timeRemaining={timeRemaining}
          guess={guess}
          onGuessChange={onGuessChange}
          onSubmitGuess={onSubmitGuess}
          hasSubmittedGuess={hasSubmittedGuess}
          lobbyTimer={lobbyTimer}
          players={leaderboard.length > 0 ? leaderboard : players}
          currentPlayer={currentPlayer}
        />
      )}
    </div>
  );
}
