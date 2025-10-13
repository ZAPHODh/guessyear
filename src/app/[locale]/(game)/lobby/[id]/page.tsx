import { redirect, notFound } from 'next/navigation';
import { LobbyRoom } from '@/components/lobby/lobby-room';
import { LobbyErrorBoundary } from '@/components/lobby/lobby-error-boundary';
import { getCurrentSession } from '@/lib/server/auth/session';
import { prisma } from '@/lib/server/db';

interface LobbyPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function LobbyPage({ params }: LobbyPageProps) {
  const { user } = await getCurrentSession();

  const sessionId = user ? user.id : 'anonymous_' + Math.random().toString(36).substring(2, 15);

  const lobby = await prisma.lobby.findUnique({
    where: { id: (await params).id },
    include: {
      host: true,
      players: {
        include: { user: true }
      },
      _count: {
        select: { players: true }
      }
    }
  });

  if (!lobby) {
    notFound();
  }

  if (!lobby.isOpen && !lobby.inviteCode) {
    // Private lobby without invite code - only host and existing players can access
    const hasAccess = user && (
      lobby.hostUserId === user.id ||
      lobby.players.some(p => p.userId === user.id)
    );

    if (!hasAccess) {
      redirect('/lobby');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LobbyErrorBoundary>
        <LobbyRoom
          lobby={lobby}
          user={user}
          sessionId={sessionId}
        />
      </LobbyErrorBoundary>
    </div>
  );
}