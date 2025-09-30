"use client";

import { useEffect, useState, useCallback } from 'react';
import { socket } from '@/lib/socket';

interface UseWebSocketProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export function useWebSocket({ onConnect, onDisconnect, onError }: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      onConnect?.();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      onDisconnect?.();
    };

    const handleError = ({ message }: { message: string }) => {
      onError?.(message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, [onConnect, onDisconnect, onError]);

  return {
    isConnected,
    connect,
    disconnect
  };
}