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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-3 flex-1 min-w-0">
            <ConnectionIndicator isConnected={isConnected} showLabel />

            <div className="flex flex-col items-center flex-1 min-w-0 sm:hidden">
              <h1 className="text-base font-bold truncate max-w-full">
                {lobby.name}
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{players.length}/{lobby.maxPlayers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{lobby.roundTimer}s</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">
                {lobby.name}
              </h1>
              {lobby.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {lobby.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{players.length}/{lobby.maxPlayers}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{lobby.roundTimer}s</span>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 capitalize">
                {t(`lobby.gameMode.${lobby.gameMode.toLowerCase()}` as any)}
              </Badge>
              {lobby.hintsEnabled && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {t('lobby.hintsEnabled')}
                </Badge>
              )}
            </div>

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
