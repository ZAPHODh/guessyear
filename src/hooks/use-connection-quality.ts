import { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';

export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected';

export function useConnectionQuality() {
  const [ping, setPing] = useState<number | null>(null);
  const [quality, setQuality] = useState<ConnectionQuality>('disconnected');
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function measurePing() {
      const startTime = Date.now();

      socket.emit('ping', {}, () => {
        const latency = Date.now() - startTime;
        setPing(latency);

        if (latency < 50) setQuality('excellent');
        else if (latency < 150) setQuality('good');
        else setQuality('poor');
      });
    }

    if (socket.connected) {
      measurePing();
      pingIntervalRef.current = setInterval(measurePing, 5000);
    } else {
      setQuality('disconnected');
      setPing(null);
    }

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [socket.connected]);

  return { ping, quality };
}
