"use client";

import { useScopedI18n } from '@/locales/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Check, Clock, Zap, X } from 'lucide-react';

interface Player {
  id: string;
  username: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  isEliminated: boolean;
  streak: number;
  userId?: string;
  sessionId?: string;
}

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
    <div className="space-y-3">
      {title && (
        <h3 className="text-lg font-semibold">
          {title} ({players.length})
        </h3>
      )}

      <div className={`space-y-${compact ? '2' : '3'}`}>
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-${compact ? '2' : '3'} rounded-lg border ${
              player.id === currentPlayer?.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background'
            } ${player.isEliminated ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {/* Position number for leaderboard */}
              {showScores && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                  {index + 1}
                </div>
              )}

              <div className="relative">
                <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
                  <AvatarFallback className="text-lg">
                    {player.avatar || player.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Ready indicator */}
                {player.isReady && !showScores && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Elimination indicator */}
                {player.isEliminated && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                    <span className="text-white text-xs">X</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>
                    {player.username}
                  </p>

                  {player.id === currentPlayer?.id && (
                    <Badge variant="outline" className="text-xs">{t('players.you')}</Badge>
                  )}

                  {/* Host indicator */}
                  {index === 0 && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-2 mt-1">
                  {showScores ? (
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${compact ? 'text-sm' : ''}`}>
                        {player.score} {t('players.points', { points: '' }).replace(' ', '')}
                      </span>

                      {player.streak > 1 && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-yellow-600">
                            {player.streak}x
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {player.isReady ? (
                        <Badge variant="secondary" className="text-xs">
                          {t('players.ready')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {t('players.waiting')}
                        </Badge>
                      )}

                      {player.isEliminated && (
                        <Badge variant="destructive" className="text-xs">
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