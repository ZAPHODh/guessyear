"use client";

import { ReactNode } from 'react';
import { LobbyProvider, useLobby } from '@/contexts/lobby-context';
import { useLobbyProfile } from '@/hooks/use-lobby-profile';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { useOptimisticState } from '@/hooks/use-optimistic-state';
import { useScopedI18n } from '@/locales/client';
import { AnonymousProfileDialog } from './anonymous-profile-dialog';
import { getGameStateComponent, buildStateProps, type GameState } from '@/lib/lobby-state-machine';
import { validateGuess } from '@/lib/validations/guess';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Lobby, User } from '@/lib/types/lobby';

interface LobbyRoomProps {
  lobby: Lobby;
  user: User | null;
  sessionId?: string;
}

export function LobbyRoom({ lobby, user: initialUser, sessionId }: LobbyRoomProps) {
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

  const { players, error } = multiplayerState;

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

  // Render ProfileSetup or GameState
  const renderContent = () => {
    if (profile.showProfileDialog) {
      return (
        <>
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{useScopedI18n('lobby')('room.setProfile')}</h2>
              <p className="text-muted-foreground">
                {user ? useScopedI18n('lobby')('room.setProfileLoggedIn') : useScopedI18n('lobby')('room.setProfileAnonymous')}
              </p>
            </div>
          </div>

          <AnonymousProfileDialog
            open={profile.showProfileDialog}
            onSave={profile.handleSaveProfile}
            defaultName={username}
          />
        </>
      );
    }

    return <GameStateContent contextValue={contextValue} />;
  };

  return (
    <LobbyProvider value={contextValue}>
      <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl min-h-[calc(100dvh-4rem)] sm:min-h-0">
        {renderContent()}
      </div>
    </LobbyProvider>
  );
}

function GameStateContent({ contextValue }: { contextValue: any }) {
  const context = contextValue;
  const [guess, setGuess] = useState('');
  const t = useScopedI18n('lobby');

  const {
    lobby,
    players,
    currentPlayer,
    gameState,
    isHost,
    chatMessages,
    actions,
    leaderboard,
    currentRound,
    timeRemaining,
    hasSubmittedGuess,
    countdown,
    nextRoundCountdown,
    lastRoundResults,
    username,
    isConnected,
    profile
  } = context;

  const {
    value: optimisticReady,
    setOptimistic: setOptimisticReady,
    setServer: setServerReady
  } = useOptimisticState(currentPlayer?.isReady ?? false);

  useEffect(() => {
    if (currentRound && gameState === 'PLAYING' && !hasSubmittedGuess) {
      setGuess('');
    }
  }, [currentRound?.roundNumber, gameState, hasSubmittedGuess]);

  useEffect(() => {
    if (currentPlayer?.isReady !== undefined) {
      setServerReady(currentPlayer.isReady);
    }
  }, [currentPlayer?.isReady, setServerReady]);

  const handleReady = () => {
    if (currentPlayer) {
      const newReadyState = !optimisticReady;
      const updateId = `ready_${currentPlayer.id}_${Date.now()}`;
      setOptimisticReady(updateId, newReadyState);
      actions.toggleReady(newReadyState);
    }
  };

  const handleSubmitGuess = () => {
    const validation = validateGuess(guess);

    if (!validation.valid) {
      toast.error(t(`errors.${validation.error}` as any) || 'Invalid year');
      return;
    }

    actions.submitGuess(validation.year!);
    setGuess('');
  };


  if (profile.showProfileDialog) return null;

  const baseProps = {
    lobby,
    players,
    currentPlayer,
    gameState,
    isHost,
    chatMessages,
    onSendMessage: actions.sendMessage,
    username,
    isConnected,
    actions,
    leaderboard
  };

  const stateSpecificProps = {
    countdown,
    onReady: handleReady,
    optimisticReady,
    currentRound,
    timeRemaining,
    guess,
    onGuessChange: setGuess,
    onSubmitGuess: handleSubmitGuess,
    hasSubmittedGuess,
    lobbyTimer: lobby.roundTimer,
    lastRoundResults,
    onSendReaction: actions.sendReaction,
    nextRoundCountdown
  };

  const StateComponent = getGameStateComponent(gameState as GameState);
  const props = buildStateProps(gameState as GameState, baseProps, stateSpecificProps);

  return <StateComponent {...props as any} />;
}


