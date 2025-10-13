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

// ============================================
// Main LobbyRoom Compound Component
// ============================================

interface LobbyRoomProps {
  lobby: Lobby;
  user: User | null;
  sessionId?: string;
  children: ReactNode;
}

function LobbyRoomRoot({ lobby, user: initialUser, sessionId, children }: LobbyRoomProps) {
  const router = useRouter();

  // Profile management
  const profile = useLobbyProfile(initialUser);
  const { user, isProfileSet, username, avatar } = profile;

  // Multiplayer lobby state
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

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Connection failed: ${error}`);
      router.push('/lobby');
    }
  }, [error, router]);

  // Context value
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
      <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-6 max-w-7xl min-h-[calc(100dvh-4rem)] sm:min-h-0">
        {children}
      </div>
    </LobbyProvider>
  );
}

// ============================================
// ProfileSetup Sub-component
// ============================================

function ProfileSetup() {
  const { profile, user } = useLobby();
  const t = useScopedI18n('lobby');
  const { showProfileDialog, username, handleSaveProfile } = profile;

  if (!showProfileDialog) return null;

  return (
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
        open={showProfileDialog}
        onSave={handleSaveProfile}
        defaultName={username}
      />
    </>
  );
}

// ============================================
// GameState Sub-component
// ============================================

function GameState() {
  const context = useLobby();
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

  // Optimistic ready state
  const {
    value: optimisticReady,
    setOptimistic: setOptimisticReady,
    setServer: setServerReady
  } = useOptimisticState(currentPlayer?.isReady ?? false);

  // Clear guess when round changes
  useEffect(() => {
    if (currentRound && gameState === 'PLAYING' && !hasSubmittedGuess) {
      setGuess('');
    }
  }, [currentRound?.roundNumber, gameState, hasSubmittedGuess]);

  // Update optimistic state
  useEffect(() => {
    if (currentPlayer?.isReady !== undefined) {
      setServerReady(currentPlayer.isReady);
    }
  }, [currentPlayer?.isReady, setServerReady]);

  // Handlers
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

  // Don't render if profile is not set
  if (profile.showProfileDialog) return null;

  // Base props
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

  // Render using state machine
  const StateComponent = getGameStateComponent(gameState as GameState);
  const props = buildStateProps(gameState as GameState, baseProps, stateSpecificProps);

  return <StateComponent {...props as any} />;
}

// ============================================
// Exports - Compound Component API
// ============================================

export const LobbyRoom = Object.assign(LobbyRoomRoot, {
  ProfileSetup,
  GameState
});

// Usage:
// <LobbyRoom lobby={lobby} user={user} sessionId={sessionId}>
//   <LobbyRoom.ProfileSetup />
//   <LobbyRoom.GameState />
// </LobbyRoom>
