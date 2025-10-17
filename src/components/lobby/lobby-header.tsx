"use client";

import { useScopedI18n } from '@/locales/client';
import { Badge } from '@/components/ui/badge';
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/kibo-ui/status';
import { GameSettingsDrawer } from './game-settings-drawer';
import { ShareDrawer } from '../shared/share-drawer';
import { ConnectionIndicator } from './connection-indicator';
import { ScoresDrawer } from './scores-drawer';
import { Users, Clock } from 'lucide-react';
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
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
        <div className="space-y-2 sm:space-y-3">
          {/* Row 1: Connection + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Status status={isConnected ? 'online' : 'offline'}>
                <StatusIndicator />
                <StatusLabel className="hidden sm:inline">
                  {isConnected ? t('room.connected') : t('room.disconnected')}
                </StatusLabel>
              </Status>
              <ConnectionIndicator />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
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
                buttonText={t('room.inviteButton')}
                buttonVariant="outline"
                buttonSize="sm"
              />
            </div>
          </div>

          {/* Row 2: Lobby Info */}
          <div className="text-center space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate px-2">
              {lobby.name}
            </h1>
            {lobby.description && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate px-2">
                {lobby.description}
              </p>
            )}
          </div>

          {/* Row 3: Game Stats */}
          <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{t('lobby.playersCount', { current: players.length, max: lobby.maxPlayers })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{t('lobby.roundTimer', { seconds: lobby.roundTimer })}</span>
            </div>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize">
              {t(`lobby.gameMode.${lobby.gameMode.toLowerCase()}` as any)}
            </Badge>
            {lobby.hintsEnabled && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {t('lobby.hintsEnabled')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
