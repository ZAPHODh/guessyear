"use client";

import { useScopedI18n } from '@/locales/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Check, Clock, Zap, X } from 'lucide-react';
import type { Player } from '@/lib/types/lobby';

interface PlayerListProps {
  players: Player[];
  currentPlayer?: Player;
  compact?: boolean;
  showScores?: boolean;
  onToggleReady?: () => void;
  gameState?: string;
  isHost?: boolean;
  onKickPlayer?: (playerId: string) => void;
  onTransferHost?: (playerId: string) => void;
  title?: string;
}

export function PlayerList({
  players,
  currentPlayer,
  compact = false,
  showScores = false,
  onToggleReady,
  gameState,
  isHost = false,
  onKickPlayer,
  onTransferHost,
  title
}: PlayerListProps) {
  const t = useScopedI18n('lobby');

  return (
    <div className="space-y-2 lg:space-y-3">
      {title && (
        <h3 className={`${compact ? 'text-sm' : 'text-base lg:text-lg'} font-semibold text-foreground/90`}>
          {title} ({players.length})
        </h3>
      )}

      <div className={`space-y-${compact ? '1.5' : '2 lg:space-y-3'}`}>
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-${compact ? '2' : '2.5 lg:p-3'} rounded-lg border transition-colors ${player.id === currentPlayer?.id
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background hover:bg-muted/50'
              } ${player.isEliminated ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
              {showScores && (
                <div className={`flex items-center justify-center ${compact ? 'w-7 h-7' : 'w-8 h-8'} rounded-full bg-muted font-bold ${compact ? 'text-xs' : 'text-sm'} flex-shrink-0`}>
                  {index + 1}
                </div>
              )}

              <div className="relative flex-shrink-0">
                <Avatar className={compact ? "h-7 w-7 lg:h-8 lg:w-8" : "h-9 w-9 lg:h-10 lg:w-10"}>
                  <AvatarFallback className={compact ? "text-sm" : "text-base lg:text-lg"}>
                    {player.avatar || player.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {player.isReady && !showScores && (
                  <div className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
                    <Check className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-white" />
                  </div>
                )}

                {player.isEliminated && (
                  <div className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full p-0.5">
                    <span className="text-white text-xs">X</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <p className={`font-medium truncate ${compact ? 'text-xs lg:text-sm' : 'text-sm'}`}>
                    {player.username}
                  </p>

                  {player.id === currentPlayer?.id && (
                    <Badge variant="outline" className="text-xs px-1 py-0">{t('players.you')}</Badge>
                  )}

                  {index === 0 && (
                    <Crown className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5 lg:mt-1">
                  {showScores ? (
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className={`font-bold ${compact ? 'text-xs lg:text-sm' : 'text-sm'}`}>
                        {player.score} {t('players.points', { points: '' }).replace(' ', '')}
                      </span>

                      {player.streak > 1 && (
                        <div className="flex items-center gap-0.5 lg:gap-1">
                          <Zap className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">
                            {player.streak}x
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      {player.isReady ? (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {t('players.ready')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          <Clock className="h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1" />
                          {t('players.waiting')}
                        </Badge>
                      )}

                      {player.isEliminated && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          {t('players.eliminated')}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Make Host button - only show during WAITING */}
              {isHost && onTransferHost && player.id !== currentPlayer?.id && gameState === 'WAITING' && (
                <Button
                  onClick={() => onTransferHost(player.id)}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  {t('players.makeHost')}
                </Button>
              )}

              {/* Kick button - only show during WAITING */}
              {isHost && onKickPlayer && player.id !== currentPlayer?.id && gameState === 'WAITING' && (
                <Button
                  onClick={() => onKickPlayer(player.id)}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* Ready button for current player or Position indicator for leaderboard */}
              {!showScores && player.id === currentPlayer?.id && onToggleReady && gameState === 'WAITING' && (
                <Button
                  onClick={onToggleReady}
                  variant={player.isReady ? "default" : "outline"}
                  size="sm"
                  className="ml-2"
                >
                  {player.isReady ? t('players.ready') : t('players.readyQuestion')}
                </Button>
              )}
            </div>
          </div>
        ))}

        {players.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            {t('players.empty')}
          </div>
        )}
      </div>
    </div>
  );
}