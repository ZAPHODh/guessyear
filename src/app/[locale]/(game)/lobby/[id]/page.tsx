import { redirect, notFound } from 'next/navigation';
import { LobbyRoomProvider } from '@/components/lobby/lobby-room-provider';
import { LobbyHeaderContainer } from '@/components/lobby/lobby-header-container';
import { LobbyStateRenderer } from '@/components/lobby/lobby-state-renderer';
import { LobbyChatContainer } from '@/components/lobby/lobby-chat-container';
import { CountdownBadgeContainer } from '@/components/lobby/countdown-badge-container';
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
        <LobbyRoomProvider lobby={lobby} user={user} sessionId={sessionId}>
          <div className="flex flex-col min-h-screen">
            <LobbyHeaderContainer />
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 p-4">
              <LobbyStateRenderer />
              <LobbyChatContainer />
            </div>
            <CountdownBadgeContainer />
          </div>
        </LobbyRoomProvider>
      </LobbyErrorBoundary>
    </div>
  );
}