"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { authActionClient, actionClient } from "@/lib/client/safe-action";
import { prisma } from "@/lib/server/db";
import { lobbyCache } from "@/lib/lobby-cache";

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
    try {
      const inviteCode = !parsedInput.isOpen
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : null;

      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        const lobby = await tx.lobby.create({
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

        const user = await tx.user.findUnique({
          where: { id: ctx.userId },
          select: { name: true, email: true }
        });

        await tx.lobbyPlayer.create({
          data: {
            lobbyId: lobby.id,
            userId: ctx.userId,
            username: user?.name || user?.email?.split('@')[0] || 'Host',
            avatar: '👑',
            isReady: false
          }
        });

        return lobby;
      });

      // Invalidate lobbies cache
      lobbyCache.invalidatePattern(/^lobbies:/);

      return { success: true, lobby: result };
    } catch (error) {
      console.error('[createLobby]', error);

      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2002') {
          return {
            success: false,
            error: 'A lobby with this name already exists'
          };
        }
      }

      return {
        success: false,
        error: 'Failed to create lobby. Please try again.'
      };
    }
  });

export const getLobbies = actionClient
  .metadata({ actionName: "getLobbies" })
  .schema(getLobbiesSchema)
  .action(async ({ parsedInput }) => {
    const cacheKey = `lobbies:${JSON.stringify(parsedInput)}`;

    // Try cache first
    const cached = lobbyCache.get(cacheKey);
    if (cached) {
      return { success: true, lobbies: cached, fromCache: true };
    }

    const lobbies = await prisma.lobby.findMany({
      where: {
        ...(parsedInput.status
          ? { status: parsedInput.status as 'WAITING' | 'PLAYING' | 'FINISHED' }
          : { status: { not: 'FINISHED' as const } }
        ),
        ...(parsedInput.gameMode && { gameMode: parsedInput.gameMode as 'CLASSIC' | 'ELIMINATION' | 'MARATHON' }),
        ...(parsedInput.isOpen !== undefined && { isOpen: parsedInput.isOpen })
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
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Cache for 30 seconds
    lobbyCache.set(cacheKey, lobbies, 30000);

    return { lobbies };
  });

export const getLobby = actionClient
  .metadata({ actionName: "getLobby" })
  .schema(getLobbySchema)
  .action(async ({ parsedInput }) => {
    try {
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
            take: 1
          },
          chatMessages: {
            orderBy: { createdAt: 'asc' },
            take: 50
          },
          _count: {
            select: {
              players: true
            }
          }
        }
      });

      if (!lobby) {
        return {
          success: false,
          error: 'Lobby not found'
        };
      }

      return { success: true, lobby };
    } catch (error) {
      console.error('[getLobby]', error);
      return {
        success: false,
        error: 'Failed to fetch lobby'
      };
    }
  });

export const updateLobby = authActionClient
  .metadata({ actionName: "updateLobby" })
  .schema(updateLobbySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { id, ...updateData } = parsedInput;

      const existingLobby = await prisma.lobby.findUnique({
        where: { id },
        select: { hostUserId: true, status: true }
      });

      if (!existingLobby) {
        return {
          success: false,
          error: 'Lobby not found'
        };
      }

      if (existingLobby.hostUserId !== ctx.userId) {
        return {
          success: false,
          error: 'Only the host can update this lobby'
        };
      }

      if (existingLobby.status !== 'WAITING') {
        return {
          success: false,
          error: 'Cannot update lobby that is not in waiting state'
        };
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

      return { success: true, lobby: updatedLobby };
    } catch (error) {
      console.error('[updateLobby]', error);
      return {
        success: false,
        error: 'Failed to update lobby'
      };
    }
  });

export const deleteLobby = authActionClient
  .metadata({ actionName: "deleteLobby" })
  .schema(getLobbySchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { id } = parsedInput;

      const existingLobby = await prisma.lobby.findUnique({
        where: { id },
        select: { hostUserId: true, status: true }
      });

      if (!existingLobby) {
        return {
          success: false,
          error: 'Lobby not found'
        };
      }

      if (existingLobby.hostUserId !== ctx.userId) {
        return {
          success: false,
          error: 'Only the host can delete this lobby'
        };
      }

      if (existingLobby.status === 'PLAYING') {
        return {
          success: false,
          error: 'Cannot delete a game in progress'
        };
      }

      await prisma.lobby.delete({
        where: { id }
      });

      redirect('/lobby');
    } catch (error) {
      console.error('[deleteLobby]', error);
      return {
        success: false,
        error: 'Failed to delete lobby'
      };
    }
  });