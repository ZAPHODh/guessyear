"use client";

import { useState, useEffect } from 'react';
import { useScopedI18n } from '@/locales/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Trophy, Target, Zap, Medal, Users, Clock } from 'lucide-react';


interface Guess {
  player: string;
  year: number;
  points: number;
  speedBonus: number;
  accuracy: number;
}

interface Player {
  id: string;
  username: string;
  score: number;
  streak: number;
  isEliminated?: boolean;
}

interface ResultsViewProps {
  results: {
    correctYear: number;
    guesses: Guess[];
  };
  leaderboard: Player[];
  onSendReaction: (emoji: string, targetType: string, targetId?: string) => void;
  nextRoundCountdown?: number;
}

const REACTION_EMOJIS = ['🎉', '😱', '🤯', '👏', '😂', '💪', '🔥', '⚡'];

export function ResultsView({ results, leaderboard, onSendReaction, nextRoundCountdown }: ResultsViewProps) {
  const t = useScopedI18n('lobby');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const sortedGuesses = results.guesses.sort((a, b) => a.accuracy - b.accuracy);
  const bestGuess = sortedGuesses[0];

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    onSendReaction(emoji, 'round_result');
    setTimeout(() => setSelectedReaction(null), 1000);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy === 0) return 'text-green-600';
    if (accuracy <= 5) return 'text-green-500';
    if (accuracy <= 10) return 'text-yellow-500';
    if (accuracy <= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy === 0) return t('results.perfect');
    if (accuracy === 1) return t('results.yearOff', { count: accuracy });
    return t('results.yearsOff', { count: accuracy });
  };

  const getAccuracyPercentage = (accuracy: number) => {
    // Convert accuracy (year difference) to a percentage where 0 = 100% and higher differences = lower percentages
    const maxDifference = 50; // Assume max reasonable difference is 50 years
    return Math.max(0, 100 - (accuracy / maxDifference) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Round Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t('results.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t('results.correctYear')}</p>
              <p className="text-5xl font-bold text-primary">{results.correctYear}</p>
            </div>

            {bestGuess && (
              <div className="p-4 border rounded-lg space-y-3 bg-muted/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl">🏆</div>
                  <p className="text-sm font-medium">{t('results.bestGuess')}</p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold">{bestGuess.player}</p>
                  <p className="text-sm mt-1">
                    {t('results.guessedYear', { year: bestGuess.year })}
                  </p>
                  <p className={`text-sm font-medium ${getAccuracyColor(bestGuess.accuracy)}`}>
                    {getAccuracyText(bestGuess.accuracy)}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Medal className="h-4 w-4" />
                    <span>{bestGuess.points} pts</span>
                  </div>
                  {bestGuess.speedBonus > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Zap className="h-4 w-4" />
                      <span>+{bestGuess.speedBonus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Round Countdown */}
            {nextRoundCountdown && nextRoundCountdown > 0 && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    <p className="text-sm font-medium">{t('results.nextRoundStarting')}</p>
                  </div>
                  <p className="text-3xl font-bold">{nextRoundCountdown}s</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Player Guesses Button */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Users className="h-4 w-4" />
            {t('results.viewPlayerGuesses', { count: results.guesses.length })}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">
              {t('results.playerGuessesTitle')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {sortedGuesses.map((guess, index) => (
                <Card key={`${guess.player}-${guess.year}`} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Position */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{guess.player}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{t('results.guessedLabel', { year: guess.year })}</span>
                          <span className="text-xs">•</span>
                          <span className={getAccuracyColor(guess.accuracy)}>
                            {getAccuracyText(guess.accuracy)}
                          </span>
                        </div>

                        {/* Accuracy progress */}
                        <div className="mt-2">
                          <Progress
                            value={getAccuracyPercentage(guess.accuracy)}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Points and badges */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Badges */}
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {guess.speedBonus > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-2 w-2 mr-1" />
                            {t('results.badges.fast')}
                          </Badge>
                        )}
                        {guess.accuracy <= 5 && (
                          <Badge variant="outline" className="text-xs">
                            <Target className="h-2 w-2 mr-1" />
                            {t('results.badges.accurate')}
                          </Badge>
                        )}
                        {guess.accuracy === 0 && (
                          <Badge variant="default" className="text-xs">
                            <Medal className="h-2 w-2 mr-1" />
                            {t('results.badges.perfect')}
                          </Badge>
                        )}
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Medal className="h-4 w-4" />
                          <span className="font-bold text-sm">{guess.points} pts</span>
                        </div>
                        {guess.speedBonus > 0 && (
                          <div className="flex items-center gap-1 text-blue-600 mt-1">
                            <Zap className="h-3 w-3" />
                            <span className="text-xs font-medium">+{guess.speedBonus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  );
}