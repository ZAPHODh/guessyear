"use client";

import { LobbyProvider } from '@/contexts/lobby-context';
import type { LobbyContextValue } from '@/contexts/lobby-context';
import { useLobbyProfile } from '@/hooks/use-lobby-profile';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { useOptimisticState } from '@/hooks/use-optimistic-state';
import { useScopedI18n } from '@/locales/client';
import { AnonymousProfileDialog } from './anonymous-profile-dialog';
import { LobbyHeader } from './lobby-header';
import { CountdownBadge } from './countdown-badge';
import { buildStateProps, getGameStateComponent, type GameState } from '@/lib/lobby-state-machine';
import { validateGuess } from '@/lib/validations/guess';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Lobby, User } from '@/lib/types/lobby';

const MIN_HEIGHT_MOBILE = 'calc(100dvh-4rem)';
const MIN_HEIGHT_DESKTOP = '0';

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

  const {
    players,
    error,
    hasNewResults,
    clearNewResults,
    nextRoundCountdown,
    lastRoundResults,
    gameState,
    isConnected,
    actions,
    leaderboard
  } = multiplayerState;

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

  const t = useScopedI18n('lobby');

  return (
    <LobbyProvider value={contextValue}>
      <div className="min-h-screen flex flex-col">
        {!profile.showProfileDialog && (
          <LobbyHeader
            lobby={lobby}
            players={players}
            currentPlayer={currentPlayer}
            isHost={isHost}
            isConnected={isConnected}
            actions={actions}
            lastRoundResults={lastRoundResults}
            hasNewResults={hasNewResults}
            onClearNewResults={clearNewResults}
          />
        )}

        <div
          className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl flex-1"
          style={{ minHeight: profile.showProfileDialog ? `min(${MIN_HEIGHT_MOBILE}, ${MIN_HEIGHT_DESKTOP})` : undefined }}
        >
          {profile.showProfileDialog ? (
            <>
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">{t('room.setProfile')}</h2>
                  <p className="text-muted-foreground">
                    {user ? t('room.setProfileLoggedIn') : t('room.setProfileAnonymous')}
                  </p>
                </div>
              </div>

              <AnonymousProfileDialog
                open={profile.showProfileDialog}
                onSave={profile.handleSaveProfile}
                defaultName={username}
              />
            </>
          ) : (
            <GameStateContent contextValue={contextValue} />
          )}
        </div>

        {!profile.showProfileDialog &&
          nextRoundCountdown &&
          nextRoundCountdown > 0 &&
          gameState === 'PLAYING' && (
            <CountdownBadge countdown={nextRoundCountdown} />
          )}
      </div>
    </LobbyProvider>
  );
}

interface GameStateContentProps {
  contextValue: LobbyContextValue;
}

function GameStateContent({ contextValue }: GameStateContentProps) {
  const t = useScopedI18n('lobby');

  if (contextValue.profile.showProfileDialog) {
    return null;
  }

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
    isConnected
  } = contextValue;

  const [guess, setGuess] = useState('');

  const {
    value: optimisticReady,
    setOptimistic: setOptimisticReady,
    setServer: setServerReady
  } = useOptimisticState(currentPlayer?.isReady ?? false);

  useEffect(() => {
    if (currentRound && gameState === 'PLAYING' && !hasSubmittedGuess) {
      setGuess('');
    }
  }, [currentRound, gameState, hasSubmittedGuess]);

  useEffect(() => {
    if (currentPlayer?.isReady !== undefined) {
      setServerReady(currentPlayer.isReady);
    }
  }, [currentPlayer?.isReady, setServerReady]);

  const handleReady = useCallback(() => {
    if (currentPlayer) {
      const newReadyState = !optimisticReady;
      const updateId = `ready_${currentPlayer.id}_${Date.now()}`;
      setOptimisticReady(updateId, newReadyState);
      actions.toggleReady(newReadyState);
    }
  }, [currentPlayer, optimisticReady, setOptimisticReady, actions]);

  const handleSubmitGuess = useCallback(() => {
    const validation = validateGuess(guess);

    if (!validation.valid) {
      toast.error(t(`errors.${validation.error}` as any) || 'Invalid year');
      return;
    }

    actions.submitGuess(validation.year!);
    setGuess('');
  }, [guess, actions, t]);

  const baseProps = useMemo(() => ({
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
  }), [
    lobby,
    players,
    currentPlayer,
    gameState,
    isHost,
    chatMessages,
    actions,
    username,
    isConnected,
    leaderboard
  ]);

  const stateSpecificProps = useMemo(() => ({
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
  }), [
    countdown,
    handleReady,
    optimisticReady,
    currentRound,
    timeRemaining,
    guess,
    handleSubmitGuess,
    hasSubmittedGuess,
    lobby.roundTimer,
    lastRoundResults,
    actions.sendReaction,
    nextRoundCountdown
  ]);

  const StateComponent = getGameStateComponent(gameState);
  const props = buildStateProps(gameState, baseProps, stateSpecificProps);

  return <StateComponent {...(props as any)} />;
}


