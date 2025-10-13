"use client";

import { ResultsView } from './results-view';
import { LobbyChat } from './lobby-chat';
import type { Player, ChatMessage, Guess, LobbyActions } from '@/lib/types/lobby';

interface RoundResultsProps {
  lastRoundResults: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  leaderboard: Player[];
  onSendReaction: (emoji: string, targetType: string, targetId?: string, roundId?: string) => void;
  currentPlayer: Player | undefined;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  nextRoundCountdown?: number | null;
  gameState: string;
  isHost: boolean;
  actions: LobbyActions;
}

export function RoundResults({
  lastRoundResults,
  leaderboard,
  onSendReaction,
  currentPlayer,
  chatMessages,
  onSendMessage,
  username,
  nextRoundCountdown,
  gameState,
  isHost,
  actions
}: RoundResultsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <div className="lg:col-span-2">
        {lastRoundResults && (
          <ResultsView
            results={lastRoundResults}
            leaderboard={leaderboard}
            onSendReaction={onSendReaction}
            nextRoundCountdown={nextRoundCountdown || undefined}
          />
        )}
      </div>

      <div className="space-y-4">
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          lastRoundResults={lastRoundResults}
          players={leaderboard}
          currentPlayer={currentPlayer}
          showPlayerScores={true}
        />
      </div>
    </div>
  );
}
