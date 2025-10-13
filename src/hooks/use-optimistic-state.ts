import { useState, useCallback, useRef } from 'react';

interface OptimisticUpdate<T> {
  id: string;
  value: T;
  timestamp: number;
}

export function useOptimisticState<T>(initialValue: T, timeout = 5000) {
  const [serverValue, setServerValue] = useState(initialValue);
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate<T>[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const value = optimisticUpdates.length > 0
    ? optimisticUpdates[optimisticUpdates.length - 1].value
    : serverValue;

  const setOptimistic = useCallback((id: string, newValue: T) => {
    setOptimisticUpdates(prev => [
      ...prev,
      { id, value: newValue, timestamp: Date.now() }
    ]);

    const timeoutId = setTimeout(() => {
      setOptimisticUpdates(prev => prev.filter(u => u.id !== id));
      timeoutRefs.current.delete(id);
    }, timeout);

    timeoutRefs.current.set(id, timeoutId);
  }, [timeout]);

  const confirmOptimistic = useCallback((id: string, confirmedValue: T) => {
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    setOptimisticUpdates(prev => prev.filter(u => u.id !== id));
    setServerValue(confirmedValue);
  }, []);

  const revertOptimistic = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }

    setOptimisticUpdates(prev => prev.filter(u => u.id !== id));
  }, []);

  const setServer = useCallback((newValue: T) => {
    setServerValue(newValue);
    setOptimisticUpdates([]);
  }, []);

  return {
    value,
    serverValue,
    setOptimistic,
    confirmOptimistic,
    revertOptimistic,
    setServer
  };
}
