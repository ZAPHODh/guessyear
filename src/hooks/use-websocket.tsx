"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { socket } from '@/lib/socket';

interface UseWebSocketProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export function useWebSocket({
  onConnect,
  onDisconnect,
  onError
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  // Stabilize callbacks with refs
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  });

  const connect = useCallback(() => {
    if (socket.connected || isConnectingRef.current) return;

    isConnectingRef.current = true;
    socket.connect();
  }, []);

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setRetryCount(0);
    socket.disconnect();
  }, []);

  useEffect(() => {
    function handleConnect() {
      isConnectingRef.current = false;
      setIsConnected(true);
      setRetryCount(0);
      onConnectRef.current?.();
    }

    function handleDisconnect(reason: string) {
      isConnectingRef.current = false;
      setIsConnected(false);
      onDisconnectRef.current?.();

      // Don't retry if server kicked us or manual disconnect
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        return;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);

      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        connect();
      }, delay);
    }

    function handleError({ message }: { message: string }) {
      onErrorRef.current?.(message);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [connect, retryCount]);

  return {
    isConnected,
    connect,
    disconnect
  };
}