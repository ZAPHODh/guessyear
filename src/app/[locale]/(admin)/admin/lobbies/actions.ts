"use server"

import { z } from "zod"
import { actionClient } from "@/lib/client/safe-action"
import { requireAdmin } from "@/lib/server/dto"
import { prisma } from "@/lib/server/db"
import { revalidatePath } from "next/cache"

export async function getAllLobbies() {
  await requireAdmin()

  return prisma.lobby.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      players: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          score: 'desc'
        }
      },
      _count: {
        select: {
          players: true,
          gameRounds: true,
          chatMessages: true,
        }
      }
    }
  })
}

export async function getLobbyById(id: string) {
  await requireAdmin()

  return prisma.lobby.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      players: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          score: 'desc'
        }
      },
      gameRounds: {
        include: {
          image: {
            select: {
              id: true,
              year: true,
              cloudinaryUrl: true,
            }
          },
          guesses: {
            include: {
              player: {
                select: {
                  username: true,
                }
              }
            }
          }
        },
        orderBy: {
          roundNumber: 'asc'
        }
      },
      chatMessages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      },
      _count: {
        select: {
          players: true,
          gameRounds: true,
          chatMessages: true,
        }
      }
    }
  })
}

const deleteLobbySchema = z.object({
  lobbyId: z.string(),
})

export const deleteLobby = actionClient
  .metadata({ actionName: "deleteLobby" })
  .schema(deleteLobbySchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    await prisma.lobby.delete({
      where: { id: parsedInput.lobbyId }
    })

    revalidatePath("/admin/lobbies")
    return { success: true }
  })

const bulkDeleteLobbiesSchema = z.object({
  lobbyIds: z.array(z.string()),
})

export const bulkDeleteLobbies = actionClient
  .metadata({ actionName: "bulkDeleteLobbies" })
  .schema(bulkDeleteLobbiesSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    await prisma.lobby.deleteMany({
      where: {
        id: {
          in: parsedInput.lobbyIds
        }
      }
    })

    revalidatePath("/admin/lobbies")
    return { success: true, deleted: parsedInput.lobbyIds.length }
  })

const deleteFinishedLobbiesSchema = z.object({})

export const deleteFinishedLobbies = actionClient
  .metadata({ actionName: "deleteFinishedLobbies" })
  .schema(deleteFinishedLobbiesSchema)
  .action(async () => {
    await requireAdmin()

    const result = await prisma.lobby.deleteMany({
      where: {
        status: 'FINISHED'
      }
    })

    revalidatePath("/admin/lobbies")
    return { success: true, deleted: result.count }
  })

const deleteOldLobbiesSchema = z.object({
  days: z.number().min(1).max(365).default(7),
})

export const deleteOldLobbies = actionClient
  .metadata({ actionName: "deleteOldLobbies" })
  .schema(deleteOldLobbiesSchema)
  .action(async ({ parsedInput }) => {
    await requireAdmin()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - parsedInput.days)

    const result = await prisma.lobby.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    })

    revalidatePath("/admin/lobbies")
    return { success: true, deleted: result.count }
  })
