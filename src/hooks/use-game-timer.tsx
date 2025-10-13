"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseGameTimerReturn {
  timeRemaining: number;
  countdown: number | null;
  nextRoundCountdown: number | null;
  startTimer: (duration: number) => void;
  startCountdown: (duration: number) => void;
  startNextRoundCountdown: (duration: number) => void;
  clearAllTimers: () => void;
}

export function useGameTimer(): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [nextRoundCountdown, setNextRoundCountdown] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundCountdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (nextRoundCountdownRef.current) {
      clearInterval(nextRoundCountdownRef.current);
      nextRoundCountdownRef.current = null;
    }
  }, []);

  const startTimer = useCallback((duration: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeRemaining(duration);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
      });
    }, 1000);
  }, []);

  const startCountdown = useCallback((duration: number) => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(duration);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return null;
        }
      });
    }, 1000);
  }, []);

  const startNextRoundCountdown = useCallback((duration: number) => {
    if (nextRoundCountdownRef.current) {
      clearInterval(nextRoundCountdownRef.current);
    }

    setNextRoundCountdown(duration);
    nextRoundCountdownRef.current = setInterval(() => {
      setNextRoundCountdown(prev => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          if (nextRoundCountdownRef.current) {
            clearInterval(nextRoundCountdownRef.current);
            nextRoundCountdownRef.current = null;
          }
          return null;
        }
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return {
    timeRemaining,
    countdown,
    nextRoundCountdown,
    startTimer,
    startCountdown,
    startNextRoundCountdown,
    clearAllTimers
  };
}