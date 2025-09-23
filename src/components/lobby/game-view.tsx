"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Send, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface RoundData {
  roundNumber: number;
  image: {
    url: string;
    description?: string;
  };
  timer: number;
  hintsEnabled: boolean;
}

interface GameViewProps {
  round: RoundData;
  timeRemaining: number;
  guess: string;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
}

export function GameView({
  round,
  timeRemaining,
  guess,
  onGuessChange,
  onSubmitGuess,
  hasSubmittedGuess,
  lobbyTimer
}: GameViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const progressPercentage = (timeRemaining / lobbyTimer) * 100;
  const isUrgent = timeRemaining <= 10;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [round.image.url]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasSubmittedGuess) {
      onSubmitGuess();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Round Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Round {round.roundNumber}</h2>
        </div>
        <div className="flex items-center gap-4">
          {round.hintsEnabled && (
            <Badge variant="outline">Hints enabled</Badge>
          )}
          <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-500' : ''}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}