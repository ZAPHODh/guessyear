"use client";

import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { Player } from '@/lib/types/lobby';

interface PlayerSpotsProps {
  players: Player[];
  maxPlayers: number;
  currentPlayer?: Player;
  onToggleReady?: () => void;
  gameState?: string;
  showScores?: boolean;
  isHost?: boolean;
  onKickPlayer?: (playerId: string) => void;
  onTransferHost?: (playerId: string) => void;
  optimisticReady?: boolean;
}

export function PlayerSpots({
  players,
  maxPlayers,
  currentPlayer,
  onToggleReady,
  gameState,
  showScores = false,
  isHost = false,
  onKickPlayer,
  onTransferHost,
  optimisticReady
}: PlayerSpotsProps) {
  const t = useScopedI18n('lobby');

  const spots = Array.from({ length: maxPlayers }, (_, index) => {
    const player = players[index];
    return {
      index,
      player,
      isEmpty: !player,
      isOwner: index === 0 && player
    };
  });

  const getStatusMessage = () => {
    if (gameState === 'STARTING') return null;
    if (players.length < 2) return t('players.waitingForMorePlayers');
    if (!players.every(p => p.isReady)) return t('players.waitingForAllReady');
    return t('players.allPlayersReady');
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">{t('players.title')}</h3>
        <div className="flex items-center gap-2 sm:gap-3">
          {statusMessage && (
            <Badge variant={statusMessage.includes(t('players.allPlayersReady')) ? "default" : "secondary"} className="text-xs">
              {statusMessage}
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm">
            {players.length}/{maxPlayers}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {spots.map(({ index, player, isEmpty, isOwner }) => (
          <Card
            key={index}
            className={`aspect-square p-0 transition-all duration-300 ${isEmpty
              ? 'border-dashed border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50'
              : `${player?.id === currentPlayer?.id
                ? 'border-primary bg-primary/5'
                : ''
              }`
              } ${player?.isEliminated ? 'opacity-50' : ''}`}
          >
            <CardContent className="p-2 sm:p-3 h-full w-full flex flex-col overflow-hidden">
              {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">{t('players.empty')}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1 sm:mb-2 min-h-5 sm:min-h-6">
                    <div>
                      {isHost && onTransferHost && player.id !== currentPlayer?.id && gameState === 'WAITING' && (
                        <Button
                          onClick={() => onTransferHost(player.id)}
                          variant="outline"
                          size="sm"
                          className="h-5 sm:h-6 px-1 sm:px-2 text-xs"
                        >
                          {t('players.makeHost')}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-start gap-1">
                      <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                        {index === 0 && (
                          <Badge variant="default" className="text-xs h-4 sm:h-5 px-1">
                            {t('players.owner')}
                          </Badge>
                        )}
                        {player.id === currentPlayer?.id && (
                          <Badge variant="outline" className="text-xs h-4 sm:h-5 px-1">
                            {t('players.you')}
                          </Badge>
                        )}
                      </div>
                      {isHost && onKickPlayer && player.id !== currentPlayer?.id && gameState === 'WAITING' && (
                        <Button
                          onClick={() => onKickPlayer(player.id)}
                          variant="outline"
                          size="sm"
                          className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center space-y-1 sm:space-y-2 min-h-0">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    </Avatar>

                    <div className="text-center min-w-0 w-full">
                      <p className="font-medium text-xs sm:text-sm truncate px-1">
                        {player.username}
                      </p>

                      {showScores ? (
                        <p className="text-xs text-muted-foreground">
                          {t('players.points', { points: player.score })}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {player.isReady ? t('players.ready') : t('players.waiting')}
                        </p>
                      )}
                    </div>
                  </div>

                  {player.id === currentPlayer?.id && onToggleReady && gameState === 'WAITING' && (
                    <Button
                      onClick={onToggleReady}
                      variant={optimisticReady !== undefined ? (optimisticReady ? 'default' : "outline") : (player.isReady ? 'default' : "outline")}
                      size="sm"
                      className="w-full text-xs h-6 sm:h-8 flex-shrink-0 mt-auto"
                    >
                      {optimisticReady !== undefined ? (optimisticReady ? t('players.ready') : t('players.readyQuestion')) : (player.isReady ? t('players.ready') : t('players.readyQuestion'))}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}