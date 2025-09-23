import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/db';
import { getCurrentSession } from '@/lib/server/auth/session';

// POST /api/lobbies/cleanup - Manual cleanup of abandoned lobbies (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    let cleanedCount = 0;
    let deletedCount = 0;

    // Find lobbies that haven't been updated recently and have no players
    const abandonedLobbies = await prisma.lobby.findMany({
      where: {
        updatedAt: { lt: cutoffTime },
        status: { not: 'FINISHED' }
      },
      include: {
        players: true
      }
    });

    for (const lobby of abandonedLobbies) {
      if (lobby.players.length === 0) {
        await prisma.lobby.update({
          where: { id: lobby.id },
          data: { status: 'FINISHED' }
        });
        cleanedCount++;
      }
    }

    // Also clean up very old finished lobbies (older than 24 hours)
    const veryOldCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleteResult = await prisma.lobby.deleteMany({
      where: {
        status: 'FINISHED',
        updatedAt: { lt: veryOldCutoff }
      }
    });
    deletedCount = deleteResult.count;

    // Force cleanup any lobby with duplicate players (fixing current issue)
    const duplicateIssueLobbies = await prisma.lobby.findMany({
      where: {
        status: { in: ['WAITING', 'PLAYING'] }
      },
      include: {
        players: true
      }
    });

    let duplicateFixed = 0;
    for (const lobby of duplicateIssueLobbies) {
      // Check for duplicate player IDs
      const playerIds = lobby.players.map(p => p.id);
      const uniquePlayerIds = [...new Set(playerIds)];

      if (playerIds.length !== uniquePlayerIds.length) {
        // End this lobby - it has duplicate players
        await prisma.lobby.update({
          where: { id: lobby.id },
          data: { status: 'FINISHED' }
        });
        duplicateFixed++;
      }
    }

    return NextResponse.json({
      success: true,
      cleaned: cleanedCount,
      deleted: deletedCount,
      duplicateFixed,
      message: `Cleaned ${cleanedCount} abandoned lobbies, deleted ${deletedCount} old lobbies, fixed ${duplicateFixed} duplicate issues`
    });

  } catch (error) {
    console.error('Error during manual cleanup:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

// GET /api/lobbies/cleanup - Get cleanup stats (admin only)
export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000);
    const veryOldCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [abandonedCount, oldFinishedCount, totalLobbies] = await Promise.all([
      prisma.lobby.count({
        where: {
          updatedAt: { lt: cutoffTime },
          status: { not: 'FINISHED' },
          players: { none: {} }
        }
      }),
      prisma.lobby.count({
        where: {
          status: 'FINISHED',
          updatedAt: { lt: veryOldCutoff }
        }
      }),
      prisma.lobby.count()
    ]);

    return NextResponse.json({
      abandonedLobbies: abandonedCount,
      oldFinishedLobbies: oldFinishedCount,
      totalLobbies,
      cutoffTime: cutoffTime.toISOString(),
      oldCutoffTime: veryOldCutoff.toISOString()
    });

  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}