"use client";

import { useLobby } from '@/contexts/lobby-context';
import { LobbyChat } from './lobby-chat';

export function LobbyChatContainer() {
  const { chatMessages, actions, username } = useLobby();

  return (
    <LobbyChat
      messages={chatMessages}
      onSendMessage={actions.sendMessage}
      currentUsername={username}
      compact
    />
  );
}
