"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { useOptimisticState } from '@/hooks/use-optimistic-state';
import { useLobbyProfile } from '@/hooks/use-lobby-profile';
import { useScopedI18n } from '@/locales/client';
import { toast } from 'sonner';
import { validateGuess } from '@/lib/validations/guess';
import { getGameStateComponent, buildStateProps, type GameState } from '@/lib/lobby-state-machine';
import { AnonymousProfileDialog } from './anonymous-profile-dialog';
import type { Lobby, User } from '@/lib/types/lobby';

interface LobbyRoomProps {
  lobby: Lobby;
  user: User | null;
  sessionId?: string;
}

export function LobbyRoom({ lobby, user: initialUser, sessionId }: LobbyRoomProps) {
  const t = useScopedI18n('lobby');
  const [guess, setGuess] = useState('');
  const router = useRouter();

  const {
    user,
    showProfileDialog,
    isProfileSet,
    username,
    avatar,
    handleSaveProfile
  } = useLobbyProfile(initialUser);

  const {
    players,
    isConnected,
    gameState,
    currentRound,
    timeRemaining,
    chatMessages,
    leaderboard,
    lastRoundResults,
    hasSubmittedGuess,
    countdown,
    nextRoundCountdown,
    error,
    actions
  } = useMultiplayerLobby({
    lobbyId: lobby.id,
    userId: user?.id ?? null,
    sessionId: sessionId ?? null,
    username,
    avatar,
    enabled: isProfileSet
  });

  const isHost = !!(user && lobby.hostUserId === user.id);
  const currentPlayer = players.find(p =>
    (user && p.userId === user.id) || (!user && p.sessionId === sessionId)
  );

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


  useEffect(() => {
    if (error) {
      toast.error(`${t('errors.connectionFailed')}: ${error}`);
      router.push('/lobby');
    }
  }, [error, router, t]);

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

  // Base props shared by all states
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

  // State-specific props
  const stateSpecificProps = {
    // Waiting/Starting/Finished
    countdown,
    onReady: handleReady,
    optimisticReady,

    // Playing
    currentRound,
    timeRemaining,
    guess,
    onGuessChange: setGuess,
    onSubmitGuess: handleSubmitGuess,
    hasSubmittedGuess,
    lobbyTimer: lobby.roundTimer,

    // Round Results
    lastRoundResults,
    onSendReaction: actions.sendReaction,
    nextRoundCountdown
  };

  // Render using state machine
  const renderGameState = () => {
    const StateComponent = getGameStateComponent(gameState as GameState);
    const props = buildStateProps(gameState as GameState, baseProps, stateSpecificProps);

    return <StateComponent {...props as any} />;
  };

  return (
    <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl min-h-[calc(100dvh-4rem)] sm:min-h-0">
      {showProfileDialog && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{t('room.setProfile')}</h2>
            <p className="text-muted-foreground">
              {user ? t('room.setProfileLoggedIn') : t('room.setProfileAnonymous')}
            </p>
          </div>
        </div>
      )}

      {!showProfileDialog && renderGameState()}

      <AnonymousProfileDialog
        open={showProfileDialog}
        onSave={handleSaveProfile}
        defaultName={username}
      />
    </div>
  );
}
