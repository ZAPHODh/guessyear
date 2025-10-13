"use client";

import { GameView } from './game-view';
import { LobbyChat } from './lobby-chat';
import type { RoundData, Player, ChatMessage, Guess, LobbyActions } from '@/lib/types/lobby';

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
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  gameState: string;
  isHost: boolean;
  actions: LobbyActions;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
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
  currentPlayer,
  chatMessages,
  onSendMessage,
  username,
  gameState,
  isHost,
  actions,
  lastRoundResults
}: GameInProgressProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-3 sm:gap-4 lg:gap-6">
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
      <div className="space-y-4 min-w-0">
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
          lastRoundResults={lastRoundResults}
          players={leaderboard.length > 0 ? leaderboard : players}
          currentPlayer={currentPlayer}
          showPlayerScores={true}
        />
      </div>
    </div>
  );
}
