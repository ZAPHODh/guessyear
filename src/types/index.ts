import { z } from "zod";

// User type without importing from Prisma (safe for client-side)
export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
    picture: string | null;
    githubId: number | null;
    googleId: string | null;
    role: "USER" | "ADMIN";
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CurrentUser = {
    id: string;
    name: string;
    email: string;
    picture: string;
};

export interface payload {
    name: string;
    email: string;
    picture?: string;
}

export const settingsSchema = z.object({
    picture: z.string().url(),
    name: z
        .string({
            error: "Please type your name.",
        })
        .min(3, {
            message: "Name must be at least 3 characters.",
        })
        .max(50, {
            message: "Name must be at most 50 characters.",
        }),
    email: z.string().email(),
    shortBio: z.string().optional(),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: number;
        isPro: boolean;
    };

export interface SendWelcomeEmailProps {
    toMail: string;
    userName: string;
}

export interface SendOTPProps extends SendWelcomeEmailProps {
    code: string;
}

export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentDate: string;
  version: number;
}

export const defaultPreferences: CookiePreferences = {
  essential: true,
  performance: false,
  functional: false,
  marketing: false,
};

export const COOKIE_CONSENT_NAME = "cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_DURATION_MONTHS = 12;

export interface GoogleAnalyticsConfig {
  measurementId: string;
}

export interface GoogleAdsConfig {
  conversionId: string;
}

// Lobby and Multiplayer Types
export interface Player {
  id: string
  username: string
  score: number
  isReady: boolean
  userId?: string | null
  sessionId?: string | null
  user?: {
    id: string
    name?: string | null
    picture?: string | null
  } | null
}

export interface GameRound {
  id: string
  roundNumber: number
  status: 'ACTIVE' | 'COMPLETED'
  image: {
    id: string
    cloudinaryUrl: string
    year: number
    description?: string | null
  }
  guesses?: Array<{
    id: string
    year: number
    points: number
    player: Player
  }>
}

export interface Lobby {
  id: string
  name: string
  maxPlayers: number
  rounds: number
  status: 'WAITING' | 'PLAYING' | 'FINISHED'
  currentRound: number
  isOpen: boolean
  roundTimer?: number
  host: {
    id: string
    name?: string | null
    picture?: string | null
  }
  players: Player[]
  gameRounds?: GameRound[]
}

export interface RoundResult {
  year: number
  points: number
  player: Player
}

export interface LobbyRoomClientProps {
  lobby: Lobby
  currentPlayer: Player | null
  isHost?: boolean
  currentUser?: CurrentUser | null
}

export interface RoundResultsModalProps {
  isOpen: boolean
  roundResults: RoundResult[]
  correctAnswer: number
  currentRound: number
}

export interface RoundTimerProps {
  timeRemaining: number | null
  totalTime: number
}

export interface JoinLobbyButtonProps {
  lobbyId: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  className?: string
}

// Daily Game Types
export interface GuessHint {
  year: number
  difference: number
  direction: "higher" | "lower" | "correct"
}

export interface CookieGameState {
  date: string
  attempts: number
  completed: boolean
  won: boolean
  imageId: string
  guesses: GuessHint[]
}

export interface DailyPageProps {
  params: Promise<{ locale: string }>
}