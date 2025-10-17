"use client";

import { useLobby } from '@/contexts/lobby-context';
import { LobbyHeader } from './lobby-header';

export function LobbyHeaderContainer() {
  const {
    lobby,
    players,
    currentPlayer,
    isHost,
    isConnected,
    actions,
    lastRoundResults,
    hasNewResults,
    clearNewResults,
    profile
  } = useLobby();

  if (profile.showProfileDialog) {
    return null;
  }

  return (
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
  );
}
