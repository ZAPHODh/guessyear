"use client";

import { useScopedI18n } from '@/locales/client';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import { GameSettingsDrawer } from './game-settings-drawer';
import { ShareDrawer } from '../shared/share-drawer';
import { ConnectionIndicator } from './connection-indicator';
import { ScoresDrawer } from './scores-drawer';
import type { Lobby, LobbyActions, Player } from '@/lib/types/lobby';
import type { Guess } from '@/lib/types/lobby';

interface LobbyHeaderProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer?: Player;
  isHost: boolean;
  isConnected: boolean;
  actions: LobbyActions;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  hasNewResults?: boolean;
  onClearNewResults?: () => void;
}

export function LobbyHeader({
  lobby,
  players,
  currentPlayer,
  isHost,
  isConnected,
  actions,
  lastRoundResults,
  hasNewResults,
  onClearNewResults
}: LobbyHeaderProps) {
  const t = useScopedI18n('lobby');
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <ConnectionIndicator isConnected={isConnected} showLabel />
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1.5">
              <ScoresDrawer
                players={players}
                currentPlayer={currentPlayer}
                lastRoundResults={lastRoundResults}
                hasNewResults={hasNewResults}
                onClearNewResults={onClearNewResults}
              />
              {isHost && (
                <GameSettingsDrawer
                  lobby={lobby}
                  onUpdateSettings={actions.updateLobbySettings}
                />
              )}
              <ShareDrawer
                title={t('room.invite.title')}
                description={t('room.invite.description')}
                shareText={t('room.invite.shareText', { lobbyName: lobby.name })}
                url={inviteUrl}
                buttonText=""
                buttonVariant="outline"
                buttonSize="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
