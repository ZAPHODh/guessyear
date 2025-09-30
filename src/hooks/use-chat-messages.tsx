"use client";

import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  type: 'CHAT' | 'SYSTEM' | 'QUICK_PHRASE';
  createdAt: string;
}

export function useChatMessages(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages
  };
}