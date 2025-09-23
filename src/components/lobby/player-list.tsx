"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Check, Clock, Zap } from 'lucide-react';

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
}

export function PlayerList({ players, currentPlayer, compact = false, showScores = false, onToggleReady, gameState }: PlayerListProps) {
  return (
    <Card>
      <CardHeader className={compact ? "pb-3" : ""}>
        <CardTitle className={compact ? "text-lg" : ""}>
          Players ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "pt-0" : ""}>
        <div className={`space-y-${compact ? '2' : '3'}`}>
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-${compact ? '2' : '3'} rounded-lg ${player.id === currentPlayer?.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/50'
                } ${player.isEliminated ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
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
                      <Badge variant="outline" className="text-xs">You</Badge>
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
                          {player.score} pts
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
                            Ready
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Waiting
                          </Badge>
                        )}

                        {player.isEliminated && (
                          <Badge variant="destructive" className="text-xs">
                            Eliminated
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ready button for current player or Position indicator for leaderboard */}
              {showScores ? (
                <div className="text-right">
                  <div className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
                    #{index + 1}
                  </div>
                </div>
              ) : (
                player.id === currentPlayer?.id && onToggleReady && gameState === 'WAITING' && (
                  <Button
                    onClick={onToggleReady}
                    variant={player.isReady ? "default" : "outline"}
                    size="sm"
                    className="ml-2"
                  >
                    {player.isReady ? 'Ready' : 'Ready?'}
                  </Button>
                )
              )}
            </div>
          ))}

          {players.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No players in lobby
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}