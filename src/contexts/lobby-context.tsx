"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { Lobby, User, Player, LobbyActions, RoundData, ChatMessage, Guess } from '@/lib/types/lobby';

interface ProfileData {
  user: User | null;
  showProfileDialog: boolean;
  anonymousProfile: {
    name: string;
    avatar?: string;
  };
  isProfileSet: boolean;
  username: string;
  avatar: string;
  handleSaveProfile: (profile: { name: string; avatar?: string }) => Promise<void>;
}

interface LobbyContextValue {
  // Lobby data
  lobby: Lobby;
  user: User | null;
  sessionId: string | null;

  // Game state
  players: Player[];
  isConnected: boolean;
  gameState: 'WAITING' | 'STARTING' | 'PLAYING' | 'ROUND_RESULTS' | 'FINISHED';
  currentRound: RoundData | null;
  timeRemaining: number;
  chatMessages: ChatMessage[];
  leaderboard: Player[];
  lastRoundResults: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  hasSubmittedGuess: boolean;
  countdown: number | null;
  nextRoundCountdown: number | null;
  error: string | null;

  // Derived state
  isHost: boolean;
  currentPlayer: Player | undefined;
  username: string;

  // Profile state
  profile: ProfileData;

  // Actions
  actions: LobbyActions;
}

const LobbyContext = createContext<LobbyContextValue | null>(null);

interface LobbyProviderProps {
  children: ReactNode;
  value: LobbyContextValue;
}

export function LobbyProvider({ children, value }: LobbyProviderProps) {
  return (
    <LobbyContext.Provider value={value}>
      {children}
    </LobbyContext.Provider>
  );
}

export function useLobby() {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error('useLobby must be used within LobbyProvider');
  }
  return context;
}

export type { LobbyContextValue, ProfileData };
