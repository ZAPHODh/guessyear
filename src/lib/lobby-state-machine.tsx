import { ComponentType, ComponentProps } from 'react';
import { WaitingRoom } from '@/components/lobby/waiting-room';
import { GameInProgress } from '@/components/lobby/game-in-progress';
import { RoundResults } from '@/components/lobby/round-results';
import type { Lobby, Player, ChatMessage, Guess, LobbyActions, RoundData } from '@/lib/types/lobby';

type GameState = 'WAITING' | 'STARTING' | 'PLAYING' | 'ROUND_RESULTS' | 'FINISHED';

// Helper type to get component props
type ComponentPropsType<T extends ComponentType<any>> = T extends ComponentType<infer P> ? P : never;

interface BaseGameStateProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer: Player | undefined;
  gameState: string;
  isHost: boolean;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  isConnected: boolean;
  actions: LobbyActions;
  leaderboard: Player[];
}

interface WaitingStateProps extends BaseGameStateProps {
  countdown: number | null;
  onReady: () => void;
  optimisticReady: boolean;
  gameFinished?: boolean;
}

interface PlayingStateProps extends BaseGameStateProps {
  currentRound: RoundData | null;
  timeRemaining: number;
  guess: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
}

interface ResultsStateProps extends BaseGameStateProps {
  lastRoundResults: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  onSendReaction: (emoji: string, targetType: string, targetId?: string, roundId?: string) => void;
  nextRoundCountdown?: number | null;
}

export const GAME_STATE_COMPONENTS = {
  WAITING: WaitingRoom,
  STARTING: WaitingRoom,
  PLAYING: GameInProgress,
  ROUND_RESULTS: RoundResults,
  FINISHED: WaitingRoom
} as const;

type GameStateComponentMap = typeof GAME_STATE_COMPONENTS;

// Type mapping for state to props using ComponentProps
type StatePropsMap = {
  WAITING: ComponentProps<typeof WaitingRoom>;
  STARTING: ComponentProps<typeof WaitingRoom>;
  PLAYING: ComponentProps<typeof GameInProgress>;
  ROUND_RESULTS: ComponentProps<typeof RoundResults>;
  FINISHED: ComponentProps<typeof WaitingRoom>;
};

// State-specific props builder - returns union type
export function buildStateProps(
  state: GameState,
  baseProps: BaseGameStateProps,
  additionalProps: Record<string, any>
): WaitingStateProps | PlayingStateProps | ResultsStateProps {
  switch (state) {
    case 'WAITING':
    case 'STARTING':
      return {
        ...baseProps,
        countdown: additionalProps.countdown,
        onReady: additionalProps.onReady,
        optimisticReady: additionalProps.optimisticReady,
        gameFinished: false
      };

    case 'PLAYING':
      return {
        ...baseProps,
        currentRound: additionalProps.currentRound,
        timeRemaining: additionalProps.timeRemaining,
        guess: additionalProps.guess,
        onGuessChange: additionalProps.onGuessChange,
        onSubmitGuess: additionalProps.onSubmitGuess,
        hasSubmittedGuess: additionalProps.hasSubmittedGuess,
        lobbyTimer: additionalProps.lobbyTimer,
        lastRoundResults: additionalProps.lastRoundResults
      };

    case 'ROUND_RESULTS':
      return {
        ...baseProps,
        lastRoundResults: additionalProps.lastRoundResults,
        onSendReaction: additionalProps.onSendReaction,
        nextRoundCountdown: additionalProps.nextRoundCountdown
      };

    case 'FINISHED':
      return {
        ...baseProps,
        countdown: additionalProps.countdown,
        onReady: additionalProps.onReady,
        optimisticReady: additionalProps.optimisticReady,
        gameFinished: true
      };

    default:
      throw new Error(`Unknown game state: ${state}`);
  }
}

export function getGameStateComponent(
  state: GameState
): ComponentType<any> {
  return GAME_STATE_COMPONENTS[state];
}

// Export types for use in other files
export type {
  GameState,
  BaseGameStateProps,
  WaitingStateProps,
  PlayingStateProps,
  ResultsStateProps
};
