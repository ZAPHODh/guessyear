"use client";

import { useState, useEffect } from 'react';
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
    if (accuracy === 0) return 'Perfect! 🎯';
    if (accuracy === 1) return `${accuracy} year off`;
    return `${accuracy} years off`;
  };

  return (
    <div className="space-y-6">
      {/* Round Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Round Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Correct Year</p>
              <p className="text-4xl font-bold text-primary">{results.correctYear}</p>
            </div>

            {bestGuess && (
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">🏆 Best Guess</p>
                <p className="font-semibold">{bestGuess.player}</p>
                <p className="text-sm">
                  Guessed {bestGuess.year} - {getAccuracyText(bestGuess.accuracy)}
                </p>
              </div>
            )}

            {/* Next Round Countdown */}
            {nextRoundCountdown && nextRoundCountdown > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <p className="text-sm font-medium">Next Round Starting</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{nextRoundCountdown}s</p>
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
            View Player Guesses ({results.guesses.length})
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Player Guesses - Round Results</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {sortedGuesses.map((guess, index) => (
                <div
                  key={`${guess.player}-${guess.year}`}
                  className={`p-4 rounded-lg border ${
                    index === 0 ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' :
                    index === 1 ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800' :
                    index === 2 ? 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' :
                    'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <p className="font-medium">{guess.player}</p>
                        <p className="text-sm text-muted-foreground">
                          Guessed: {guess.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{guess.points} pts</p>
                      {guess.speedBonus > 0 && (
                        <p className="text-sm text-blue-600">
                          +{guess.speedBonus} speed bonus
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={getAccuracyColor(guess.accuracy)}>
                        {getAccuracyText(guess.accuracy)}
                      </span>

                      <div className="flex items-center gap-2">
                        {guess.speedBonus > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Fast
                          </Badge>
                        )}
                        {guess.accuracy <= 5 && (
                          <Badge variant="outline" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            Accurate
                          </Badge>
                        )}
                        {guess.accuracy === 0 && (
                          <Badge variant="default" className="text-xs">
                            <Medal className="h-3 w-3 mr-1" />
                            Perfect
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Accuracy visualization */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          guess.accuracy === 0 ? 'bg-green-500' :
                          guess.accuracy <= 5 ? 'bg-green-400' :
                          guess.accuracy <= 10 ? 'bg-yellow-400' :
                          guess.accuracy <= 25 ? 'bg-orange-400' :
                          'bg-red-400'
                        }`}
                        style={{
                          width: `${Math.max(10, 100 - (guess.accuracy * 2))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  );
}