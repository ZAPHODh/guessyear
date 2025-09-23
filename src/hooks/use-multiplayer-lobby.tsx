"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';

interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  isReady: boolean;
  isEliminated: boolean;
  streak: number;
  userId?: string;
  sessionId?: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  type: 'CHAT' | 'SYSTEM' | 'QUICK_PHRASE';
  createdAt: string;
}

interface Guess {
  player: string;
  year: number;
  points: number;
  speedBonus: number;
  accuracy: number;
}

interface RoundData {
  roundNumber: number;
  image: {
    url: string;
    description?: string;
  };
  timer: number;
  hintsEnabled: boolean;
}

interface GameState {
  lobby: any;
  players: Player[];
  isConnected: boolean;
  gameState: 'WAITING' | 'STARTING' | 'PLAYING' | 'ROUND_RESULTS' | 'FINISHED';
  currentRound: RoundData | null;
  timeRemaining: number;
  chatMessages: ChatMessage[];
  leaderboard: Player[];
  lastRoundResults: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  hasSubmittedGuess: boolean;
  countdown: number | null;
  nextRoundCountdown: number | null;
}

interface UseMultiplayerLobbyProps {
  lobbyId: string;
  userId?: string;
  sessionId?: string;
  username: string;
  avatar?: string;
}

