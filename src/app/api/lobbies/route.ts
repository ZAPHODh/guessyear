import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/db';
import { getCurrentSession } from '@/lib/server/auth/session';
import { z } from 'zod';

const createLobbySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  maxPlayers: z.number().min(2).max(8),
  rounds: z.number().min(1).max(20),
  roundTimer: z.number().min(15).max(300),
  gameMode: z.enum(['CLASSIC', 'ELIMINATION', 'MARATHON']),
  isOpen: z.boolean(),
  hintsEnabled: z.boolean(),
  targetScore: z.number().min(100).max(5000).optional(),
  hostUserId: z.string()
});

// GET /api/lobbies - List all lobbies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const gameMode = searchParams.get('gameMode');
    const isOpen = searchParams.get('isOpen');

    const where: any = {
      // By default, exclude finished lobbies unless specifically requested
      status: status || { not: 'FINISHED' }
    };

    if (status) {
      where.status = status;
    }

    if (gameMode) {
      where.gameMode = gameMode;
    }

    if (isOpen !== null) {
      where.isOpen = isOpen === 'true';
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

    return NextResponse.json(lobbies);
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lobbies' },
      { status: 500 }
    );
  }
}

// POST /api/lobbies - Create new lobby
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createLobbySchema.parse({
      ...body,
      hostUserId: user.id
    });

    // Generate invite code for private lobbies
    const inviteCode = !validatedData.isOpen
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : null;

    const lobby = await prisma.lobby.create({
      data: {
        ...validatedData,
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

    // Automatically add the host as a player
    await prisma.lobbyPlayer.create({
      data: {
        lobbyId: lobby.id,
        userId: user.id,
        username: user.name || user.email?.split('@')[0] || 'Host',
        avatar: '👑', // Crown for host
        isReady: false
      }
    });

    return NextResponse.json(lobby, { status: 201 });
  } catch (error) {
    console.error('Error creating lobby:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create lobby' },
      { status: 500 }
    );
  }
}