import { z } from 'zod';

const playerSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string(),
  score: z.number(),
  isReady: z.boolean(),
  isEliminated: z.boolean(),
  streak: z.number(),
  userId: z.string().nullable().transform(val => val ?? undefined),
  sessionId: z.string().nullable().transform(val => val ?? undefined)
});

const lobbySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  hostUserId: z.string(),
  maxPlayers: z.number(),
  rounds: z.number(),
  roundTimer: z.number(),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']),
  status: z.enum(['WAITING', 'PLAYING', 'FINISHED']),
  isOpen: z.boolean(),
  hintsEnabled: z.boolean(),
  targetScore: z.number().nullable().optional(),
  inviteCode: z.string().nullable().optional(),
  chatMessages: z.array(z.unknown()).optional(),
  players: z.array(playerSchema).optional()
});

const roundDataSchema = z.object({
  roundNumber: z.number(),
  image: z.object({
    url: z.string(),
    description: z.string().nullable().optional()
  }),
  timer: z.number(),
  hintsEnabled: z.boolean()
});

const guessSchema = z.object({
  player: z.string(),
  year: z.number(),
  points: z.number(),
  speedBonus: z.number(),
  accuracy: z.number()
});

const roundResultsSchema = z.object({
  correctYear: z.number(),
  guesses: z.array(guessSchema),
  leaderboard: z.array(playerSchema),
  nextRoundCountdown: z.number().optional()
});

const chatMessageSchema = z.object({
  id: z.string(),
  username: z.string(),
  message: z.string(),
  type: z.enum(['CHAT', 'SYSTEM', 'QUICK_PHRASE']),
  createdAt: z.string()
});

export function validateSocketData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  eventName: string
): T | null {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(`[Socket Validation Error] ${eventName}:`, result.error.issues);
    return null;
  }

  return result.data;
}

export const socketSchemas = {
  player: playerSchema,
  lobby: lobbySchema,
  roundData: roundDataSchema,
  guess: guessSchema,
  roundResults: roundResultsSchema,
  chatMessage: chatMessageSchema
};
