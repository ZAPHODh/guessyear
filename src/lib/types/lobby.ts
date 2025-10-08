// Flexible Lobby type that accepts Prisma result with includes
export type Lobby = {
  id: string;
  name: string;
  description: string | null;
  hostUserId: string;
  maxPlayers: number;
  rounds: number;
  roundTimer: number;
  gameMode: 'CLASSIC' | 'ELIMINATION' | 'MARATHON';
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  isOpen: boolean;
  hintsEnabled: boolean;
  targetScore: number | null;
  inviteCode: string | null;
  createdAt: Date | string;
  [key: string]: unknown; // Allow additional properties from Prisma includes
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  isReady: boolean;
  isEliminated: boolean;
  streak: number;
  userId: string | undefined;
  sessionId: string | undefined;
}

export interface RoundData {
  roundNumber: number;
  image: {
    url: string;
    description?: string | null;
  };
  timer: number;
  hintsEnabled: boolean;
}

export interface Guess {
  player: string;
  year: number;
  points: number;
  speedBonus: number;
  accuracy: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  type: 'CHAT' | 'SYSTEM' | 'QUICK_PHRASE';
  createdAt: string;
}

export interface RoundResults {
  correctYear: number;
  guesses: Guess[];
  leaderboard: Player[];
  nextRoundCountdown?: number;
}

export interface LobbyUpdateSettings {
  gameMode?: 'CLASSIC' | 'ELIMINATION' | 'MARATHON';
  roundTimer?: number;
  rounds?: number;
  hintsEnabled?: boolean;
  maxPlayers?: number;
}

export interface LobbyActions {
  toggleReady: (isReady: boolean) => void;
  startGame: () => void;
  submitGuess: (year: number) => void;
  sendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  sendReaction: (emoji: string, targetType: string, targetId?: string, roundId?: string) => void;
  updateLobbySettings: (settings: LobbyUpdateSettings) => void;
  kickPlayer: (playerId: string) => void;
  transferHost: (playerId: string) => void;
  restartGame: () => void;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  emailVerified: boolean | null;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;
}
