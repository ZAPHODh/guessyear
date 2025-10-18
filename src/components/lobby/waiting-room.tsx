"use client";

import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayerSpots } from './player-spots';
import { Users, Clock } from 'lucide-react';
import type { Lobby, LobbyActions, Player } from '@/lib/types/lobby';
import type { GameState } from '@/lib/lobby-state-machine';

interface WaitingRoomProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer: Player | undefined;
  gameState: GameState;
  countdown: number | null;
  isHost: boolean;
  onReady: () => void;
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
  actions,
  optimisticReady,
  gameFinished = false,
  leaderboard = []
}: WaitingRoomProps) {
  const t = useScopedI18n('lobby');

  return (
    <div className="sm:space-y-4 lg:space-y-6">
      <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4">
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

    </div>
  );
}
