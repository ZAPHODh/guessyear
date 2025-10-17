"use client";

import { useLobby } from '@/contexts/lobby-context';
import { useOptimisticState } from '@/hooks/use-optimistic-state';
import { useScopedI18n } from '@/locales/client';
import { buildStateProps, getGameStateComponent } from '@/lib/lobby-state-machine';
import { validateGuess } from '@/lib/validations/guess';
import { toast } from 'sonner';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { AnonymousProfileDialog } from './anonymous-profile-dialog';

const MIN_HEIGHT_MOBILE = 'calc(100dvh-4rem)';
const MIN_HEIGHT_DESKTOP = '0';

export function LobbyStateRenderer() {
  const context = useLobby();
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

  if (profile.showProfileDialog) {
    return (
      <div
        className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl"
        style={{ minHeight: `min(${MIN_HEIGHT_MOBILE}, ${MIN_HEIGHT_DESKTOP})` }}
      >
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{t('room.setProfile')}</h2>
            <p className="text-muted-foreground">
              {context.user ? t('room.setProfileLoggedIn') : t('room.setProfileAnonymous')}
            </p>
          </div>
        </div>

        <AnonymousProfileDialog
          open={profile.showProfileDialog}
          onSave={profile.handleSaveProfile}
          defaultName={username}
        />
      </div>
    );
  }

  const StateComponent = getGameStateComponent(gameState);
  const props = buildStateProps(gameState, baseProps, stateSpecificProps);

  return (
    <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl">
      <StateComponent {...(props as any)} />
    </div>
  );
}
