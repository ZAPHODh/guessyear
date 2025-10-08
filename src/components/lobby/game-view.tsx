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
import type { RoundData, Player } from '@/lib/types/lobby';

interface GameViewProps {
  round: RoundData;
  timeRemaining: number;
  guess: string;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
  players?: Player[];
  currentPlayer?: Player;
}

export function GameView({
  round,
  timeRemaining,
  guess,
  onGuessChange,
  onSubmitGuess,
  hasSubmittedGuess,
  lobbyTimer,
  players = [],
  currentPlayer
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Round Title */}
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 lg:h-5 lg:w-5" />
        <h2 className="text-lg lg:text-xl font-semibold">{t('game.roundTitle', { number: round.roundNumber })}</h2>
        {round.hintsEnabled && (
          <Badge variant="outline" className="ml-auto">{t('lobby.hintsEnabled')}</Badge>
        )}
      </div>

      {/* Game Image */}
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:rounded-xl shadow-lg bg-muted">
          {/* Timer overlay - top right corner */}
          <div className="absolute top-3 right-3 z-10">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm ${
              isUrgent
                ? 'bg-red-500/80 text-white'
                : 'bg-black/50 text-white'
            }`}>
              <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-mono font-bold text-lg lg:text-xl">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Progress bar overlay - top of image */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <Progress
              value={progressPercentage}
              className={`h-2 lg:h-2.5 rounded-none ${isUrgent ? '[&>div]:bg-red-500' : '[&>div]:bg-primary'}`}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            />
          </div>

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
      </div>

      {/* Player scores - horizontal display for mobile */}
      {players.length > 0 && (
        <div className="lg:hidden flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {players.map((player) => (
            <Badge
              key={player.id}
              variant={player.id === currentPlayer?.id ? "default" : "secondary"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-xs font-semibold">
                {player.avatar || player.username.charAt(0).toUpperCase()}
              </div>
              <span>{player.username}</span>
              <span className="font-bold">{player.score}</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Guess Input Section */}
      <div className="space-y-3 lg:space-y-4">
        <div className="text-center">
          <h3 className="text-base lg:text-lg font-medium mb-2 lg:mb-3">{t('game.prompt')}</h3>
          <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
            {t('game.promptDescription')}
          </p>
        </div>

        <div className="max-w-md mx-auto">
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
            <div className="text-center py-3 lg:py-4">
              <Badge variant="secondary" className="text-base lg:text-lg px-3 lg:px-4 py-1.5 lg:py-2">
                {t('game.submitted', { year: guess })}
              </Badge>
              <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                {t('game.waitingForOthers')}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}