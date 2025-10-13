import { ComponentType } from 'react';
import { WaitingRoom } from '@/components/lobby/waiting-room';
import { GameInProgress } from '@/components/lobby/game-in-progress';
import { RoundResults } from '@/components/lobby/round-results';
import type { Lobby, Player, ChatMessage, Guess, LobbyActions, RoundData } from '@/lib/types/lobby';

type GameState = 'WAITING' | 'STARTING' | 'PLAYING' | 'ROUND_RESULTS' | 'FINISHED';

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

type GameStateComponentMap = {
  WAITING: ComponentType<WaitingStateProps>;
  STARTING: ComponentType<WaitingStateProps>;
  PLAYING: ComponentType<PlayingStateProps>;
  ROUND_RESULTS: ComponentType<ResultsStateProps>;
  FINISHED: ComponentType<WaitingStateProps>;
};

export const GAME_STATE_COMPONENTS: GameStateComponentMap = {
  WAITING: WaitingRoom,
  STARTING: WaitingRoom,
  PLAYING: GameInProgress,
  ROUND_RESULTS: RoundResults,
  FINISHED: WaitingRoom
};

// State-specific props builders
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
      } as WaitingStateProps;

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
      } as PlayingStateProps;

    case 'ROUND_RESULTS':
      return {
        ...baseProps,
        lastRoundResults: additionalProps.lastRoundResults,
        onSendReaction: additionalProps.onSendReaction,
        nextRoundCountdown: additionalProps.nextRoundCountdown
      } as ResultsStateProps;

    case 'FINISHED':
      return {
        ...baseProps,
        countdown: additionalProps.countdown,
        onReady: additionalProps.onReady,
        optimisticReady: additionalProps.optimisticReady,
        gameFinished: true
      } as WaitingStateProps;

    default:
      throw new Error(`Unknown game state: ${state}`);
  }
}

export function getGameStateComponent(state: GameState) {
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
