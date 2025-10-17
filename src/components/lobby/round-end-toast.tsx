"use client";

import { Trophy, Target, TrendingUp } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import type { Guess } from '@/lib/types/lobby';

interface RoundEndToastProps {
  correctYear: number;
  yourGuess?: Guess;
  bestGuess: Guess;
  roundNumber: number;
}

export function RoundEndToast({
  correctYear,
  yourGuess,
  bestGuess,
  roundNumber
}: RoundEndToastProps) {
  const getEmoji = (accuracy?: number) => {
    if (!accuracy && accuracy !== 0) return '📊';
    if (accuracy === 0) return '🎯';
    if (accuracy <= 5) return '🎉';
    if (accuracy <= 10) return '👏';
    return '👍';
  };

  const isYourBest = yourGuess?.player === bestGuess.player;

  return (
    <div className="flex items-start gap-3 p-2">
      <div className="text-3xl mt-1">
        {getEmoji(yourGuess?.accuracy)}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <p className="font-bold text-sm">Round {roundNumber} Finished!</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Correct:</span>
          <span className="font-bold">{correctYear}</span>
        </div>

        {yourGuess && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">You:</span>
            <span className="font-medium">{yourGuess.year}</span>
            <span className="text-xs text-muted-foreground">
              ({yourGuess.accuracy} off)
            </span>
            <div className="flex items-center gap-1">
              <span className="text-primary font-bold">+</span>
              <NumberTicker
                value={yourGuess.points}
                className="text-primary font-bold text-sm"
              />
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
          </div>
        )}

        {!isYourBest && bestGuess && (
          <div className="text-xs text-muted-foreground pt-1 border-t">
            Best: <span className="font-medium">{bestGuess.player}</span> - {bestGuess.year}
          </div>
        )}
      </div>
    </div>
  );
}
