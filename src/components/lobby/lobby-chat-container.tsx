"use client";

import { useLobby } from '@/contexts/lobby-context';
import { LobbyChat } from './lobby-chat';

export function LobbyChatContainer() {
  const {
    chatMessages,
    actions,
    username,
    lastRoundResults,
    players,
    leaderboard,
    currentPlayer,
    gameState
  } = useLobby();

  const displayPlayers = leaderboard.length > 0 ? leaderboard : players;
  const showPlayerScores = leaderboard.length > 0 || gameState === 'PLAYING';

  return (
    <LobbyChat
      messages={chatMessages}
      onSendMessage={actions.sendMessage}
      currentUsername={username}
      compact
      lastRoundResults={lastRoundResults}
      players={displayPlayers}
      currentPlayer={currentPlayer}
      showPlayerScores={showPlayerScores}
    />
  );
}
