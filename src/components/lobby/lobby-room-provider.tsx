"use client";

import { LobbyProvider } from '@/contexts/lobby-context';
import { useLobbyProfile } from '@/hooks/use-lobby-profile';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Lobby, User } from '@/lib/types/lobby';

interface LobbyRoomProviderProps {
  lobby: Lobby;
  user: User | null;
  sessionId?: string;
  children: React.ReactNode;
}

export function LobbyRoomProvider({
  lobby,
  user: initialUser,
  sessionId,
  children
}: LobbyRoomProviderProps) {
  const router = useRouter();

  const profile = useLobbyProfile(initialUser);
  const { user, isProfileSet, username, avatar } = profile;

  const multiplayerState = useMultiplayerLobby({
    lobbyId: lobby.id,
    userId: user?.id ?? null,
    sessionId: sessionId ?? null,
    username,
    avatar,
    enabled: isProfileSet
  });

  const { error, players } = multiplayerState;

  const isHost = !!(user && lobby.hostUserId === user.id);
  const currentPlayer = players.find(p =>
    (user && p.userId === user.id) || (!user && p.sessionId === sessionId)
  );

  useEffect(() => {
    if (error) {
      toast.error(`Connection failed: ${error}`);
      router.push('/lobby');
    }
  }, [error, router]);

  const contextValue = {
    ...multiplayerState,
    lobby,
    user,
    sessionId: sessionId ?? null,
    isHost,
    currentPlayer,
    username,
    profile
  };

  return (
    <LobbyProvider value={contextValue}>
      {children}
    </LobbyProvider>
  );
}
