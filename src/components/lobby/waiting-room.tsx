"use client";

import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/kibo-ui/status';
import { GameSettingsDrawer } from './game-settings-drawer';
import { LobbyChat } from './lobby-chat';
import { PlayerSpots } from './player-spots';
import { ShareDrawer } from '../shared/share-drawer';
import { ConnectionIndicator } from './connection-indicator';
import { Users, Clock } from 'lucide-react';
import type { Lobby, LobbyActions, Player, ChatMessage } from '@/lib/types/lobby';

interface WaitingRoomProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer: Player | undefined;
  gameState: string;
  countdown: number | null;
  isHost: boolean;
  onReady: () => void;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  isConnected: boolean;
  actions: LobbyActions;
  optimisticReady: boolean;
  gameFinished?: boolean;
  leaderboard?: Player[];
}

export function WaitingRoom({
  lobby,
  players,
  currentPlayer,
  gameState,
  countdown,
  isHost,
  onReady,
  chatMessages,
  onSendMessage,
  username,
  isConnected,
  actions,
  optimisticReady,
  gameFinished = false,
  leaderboard = []
}: WaitingRoomProps) {
  const t = useScopedI18n('lobby');
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Status status={isConnected ? 'online' : 'offline'}>
              <StatusIndicator />
              <StatusLabel>
                {isConnected ? t('room.connected') : t('room.disconnected')}
              </StatusLabel>
            </Status>
            <ConnectionIndicator />
          </div>
          <div className="flex items-center gap-2">
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

        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{lobby.name}</h1>
          {lobby.description && (
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{lobby.description}</p>
          )}
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{t('lobby.playersCount', { current: players.length, max: lobby.maxPlayers })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{t('lobby.roundTimer', { seconds: lobby.roundTimer })}</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {t(`lobby.gameMode.${lobby.gameMode.toLowerCase()}` as any)}
          </Badge>
          {lobby.hintsEnabled && (
            <Badge variant="outline">{t('lobby.hintsEnabled')}</Badge>
          )}
        </div>
      </div>

      {gameFinished && isHost && (
        <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
          <Button
            onClick={actions.restartGame}
            size="lg"
            className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg"
          >
            🎮 {t('room.playAgain')}
          </Button>
        </div>
      )}

      <PlayerSpots
        players={players}
        maxPlayers={lobby.maxPlayers}
        currentPlayer={currentPlayer}
        onToggleReady={onReady}
        gameState={gameState}
        isHost={isHost}
        onKickPlayer={actions.kickPlayer}
        onTransferHost={actions.transferHost}
        optimisticReady={optimisticReady}
      />

      {gameState === 'STARTING' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-white">{t('room.gameStarting')}</h3>
            <div className="text-8xl font-bold text-white mb-4">
              {countdown || 0}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
          players={leaderboard.length > 0 ? leaderboard : players}
          currentPlayer={currentPlayer}
          showPlayerScores={leaderboard.length > 0}
        />
      </div>
    </div>
  );
}
