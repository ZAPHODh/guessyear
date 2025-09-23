"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { authActionClient, actionClient } from "@/lib/client/safe-action";
import { prisma } from "@/lib/server/db";

const createLobbySchema = z.object({
  name: z.string().min(1, 'Lobby name is required').max(50, 'Name must be 50 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less').optional(),
  maxPlayers: z.number().min(2).max(8),
  rounds: z.number().min(1).max(20),
  roundTimer: z.number().min(15).max(300),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']),
  isOpen: z.boolean(),
  hintsEnabled: z.boolean(),
  targetScore: z.number().min(100).max(5000).optional(),
});

const getLobbySchema = z.object({
  id: z.string().min(1, 'Lobby ID is required'),
});

const updateLobbySchema = z.object({
  id: z.string().min(1, 'Lobby ID is required'),
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  maxPlayers: z.number().min(2).max(8).optional(),
  rounds: z.number().min(1).max(20).optional(),
  roundTimer: z.number().min(15).max(300).optional(),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']).optional(),
  isOpen: z.boolean().optional(),
  hintsEnabled: z.boolean().optional(),
  targetScore: z.number().min(100).max(5000).optional(),
});

const getLobbiesSchema = z.object({
  status: z.string().optional(),
  gameMode: z.string().optional(),
  isOpen: z.boolean().optional(),
});

export const createLobby = authActionClient
  .metadata({ actionName: "createLobby" })
  .schema(createLobbySchema)
  .action(async ({ parsedInput, ctx }) => {
    const inviteCode = !parsedInput.isOpen
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;

    const lobby = await prisma.lobby.create({
      data: {
        ...parsedInput,
        hostUserId: ctx.userId,
        inviteCode,
        status: 'WAITING'
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            players: true
          }
        }
      }
    });

    // Get user data and automatically add the host as a player
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { name: true, email: true }
    });

    await prisma.lobbyPlayer.create({
      data: {
        lobbyId: lobby.id,
        userId: ctx.userId,
        username: user?.name || user?.email?.split('@')[0] || 'Host',
        avatar: '👑', // Crown for host
        isReady: false
      }
    });

    return { lobby, success: true };
  });

export const getLobbies = actionClient
  .metadata({ actionName: "getLobbies" })
  .schema(getLobbiesSchema)
  .action(async ({ parsedInput }) => {
    const where: any = {
      // By default, exclude finished lobbies unless specifically requested
      status: parsedInput.status || { not: 'FINISHED' }
    };

    if (parsedInput.status) {
      where.status = parsedInput.status;
    }

    if (parsedInput.gameMode) {
      where.gameMode = parsedInput.gameMode;
    }

    if (parsedInput.isOpen !== undefined) {
      where.isOpen = parsedInput.isOpen;
    }

    const lobbies = await prisma.lobby.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            players: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // WAITING first
        { createdAt: 'desc' }
      ]
    });

    return { lobbies };
  });

export const getLobby = actionClient
  .metadata({ actionName: "getLobby" })
  .schema(getLobbySchema)
  .action(async ({ parsedInput }) => {
    const lobby = await prisma.lobby.findUnique({
      where: { id: parsedInput.id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        gameRounds: {
          include: {
            image: true,
            guesses: {
              include: {
                player: true
              }
            }
          },
          orderBy: { roundNumber: 'desc' },
          take: 1 // Only latest round
        },
        chatMessages: {
          orderBy: { createdAt: 'asc' },
          take: 50 // Last 50 messages
        },
        _count: {
          select: {
            players: true
          }
        }
      }
    });

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    return { lobby };
  });

export const updateLobby = authActionClient
  .metadata({ actionName: "updateLobby" })
  .schema(updateLobbySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, ...updateData } = parsedInput;

    // Check if user is the host
    const existingLobby = await prisma.lobby.findUnique({
      where: { id },
      select: { hostUserId: true, status: true }
    });

    if (!existingLobby) {
      throw new Error('Lobby not found');
    }

    if (existingLobby.hostUserId !== ctx.userId) {
      throw new Error('Only the host can update this lobby');
    }

    if (existingLobby.status !== 'WAITING') {
      throw new Error('Cannot update lobby that is not in waiting state');
    }

    const updatedLobby = await prisma.lobby.update({
      where: { id },
      data: updateData,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            players: true
          }
        }
      }
    });

    return { lobby: updatedLobby };
  });

export const deleteLobby = authActionClient
  .metadata({ actionName: "deleteLobby" })
  .schema(getLobbySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    // Check if user is the host
    const existingLobby = await prisma.lobby.findUnique({
      where: { id },
      select: { hostUserId: true, status: true }
    });

    if (!existingLobby) {
      throw new Error('Lobby not found');
    }

    if (existingLobby.hostUserId !== ctx.userId) {
      throw new Error('Only the host can delete this lobby');
    }

    if (existingLobby.status === 'PLAYING') {
      throw new Error('Cannot delete a game in progress');
    }

    await prisma.lobby.delete({
      where: { id }
    });

    redirect('/lobby');
  });