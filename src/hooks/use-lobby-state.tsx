"use client";

import { useState, useCallback } from 'react';
import type { Player } from '@/lib/types/lobby';

interface LobbyState {
  lobby: any;
  players: Player[];
  gameState: 'WAITING' | 'STARTING' | 'PLAYING' | 'ROUND_RESULTS' | 'FINISHED';
  leaderboard: Player[];
}

const initialState: LobbyState = {
  lobby: null,
  players: [],
  gameState: 'WAITING',
  leaderboard: []
};

export function useLobbyState() {
  const [state, setState] = useState<LobbyState>(initialState);

  const updateLobby = useCallback((lobby: any) => {
    setState(prev => ({
      ...prev,
      lobby,
      players: lobby.players || prev.players
    }));
  }, []);

  const addPlayer = useCallback((player: Player) => {
    setState(prev => ({
      ...prev,
      players: prev.players.some(p => p.id === player.id)
        ? prev.players
        : [...prev.players, player]
    }));
  }, []);

  const removePlayer = useCallback((username: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.username !== username)
    }));
  }, []);

  const updatePlayerReady = useCallback((playerId: string, isReady: boolean) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === playerId ? { ...p, isReady } : p
      )
    }));
  }, []);

  const updateGameState = useCallback((gameState: LobbyState['gameState']) => {
    setState(prev => ({ ...prev, gameState }));
  }, []);

  const updateLeaderboard = useCallback((leaderboard: Player[]) => {
    setState(prev => ({
      ...prev,
      leaderboard,
      players: prev.players.map(player => {
        const updatedPlayer = leaderboard.find(p => p.id === player.id);
        return updatedPlayer || player;
      })
    }));
  }, []);

  const updateHost = useCallback((newHostUserId: string) => {
    setState(prev => ({
      ...prev,
      lobby: {
        ...prev.lobby,
        hostUserId: newHostUserId
      }
    }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setState(prev => ({
      ...prev,
      players
    }));
  }, []);

  return {
    ...state,
    actions: {
      updateLobby,
      addPlayer,
      removePlayer,
      updatePlayerReady,
      updateGameState,
      updateLeaderboard,
      updateHost,
      setPlayers
    }
  };
}