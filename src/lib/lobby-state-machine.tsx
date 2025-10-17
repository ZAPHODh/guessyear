import { ComponentType, ComponentProps } from 'react';
import { WaitingRoom } from '@/components/lobby/waiting-room';
import { GameInProgress } from '@/components/lobby/game-in-progress';
import type { Lobby, Player, ChatMessage, Guess, LobbyActions, RoundData } from '@/lib/types/lobby';

type GameState = 'WAITING' | 'STARTING' | 'PLAYING' | 'FINISHED';

type ComponentPropsType<T extends ComponentType<any>> = T extends ComponentType<infer P> ? P : never;

interface BaseGameStateProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer: Player | undefined;
  gameState: GameState;
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

export const GAME_STATE_COMPONENTS = {
  WAITING: WaitingRoom,
  STARTING: WaitingRoom,
  PLAYING: GameInProgress,
  FINISHED: WaitingRoom
} as const;

type GameStateComponentMap = typeof GAME_STATE_COMPONENTS;


type StatePropsMap = {
  [K in keyof GameStateComponentMap]: ComponentProps<GameStateComponentMap[K]>
};


type StatePropsUnion = StatePropsMap[keyof StatePropsMap];


type PropsBuilder<K extends GameState> = (
  baseProps: BaseGameStateProps,
  additionalProps: Record<string, any>
) => StatePropsMap[K];

const STATE_PROPS_BUILDERS: {
  [K in GameState]: PropsBuilder<K>
} = {
  WAITING: (baseProps, additionalProps) => ({
    ...baseProps,
    countdown: additionalProps.countdown,
    onReady: additionalProps.onReady,
    optimisticReady: additionalProps.optimisticReady,
    gameFinished: false
  }),

  STARTING: (baseProps, additionalProps) => ({
    ...baseProps,
    countdown: additionalProps.countdown,
    onReady: additionalProps.onReady,
    optimisticReady: additionalProps.optimisticReady,
    gameFinished: false
  }),

  PLAYING: (baseProps, additionalProps) => ({
    ...baseProps,
    currentRound: additionalProps.currentRound,
    timeRemaining: additionalProps.timeRemaining,
    guess: additionalProps.guess,
    onGuessChange: additionalProps.onGuessChange,
    onSubmitGuess: additionalProps.onSubmitGuess,
    hasSubmittedGuess: additionalProps.hasSubmittedGuess,
    lobbyTimer: additionalProps.lobbyTimer,
    lastRoundResults: additionalProps.lastRoundResults
  }),

  FINISHED: (baseProps, additionalProps) => ({
    ...baseProps,
    countdown: additionalProps.countdown,
    onReady: additionalProps.onReady,
    optimisticReady: additionalProps.optimisticReady,
    gameFinished: true
  })
} as const;

export function buildStateProps(
  state: GameState,
  baseProps: BaseGameStateProps,
  additionalProps: Record<string, any>
): StatePropsUnion {
  const builder = STATE_PROPS_BUILDERS[state];
  if (!builder) {
    throw new Error(`Unknown game state: ${state}`);
  }
  return builder(baseProps, additionalProps);
}

export function getGameStateComponent<K extends GameState>(
  state: K
): GameStateComponentMap[K] {
  return GAME_STATE_COMPONENTS[state];
}

export type {
  GameState,
  GameStateComponentMap,
  StatePropsMap,
  StatePropsUnion,
  BaseGameStateProps,
  WaitingStateProps,
  PlayingStateProps
};
