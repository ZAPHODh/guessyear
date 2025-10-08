"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';
import { useWebSocket } from './use-websocket';
import { useLobbyState } from './use-lobby-state';
import { useGameTimer } from './use-game-timer';
import { useChatMessages } from './use-chat-messages';
import type { RoundData, Guess, Player } from '@/lib/types/lobby';
import { validateSocketData, socketSchemas } from '@/lib/socket-validation';
import { telemetry } from '@/lib/telemetry';
import { rateLimiter } from '@/lib/rate-limiter';

interface UseMultiplayerLobbyProps {
  lobbyId: string;
  userId: string | null;
  sessionId: string | null;
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

  const hasJoinedRef = useRef(false);

  const { isConnected, connect, disconnect } = useWebSocket({
    onConnect: () => setError(null),
    onError: (message) => setError(message)
  });

  const lobbyState = useLobbyState();
  const timer = useGameTimer();
  const chat = useChatMessages();

  // Stabilize actions with refs to prevent effect re-runs
  const actionsRef = useRef(lobbyState.actions);
  const chatActionsRef = useRef(chat);
  const timerActionsRef = useRef(timer);

  useEffect(() => {
    actionsRef.current = lobbyState.actions;
    chatActionsRef.current = chat;
    timerActionsRef.current = timer;
  });

  // Set telemetry context
  useEffect(() => {
    telemetry.setContext({
      userId: userId || undefined,
      lobbyId,
      sessionId: sessionId || undefined
    });

    return () => {
      telemetry.clearContext();
    };
  }, [userId, lobbyId, sessionId]);

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
    // Rate limit: max 5 messages per 10 seconds
    if (!rateLimiter.canExecute('chat', 5, 10000)) {
      toast.error('You are sending messages too fast');
      return;
    }

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

  const updateLobbySettings = useCallback((settings: unknown) => {
    socket.emit('update_lobby_settings', settings);
  }, []);