export function useMultiplayerLobby({
  lobbyId,
  userId,
  sessionId,
  username,
  avatar = '🎮'
}: UseMultiplayerLobbyProps) {
  const [gameState, setGameState] = useState<GameState>({
    lobby: null,
    players: [],
    isConnected: false,
    gameState: 'WAITING',
    currentRound: null,
    timeRemaining: 0,
    chatMessages: [],
    leaderboard: [],
    lastRoundResults: null,
    hasSubmittedGuess: false,
    countdown: null,
    nextRoundCountdown: null
  });

  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const nextRoundCountdownRef = useRef<NodeJS.Timeout | null>(null);

  // Connection management
  const connect = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_lobby', {
      lobbyId,
      userId,
      sessionId,
      username,
      avatar
    });
  }, [lobbyId, userId, sessionId, username, avatar]);

  const disconnect = useCallback(() => {
    socket.emit('leave_lobby');
    socket.disconnect();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (nextRoundCountdownRef.current) {
      clearInterval(nextRoundCountdownRef.current);
    }
  }, []);

  // Game actions
  const toggleReady = useCallback((isReady: boolean) => {
    socket.emit('player_ready', { isReady });
  }, []);

  const startGame = useCallback(() => {
    socket.emit('start_game');
  }, []);

  const submitGuess = useCallback((year: number) => {
    socket.emit('submit_guess', { year });
    setGameState(prev => ({ ...prev, hasSubmittedGuess: true }));
  }, []);

  const sendMessage = useCallback((message: string, type: 'CHAT' | 'QUICK_PHRASE' = 'CHAT') => {
    socket.emit('send_message', { message, type });
  }, []);

  const sendReaction = useCallback((
    emoji: string,
    targetType: string,
    targetId?: string,
    roundId?: string
  ) => {
    socket.emit('send_reaction', { emoji, targetType, targetId, roundId });
  }, []);

  const kickPlayer = useCallback((playerId: string) => {
    socket.emit('kick_player', { playerId });
  }, []);

  const transferHost = useCallback((playerId: string) => {
    socket.emit('transfer_host', { playerId });
  }, []);

  // Socket event handlers
  useEffect(() => {
    const handleConnection = () => {
      setGameState(prev => ({ ...prev, isConnected: true }));
      setError(null);
    };

    const handleDisconnection = () => {
      setGameState(prev => ({ ...prev, isConnected: false }));
    };

    const handleLobbyJoined = (lobby: any) => {
      setGameState(prev => ({
        ...prev,
        lobby,
        players: lobby.players || [],
        chatMessages: lobby.chatMessages || []
      }));
    };

    const handlePlayerJoined = ({ player }: { player: Player }) => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.some(p => p.id === player.id)
          ? prev.players
          : [...prev.players, player]
      }));
      toast.success(`${player.username} joined the lobby`);
    };

    const handlePlayerLeft = ({ username }: { username: string }) => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.filter(p => p.username !== username)
      }));
      toast.info(`${username} left the lobby`);
    };

    const handlePlayerReadyChanged = ({ playerId, isReady }: { playerId: string; isReady: boolean }) => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(p =>
          p.id === playerId ? { ...p, isReady } : p
        )
      }));
    };

    const handleGameStarting = ({ countdown }: { countdown: number }) => {
      setGameState(prev => ({ ...prev, gameState: 'STARTING', countdown }));

      countdownRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.countdown && prev.countdown > 1) {
            return { ...prev, countdown: prev.countdown - 1 };
          } else {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            return { ...prev, countdown: null };
          }
        });
      }, 1000);
    };

    const handleGameStarted = () => {
      setGameState(prev => ({
        ...prev,
        gameState: 'PLAYING',
        countdown: null
      }));
      toast.success('Game started!');
    };

    const handleRoundStarted = (roundData: RoundData) => {
      // Clear any existing timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (nextRoundCountdownRef.current) {
        clearInterval(nextRoundCountdownRef.current);
      }

      setGameState(prev => ({
        ...prev,
        gameState: 'PLAYING',
        currentRound: roundData,
        timeRemaining: roundData.timer,
        hasSubmittedGuess: false,
        lastRoundResults: null,
        nextRoundCountdown: null
      }));

      // Start timer
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining > 0) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          } else {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return prev;
          }
        });
      }, 1000);
    };

    const handleRoundEnded = (results: {
      correctYear: number;
      guesses: Guess[];
      leaderboard: Player[];
      nextRoundCountdown?: number;
    }) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setGameState(prev => ({
        ...prev,
        gameState: 'ROUND_RESULTS',
        lastRoundResults: {
          correctYear: results.correctYear,
          guesses: results.guesses
        },
        leaderboard: results.leaderboard,
        players: prev.players.map(player => {
          const updatedPlayer = results.leaderboard.find(p => p.id === player.id);
          return updatedPlayer || player;
        }),
        nextRoundCountdown: results.nextRoundCountdown || null
      }));

      // Start next round countdown if provided
      if (results.nextRoundCountdown) {
        nextRoundCountdownRef.current = setInterval(() => {
          setGameState(prev => {
            if (prev.nextRoundCountdown && prev.nextRoundCountdown > 1) {
              return { ...prev, nextRoundCountdown: prev.nextRoundCountdown - 1 };
            } else {
              if (nextRoundCountdownRef.current) {
                clearInterval(nextRoundCountdownRef.current);
              }
              return { ...prev, nextRoundCountdown: null };
            }
          });
        }, 1000);
      }
    };

    const handleGameEnded = ({ finalLeaderboard }: { finalLeaderboard: Player[] }) => {
      setGameState(prev => ({
        ...prev,
        gameState: 'FINISHED',
        leaderboard: finalLeaderboard
      }));
      toast.success('Game finished!');
    };

    const handleGuessSubmitted = () => {
      toast.success('Guess submitted!');
    };

    const handleNewMessage = (message: ChatMessage) => {
      setGameState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, message]
      }));
    };

    const handleNewReaction = (reaction: any) => {
      // Handle reaction UI updates
      toast(`${reaction.emoji}`, { duration: 1000 });
    };

    const handleHintAvailable = ({ hint }: { hint: any }) => {
      toast.info(`Hint: ${hint}`);
    };

    const handleError = ({ message }: { message: string }) => {
      setError(message);
      toast.error(message);
    };

    const handleHostTransferred = ({ newHostUserId, newHostPlayerId }: { newHostUserId: string; newHostPlayerId: string }) => {
      setGameState(prev => ({
        ...prev,
        lobby: {
          ...prev.lobby,
          hostUserId: newHostUserId
        }
      }));
      toast.success('Host has been transferred');
    };

    // Register event listeners
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnection);
    socket.on('lobby_joined', handleLobbyJoined);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_left', handlePlayerLeft);
    socket.on('player_ready_changed', handlePlayerReadyChanged);
    socket.on('game_starting', handleGameStarting);
    socket.on('game_started', handleGameStarted);
    socket.on('round_started', handleRoundStarted);
    socket.on('round_ended', handleRoundEnded);
    socket.on('game_ended', handleGameEnded);
    socket.on('guess_submitted', handleGuessSubmitted);
    socket.on('new_message', handleNewMessage);
    socket.on('new_reaction', handleNewReaction);
    socket.on('hint_available', handleHintAvailable);
    socket.on('error', handleError);
    socket.on('host_transferred', handleHostTransferred);

    return () => {
      socket.off('connect', handleConnection);
      socket.off('disconnect', handleDisconnection);
      socket.off('lobby_joined', handleLobbyJoined);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_left', handlePlayerLeft);
      socket.off('player_ready_changed', handlePlayerReadyChanged);
      socket.off('game_starting', handleGameStarting);
      socket.off('game_started', handleGameStarted);
      socket.off('round_started', handleRoundStarted);
      socket.off('round_ended', handleRoundEnded);
      socket.off('game_ended', handleGameEnded);
      socket.off('guess_submitted', handleGuessSubmitted);
      socket.off('new_message', handleNewMessage);
      socket.off('new_reaction', handleNewReaction);
      socket.off('hint_available', handleHintAvailable);
      socket.off('error', handleError);
      socket.off('host_transferred', handleHostTransferred);
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...gameState,
    error,
    actions: {
      connect,
      disconnect,
      toggleReady,
      startGame,
      submitGuess,
      sendMessage,
      sendReaction,
      kickPlayer,
      transferHost
    }
  };
}