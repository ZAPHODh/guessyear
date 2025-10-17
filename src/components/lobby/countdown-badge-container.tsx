"use client";

import { useLobby } from '@/contexts/lobby-context';
import { CountdownBadge } from './countdown-badge';

export function CountdownBadgeContainer() {
  const { nextRoundCountdown, gameState, profile } = useLobby();

  if (
    profile.showProfileDialog ||
    !nextRoundCountdown ||
    nextRoundCountdown <= 0 ||
    gameState !== 'PLAYING'
  ) {
    return null;
  }

  return <CountdownBadge countdown={nextRoundCountdown} />;
}
