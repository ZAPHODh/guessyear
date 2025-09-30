import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/db';
import { getCurrentSession } from '@/lib/server/auth/session';
import { z } from 'zod';

const updateLobbySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  maxPlayers: z.number().min(2).max(8).optional(),
  rounds: z.number().min(1).max(20).optional(),
  roundTimer: z.number().min(15).max(300).optional(),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']).optional(),
  isOpen: z.boolean().optional(),
  hintsEnabled: z.boolean().optional(),
  targetScore: z.number().min(100).max(5000).optional()
});

// GET /api/lobbies/[id] - Get specific lobby
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const lobby = await prisma.lobby.findUnique({
      where: { id },
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
      return NextResponse.json(
        { error: 'Lobby not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error fetching lobby:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lobby' },
      { status: 500 }
    );
  }
}

// PATCH /api/lobbies/[id] - Update lobby (host only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const lobby = await prisma.lobby.findUnique({
      where: { id: id },
      select: { hostUserId: true, status: true }
    });

    if (!lobby) {
      return NextResponse.json(
        { error: 'Lobby not found' },
        { status: 404 }
      );
    }

    if (lobby.hostUserId !== user.id) {
      return NextResponse.json(
        { error: 'Only the host can update the lobby' },
        { status: 403 }
      );
    }

    if (lobby.status !== 'WAITING') {
      return NextResponse.json(
        { error: 'Cannot update lobby while game is in progress' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateLobbySchema.parse(body);

    const updatedLobby = await prisma.lobby.update({
      where: { id: id },
      data: validatedData,
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

    return NextResponse.json(updatedLobby);
  } catch (error) {
    console.error('Error updating lobby:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update lobby' },
      { status: 500 }
    );
  }
}

// DELETE /api/lobbies/[id] - Delete lobby (host only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const lobby = await prisma.lobby.findUnique({
      where: { id: id },
      select: { hostUserId: true, status: true }
    });

    if (!lobby) {
      return NextResponse.json(
        { error: 'Lobby not found' },
        { status: 404 }
      );
    }

    if (lobby.hostUserId !== user.id) {
      return NextResponse.json(
        { error: 'Only the host can delete the lobby' },
        { status: 403 }
      );
    }

    if (lobby.status === 'PLAYING') {
      return NextResponse.json(
        { error: 'Cannot delete lobby while game is in progress' },
        { status: 400 }
      );
    }

    await prisma.lobby.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lobby:', error);
    return NextResponse.json(
      { error: 'Failed to delete lobby' },
      { status: 500 }
    );
  }
}