  // Socket event handlers using refs
  useEffect(() => {
    function handleLobbyJoined(data: unknown) {
      const lobby = validateSocketData(socketSchemas.lobby, data, 'lobby_joined');
      if (!lobby) return;

      actionsRef.current.updateLobby(lobby);

      // Clear existing messages before adding lobby chat history
      // This prevents duplicates when reconnecting
      chatActionsRef.current.clearMessages();

      if (lobby.chatMessages) {
        lobby.chatMessages.forEach((msg) => {
          const validMsg = validateSocketData(socketSchemas.chatMessage, msg, 'chat_message');
          if (validMsg) chatActionsRef.current.addMessage(validMsg);
        });
      }

      telemetry.info('Lobby joined', { lobbyId: lobby.id });
    }

    function handlePlayerJoined({ player }: { player: unknown }) {
      const validPlayer = validateSocketData(socketSchemas.player, player, 'player_joined');
      if (!validPlayer) return;

      actionsRef.current.addPlayer(validPlayer);
      // Only show toast, system message already sent by server
      telemetry.trackEvent('player_joined', { playerId: validPlayer.id });
    }

    function handlePlayerLeft({ username }: { username: string }) {
      actionsRef.current.removePlayer(username);
      // Don't show toast, system message already sent by server
    }

    function handlePlayerReadyChanged({
      playerId,
      isReady
    }: {
      playerId: string;
      isReady: boolean;
    }) {
      actionsRef.current.updatePlayerReady(playerId, isReady);
    }

    function handleGameStarting({ countdown }: { countdown: number }) {
      actionsRef.current.updateGameState('STARTING');
      timerActionsRef.current.startCountdown(countdown);
    }

    function handleGameStarted() {
      actionsRef.current.updateGameState('PLAYING');
      setLastRoundResults(null); // Clear results when game starts
      toast.success('Game started!');
      telemetry.trackEvent('game_started', { lobbyId });
    }

    function handleRoundStarted(data: unknown) {
      const roundData = validateSocketData(socketSchemas.roundData, data, 'round_started');
      if (!roundData) return;

      timerActionsRef.current.clearAllTimers();
      actionsRef.current.updateGameState('PLAYING');
      setCurrentRound(roundData);
      setHasSubmittedGuess(false);
      setLastRoundResults(null);
      timerActionsRef.current.startTimer(roundData.timer);
      telemetry.trackEvent('round_started', { roundNumber: roundData.roundNumber });
    }

    function handleRoundEnded(results: {
      correctYear: number;
      guesses: Guess[];
      leaderboard: Player[];
      nextRoundCountdown?: number;
    }) {
      actionsRef.current.updateGameState('ROUND_RESULTS');
      actionsRef.current.updateLeaderboard(results.leaderboard);
      setLastRoundResults({
        correctYear: results.correctYear,
        guesses: results.guesses
      });

      if (results.nextRoundCountdown) {
        timerActionsRef.current.startNextRoundCountdown(results.nextRoundCountdown);
      }
    }

    function handleGameEnded({ finalLeaderboard }: { finalLeaderboard: Player[] }) {
      actionsRef.current.updateGameState('FINISHED');
      actionsRef.current.updateLeaderboard(finalLeaderboard);
      toast.success('Game finished!');
    }

    function handleGuessSubmitted() {
      toast.success('Guess submitted!');
    }

    function handleNewMessage(message: unknown) {
      const validMsg = validateSocketData(socketSchemas.chatMessage, message, 'new_message');
      if (validMsg) chatActionsRef.current.addMessage(validMsg);
    }

    function handleNewReaction(reaction: { emoji: string }) {
      toast(`${reaction.emoji}`, { duration: 1000 });
    }

    function handleHintAvailable({ hint }: { hint: string }) {
      toast.info(`Hint: ${hint}`);
    }

    function handleHostTransferred({ newHostUserId }: { newHostUserId: string }) {
      actionsRef.current.updateHost(newHostUserId);
      toast.success('Host has been transferred');
    }

    function handleGameRestarted({
      lobby,
      players,
      chatMessages
    }: {
      lobby: unknown;
      players: Player[];
      chatMessages: unknown[];
    }) {
      actionsRef.current.updateLobby(lobby);
      actionsRef.current.setPlayers(players);
      actionsRef.current.updateGameState('WAITING');
      actionsRef.current.updateLeaderboard([]);
      setCurrentRound(null);
      setHasSubmittedGuess(false);
      setLastRoundResults(null);
      timerActionsRef.current.clearAllTimers();
      chatActionsRef.current.clearMessages();
      chatMessages.forEach((msg) => {
        const validMsg = validateSocketData(socketSchemas.chatMessage, msg, 'chat_message');
        if (validMsg) chatActionsRef.current.addMessage(validMsg);
      });
      toast.success('Game has been restarted!');
      telemetry.trackEvent('game_restarted', { lobbyId });
    }

    function handleLobbyUpdated({ lobby }: { lobby: unknown }) {
      actionsRef.current.updateLobby(lobby);
      toast.success('Game settings updated!');
    }

    function handleLobbyFinished({
      lobbyId: finishedLobbyId,
      reason
    }: {
      lobbyId: string;
      reason: string;
    }) {
      toast.error(`Lobby ended: ${reason}`);
      window.location.href = '/lobby';
    }

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
  }, []); // Empty deps - all handlers use refs

  // Join lobby once when enabled
  useEffect(() => {
    if (!enabled || hasJoinedRef.current) return;

    hasJoinedRef.current = true;

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
      hasJoinedRef.current = false;
      socket.emit('leave_lobby');
      timerActionsRef.current.clearAllTimers();
    };
  }, [lobbyId, enabled]); // Only re-run if lobby changes

  if (!enabled) {
    return {
      lobby: null,
      players: [],
      gameState: 'WAITING',
      leaderboard: [],
      isConnected: false,
      error: null,
      currentRound: null,
      timeRemaining: 0,
      countdown: null,
      nextRoundCountdown: null,
      hasSubmittedGuess: false,
      lastRoundResults: null,
      chatMessages: [],
      actions: {
        connect: () => { },
        disconnect: () => { },
        toggleReady: () => { },
        startGame: () => { },
        submitGuess: () => { },
        sendMessage: () => { },
        sendReaction: () => { },
        kickPlayer: () => { },
        transferHost: () => { },
        restartGame: () => { },
        updateLobbySettings: () => { }
      }
    };
  }

  return {
    lobby: lobbyState.lobby,
    players: lobbyState.players,
    gameState: lobbyState.gameState,
    leaderboard: lobbyState.leaderboard,
    isConnected,
    error,
    currentRound,
    timeRemaining: timer.timeRemaining,
    countdown: timer.countdown,
    nextRoundCountdown: timer.nextRoundCountdown,
    hasSubmittedGuess,
    lastRoundResults,
    chatMessages: chat.messages,
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