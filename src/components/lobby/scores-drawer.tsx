"use client";

import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, Medal, Zap, Target, Users } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { useScopedI18n } from '@/locales/client';
import { cn } from '@/lib/utils';
import type { Player, Guess } from '@/lib/types/lobby';

interface ScoresDrawerProps {
  players: Player[];
  currentPlayer?: Player;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  hasNewResults?: boolean;
  onClearNewResults?: () => void;
}

export function ScoresDrawer({
  players,
  currentPlayer,
  lastRoundResults,
  hasNewResults = false,
  onClearNewResults
}: ScoresDrawerProps) {
  const t = useScopedI18n('lobby');
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && hasNewResults) {
      onClearNewResults?.();
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const top3 = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="hidden sm:inline">Scores</span>
          <Badge variant="secondary" className="text-xs px-1.5">
            {players.length}
          </Badge>
          {hasNewResults && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="text-center">
            <DrawerTitle className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {t('players.leaderboard')}
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-8 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  Top Players
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {top3.map((player, index) => (
                    <Card
                      key={player.id}
                      className={cn(
                        "relative overflow-hidden",
                        index === 0 && "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
                        index === 1 && "border-gray-400",
                        index === 2 && "border-orange-700",
                        player.id === currentPlayer?.id && "ring-2 ring-primary"
                      )}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="text-3xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <p className="font-bold truncate">
                            {player.username}
                            {player.id === currentPlayer?.id && ' (você)'}
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <NumberTicker
                              value={player.score}
                              className={cn(
                                "text-2xl font-bold",
                                index === 0 && "text-yellow-600 dark:text-yellow-500"
                              )}
                            />
                            <span className="text-sm text-muted-foreground">pts</span>
                          </div>
                        </div>
                        {player.streak > 1 && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {player.streak}x streak
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of Players */}
            {rest.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All Players
                </h3>
                <div className="space-y-2">
                  {rest.map((player, index) => {
                    const rank = index + 4;
                    return (
                      <Card
                        key={player.id}
                        className={cn(
                          "transition-colors",
                          player.id === currentPlayer?.id && "border-primary bg-primary/5"
                        )}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                              #{rank}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">
                                {player.username}
                                {player.id === currentPlayer?.id && ' (você)'}
                              </p>
                              {player.streak > 1 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Zap className="h-3 w-3 text-yellow-500" />
                                  {player.streak}x streak
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <NumberTicker
                              value={player.score}
                              className="text-lg font-bold text-primary"
                            />
                            <span className="text-xs text-muted-foreground">pts</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Last Round Results */}
            {lastRoundResults && lastRoundResults.guesses.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="last-round" className="border rounded-lg px-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Last Round Results</span>
                      <Badge variant="secondary" className="text-xs">
                        {lastRoundResults.guesses.length} guesses
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Correct Year</p>
                      <p className="text-3xl font-bold text-primary">{lastRoundResults.correctYear}</p>
                    </div>
                    <div className="space-y-2">
                      {lastRoundResults.guesses
                        .sort((a, b) => a.accuracy - b.accuracy)
                        .map((guess, index) => (
                          <Card key={`${guess.player}-${index}`}>
                            <CardContent className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </span>
                                <div>
                                  <p className="font-medium">{guess.player}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Guessed: {guess.year} ({guess.accuracy} off)
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <span className="text-primary font-bold">+{guess.points}</span>
                                  <span className="text-xs text-muted-foreground">pts</span>
                                </div>
                                {guess.speedBonus > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <Zap className="h-3 w-3" />
                                    +{guess.speedBonus}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
