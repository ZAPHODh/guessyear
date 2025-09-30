"use client";

import { useEffect, useState, useCallback } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';
import { useWebSocket } from './use-websocket';
import { useLobbyState } from './use-lobby-state';
import { useGameTimer } from './use-game-timer';
import { useChatMessages } from './use-chat-messages';

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

interface UseMultiplayerLobbyProps {
  lobbyId: string;
  userId?: string;
  sessionId?: string;
  username: string;
  avatar?: string;
  enabled?: boolean;
}

export function useMultiplayerLobby({
  lobbyId,
  userId,
  sessionId,
  username,
  avatar = '🎮',
  enabled = true
}: UseMultiplayerLobbyProps) {
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [hasSubmittedGuess, setHasSubmittedGuess] = useState(false);
  const [lastRoundResults, setLastRoundResults] = useState<{
    correctYear: number;
    guesses: Guess[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use smaller, focused hooks
  const { isConnected, connect, disconnect } = useWebSocket({
    onConnect: () => setError(null),
    onError: (message) => {
      setError(message);
    }
  });

  const lobbyState = useLobbyState();
  const timer = useGameTimer();
  const chat = useChatMessages();

  // Connection management
  const joinLobby = useCallback(() => {
    connect();
    socket.emit('join_lobby', {
      lobbyId,
      userId,
      sessionId,
      username,
      avatar
    });
  }, [connect, lobbyId, userId, sessionId, username, avatar]);

  const leaveLobby = useCallback(() => {
    socket.emit('leave_lobby');
    timer.clearAllTimers();
    disconnect();
  }, [disconnect, timer]);

  // Game actions
  const toggleReady = useCallback((isReady: boolean) => {
    socket.emit('player_ready', { isReady });
  }, []);

  const startGame = useCallback(() => {
    socket.emit('start_game');
  }, []);

  const submitGuess = useCallback((year: number) => {
    socket.emit('submit_guess', { year });
    setHasSubmittedGuess(true);
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

  const restartGame = useCallback(() => {
    socket.emit('restart_game');
  }, []);

  const updateLobbySettings = useCallback((settings: any) => {
    socket.emit('update_lobby_settings', settings);
  }, []);

  // Socket event handlers
  useEffect(() => {
    const handleLobbyJoined = (lobby: any) => {
      lobbyState.actions.updateLobby(lobby);
      if (lobby.chatMessages) {
        lobby.chatMessages.forEach((msg: any) => chat.addMessage(msg));
      }
    };

    const handlePlayerJoined = ({ player }: { player: any }) => {
      lobbyState.actions.addPlayer(player);
      toast.success(`${player.username} joined the lobby`);
    };

    const handlePlayerLeft = ({ username }: { username: string }) => {
      lobbyState.actions.removePlayer(username);
      toast.info(`${username} left the lobby`);
    };

    const handlePlayerReadyChanged = ({ playerId, isReady }: { playerId: string; isReady: boolean }) => {
      lobbyState.actions.updatePlayerReady(playerId, isReady);
    };

    const handleGameStarting = ({ countdown }: { countdown: number }) => {
      lobbyState.actions.updateGameState('STARTING');
      timer.startCountdown(countdown);
    };

    const handleGameStarted = () => {
      lobbyState.actions.updateGameState('PLAYING');
      toast.success('Game started!');
    };

    const handleRoundStarted = (roundData: RoundData) => {
      timer.clearAllTimers();
      lobbyState.actions.updateGameState('PLAYING');
      setCurrentRound(roundData);
      setHasSubmittedGuess(false);
      setLastRoundResults(null);
      timer.startTimer(roundData.timer);
    };

    const handleRoundEnded = (results: {
      correctYear: number;
      guesses: Guess[];
      leaderboard: any[];
      nextRoundCountdown?: number;
    }) => {
      lobbyState.actions.updateGameState('ROUND_RESULTS');
      lobbyState.actions.updateLeaderboard(results.leaderboard);
      setLastRoundResults({
        correctYear: results.correctYear,
        guesses: results.guesses
      });

      if (results.nextRoundCountdown) {
        timer.startNextRoundCountdown(results.nextRoundCountdown);
      }
    };

    const handleGameEnded = ({ finalLeaderboard }: { finalLeaderboard: any[] }) => {
      lobbyState.actions.updateGameState('FINISHED');
      lobbyState.actions.updateLeaderboard(finalLeaderboard);
      toast.success('Game finished!');
    };

    const handleGuessSubmitted = () => {
      toast.success('Guess submitted!');
    };

    const handleNewMessage = (message: any) => {
      chat.addMessage(message);
    };

    const handleNewReaction = (reaction: any) => {
      toast(`${reaction.emoji}`, { duration: 1000 });
    };

    const handleHintAvailable = ({ hint }: { hint: any }) => {
      toast.info(`Hint: ${hint}`);
    };

    const handleHostTransferred = ({ newHostUserId }: { newHostUserId: string }) => {
      lobbyState.actions.updateHost(newHostUserId);
      toast.success('Host has been transferred');
    };

    const handleGameRestarted = ({ lobby, players, chatMessages }: { lobby: any; players: any[]; chatMessages: any[] }) => {
      lobbyState.actions.updateLobby(lobby);
      lobbyState.actions.setPlayers(players);
      setCurrentRound(null);
      setHasSubmittedGuess(false);
      setLastRoundResults(null);
      timer.clearAllTimers();
      chat.clearMessages();
      chatMessages.forEach((msg: any) => chat.addMessage(msg));
      toast.success('Game has been restarted!');
    };

    const handleLobbyUpdated = ({ lobby }: { lobby: any }) => {
      lobbyState.actions.updateLobby(lobby);
      toast.success('Game settings updated!');
    };

    const handleLobbyFinished = ({ lobbyId, reason }: { lobbyId: string; reason: string }) => {
      toast.error(`Lobby ended: ${reason}`);
      // Redirect to lobby browser
      window.location.href = '/lobby';
    };

    // Register event listeners
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
    socket.on('host_transferred', handleHostTransferred);
    socket.on('game_restarted', handleGameRestarted);
    socket.on('lobby_updated', handleLobbyUpdated);
    socket.on('lobby_finished', handleLobbyFinished);

    return () => {
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
      socket.off('host_transferred', handleHostTransferred);
      socket.off('game_restarted', handleGameRestarted);
      socket.off('lobby_updated', handleLobbyUpdated);
      socket.off('lobby_finished', handleLobbyFinished);
    };
  }, [lobbyState.actions, chat, timer]);

  // Auto-connect on mount - only run once per lobby and when enabled
  useEffect(() => {
    if (!enabled) return;

    // Direct connection without using the connect callback to avoid dependencies
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

    return () => {
      socket.emit('leave_lobby');
      timer.clearAllTimers();
      // Don't disconnect socket here, just leave the lobby
    };
  }, [lobbyId, enabled, userId, sessionId, username, avatar]); // Re-run if any identification parameters change

  // Return disabled state when not enabled
  if (!enabled) {
    return {
      // Lobby state
      lobby: null,
      players: [],
      gameState: 'WAITING',
      leaderboard: [],

      // Connection state
      isConnected: false,
      error: null,

      // Game state
      currentRound: null,
      timeRemaining: 0,
      countdown: null,
      nextRoundCountdown: null,
      hasSubmittedGuess: false,
      lastRoundResults: null,

      // Chat
      chatMessages: [],

      // Actions
      actions: {
        connect: () => {},
        disconnect: () => {},
        toggleReady: () => {},
        startGame: () => {},
        submitGuess: () => {},
        sendMessage: () => {},
        sendReaction: () => {},
        kickPlayer: () => {},
        transferHost: () => {},
        restartGame: () => {},
        updateLobbySettings: () => {}
      }
    };
  }

  return {
    // Lobby state
    lobby: lobbyState.lobby,
    players: lobbyState.players,
    gameState: lobbyState.gameState,
    leaderboard: lobbyState.leaderboard,

    // Connection state
    isConnected,
    error,

    // Game state
    currentRound,
    timeRemaining: timer.timeRemaining,
    countdown: timer.countdown,
    nextRoundCountdown: timer.nextRoundCountdown,
    hasSubmittedGuess,
    lastRoundResults,

    // Chat
    chatMessages: chat.messages,

    // Actions
    actions: {
      connect: joinLobby,
      disconnect: leaveLobby,
      toggleReady,
      startGame,
      submitGuess,
      sendMessage,
      sendReaction,
      kickPlayer,
      transferHost,
      restartGame,
      updateLobbySettings
    }
  };
}