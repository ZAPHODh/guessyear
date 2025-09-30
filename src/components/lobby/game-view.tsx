"use client";

import { useState, useEffect } from 'react';
import { useScopedI18n } from '@/locales/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { YearInput } from '@/components/ui/year-input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Send, Image as ImageIcon } from 'lucide-react';
import { ImageZoom } from '@/components/ui/kibo-ui/image-zoom';
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
  const t = useScopedI18n('lobby');
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{t('game.roundTitle', { number: round.roundNumber })}</h2>
        </div>
        <div className="flex items-center gap-4">
          {round.hintsEnabled && (
            <Badge variant="outline">{t('lobby.hintsEnabled')}</Badge>
          )}
          <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-500' : ''}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p>{t('game.imageLoadFailed')}</p>
              </div>
            </div>
          ) : (
            <ImageZoom className="w-full h-full">
              <img
                src={round.image.url}
                alt={round.image.description || `Round ${round.roundNumber} image`}
                className="w-full h-full object-cover cursor-zoom-in"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />
            </ImageZoom>
          )}
        </div>

        <div className="mt-3">
          <Progress
            value={progressPercentage}
            className={`h-2 ${isUrgent ? 'bg-red-100' : ''}`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">{t('game.prompt')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('game.promptDescription')}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          {!hasSubmittedGuess ? (
            <YearInput
              value={guess}
              onChange={onGuessChange}
              onSubmit={onSubmitGuess}
              onKeyPress={handleKeyPress}
              placeholder={t('game.yearPlaceholder')}
              disabled={hasSubmittedGuess || timeRemaining === 0}
              min={1800}
              max={new Date().getFullYear()}
              showSubmitButton={true}
              submitButtonText={t('game.submit')}
            />
          ) : (
            <div className="text-center py-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {t('game.submitted', { year: guess })}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {t('game.waitingForOthers')}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}