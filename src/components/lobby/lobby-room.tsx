"use client";

import { useState, useEffect } from 'react';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LobbyChat } from './lobby-chat';
import { PlayerSpots } from './player-spots';
import { GameView } from './game-view';
import { ResultsView } from './results-view';
import { ShareDrawer } from '../shared/share-drawer';
import { toast } from 'sonner';
import {
  Users,
  Clock
} from 'lucide-react';

interface LobbyRoomProps {
  lobby: any;
  user: any;
  sessionId?: string;
}


// Component for waiting room
function WaitingRoom({
  lobby,
  players,
  currentPlayer,
  gameState,
  countdown,
  isHost,
  onReady,
  chatMessages,
  onSendMessage,
  username,
  isConnected,
  actions
}: {
  lobby: any;
  players: any[];
  currentPlayer: any;
  gameState: string;
  countdown: number | null;
  isHost: boolean;
  onReady: () => void;
  chatMessages: any[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  isConnected: boolean;
  actions: any;
}) {
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <ShareDrawer
            title="Invite Players"
            description="Share this lobby with your friends!"
            shareText={`Join my multiplayer game: ${lobby.name}`}
            url={inviteUrl}
            buttonText="Invite"
            buttonVariant="outline"
            buttonSize="sm"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{lobby.name}</h1>
          {lobby.description && (
            <p className="text-lg text-muted-foreground">{lobby.description}</p>
          )}
        </div>

        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{players.length}/{lobby.maxPlayers} players</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{lobby.roundTimer}s per round</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {lobby.gameMode.toLowerCase()}
          </Badge>
          {lobby.hintsEnabled && (
            <Badge variant="outline">Hints enabled</Badge>
          )}
        </div>
      </div>

      <PlayerSpots
        players={players}
        maxPlayers={lobby.maxPlayers}
        currentPlayer={currentPlayer}
        onToggleReady={onReady}
        gameState={gameState}
        isHost={isHost}
        onKickPlayer={actions.kickPlayer}
        onTransferHost={actions.transferHost}
      />


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gameState === 'STARTING' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Game Starting...</h3>
                <div className="text-3xl font-bold text-primary">
                  {countdown || 'Starting'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
        />
      </div>
    </div>
  );
}

function GameInProgress({
  currentRound,
  timeRemaining,
  guess,
  onGuessChange,
  onSubmitGuess,
  hasSubmittedGuess,
  lobbyTimer,
  players,
  currentPlayer,
  chatMessages,
  onSendMessage,
  username,
  gameState,
  isHost,
  actions
}: {
  currentRound: any;
  timeRemaining: number;
  guess: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
  players: any[];
  currentPlayer: any;
  chatMessages: any[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  gameState: string;
  isHost: boolean;
  actions: any;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {currentRound && (
          <GameView
            round={currentRound}
            timeRemaining={timeRemaining}
            guess={guess}
            onGuessChange={onGuessChange}
            onSubmitGuess={onSubmitGuess}
            hasSubmittedGuess={hasSubmittedGuess}
            lobbyTimer={lobbyTimer}
          />
        )}
      </div>

      <div className="space-y-4">
        <PlayerSpots
          players={players}
          maxPlayers={8}
          currentPlayer={currentPlayer}
          gameState={gameState}
          showScores
          isHost={isHost}
          onKickPlayer={actions.kickPlayer}
          onTransferHost={actions.transferHost}
        />
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
        />
      </div>
    </div>
  );
}

function RoundResults({
  lastRoundResults,
  leaderboard,
  onSendReaction,
  currentPlayer,
  chatMessages,
  onSendMessage,
  username,
  nextRoundCountdown,
  gameState,
  isHost,
  actions
}: {
  lastRoundResults: any;
  leaderboard: any[];
  onSendReaction: (emoji: string, targetType: string, targetId?: string, roundId?: string) => void;
  currentPlayer: any;
  chatMessages: any[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  nextRoundCountdown?: number | null;
  gameState: string;
  isHost: boolean;
  actions: any;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {lastRoundResults && (
          <ResultsView
            results={lastRoundResults}
            leaderboard={leaderboard}
            onSendReaction={onSendReaction}
            nextRoundCountdown={nextRoundCountdown || undefined}
          />
        )}
      </div>

      <div className="space-y-4">
        <PlayerSpots
          players={leaderboard}
          maxPlayers={8}
          currentPlayer={currentPlayer}
          gameState={gameState}
          showScores
          isHost={isHost}
          onKickPlayer={actions.kickPlayer}
          onTransferHost={actions.transferHost}
        />
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
        />
      </div>
    </div>
  );
}

function GameFinished({ leaderboard }: { leaderboard: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Game Finished!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Final Results</h3>
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{player.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {player.streak} streak
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {player.score} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={() => window.location.href = '/lobby'}>
          Back to Lobbies
        </Button>
      </div>
    </div>
  );
}

export function LobbyRoom({ lobby, user, sessionId }: LobbyRoomProps) {
  const [guess, setGuess] = useState('');
  const username = user?.name || user?.email?.split('@')[0] || 'Anonymous';

  const {
    players,
    isConnected,
    gameState,
    currentRound,
    timeRemaining,
    chatMessages,
    leaderboard,
    lastRoundResults,
    hasSubmittedGuess,
    countdown,
    nextRoundCountdown,
    error,
    actions
  } = useMultiplayerLobby({
    lobbyId: lobby.id,
    userId: user?.id,
    sessionId,
    username,
    avatar: username.charAt(0).toUpperCase()
  });

  const isHost = user && lobby.hostUserId === user.id;
  const currentPlayer = players.find(p =>
    (user && p.userId === user.id) || (!user && p.sessionId === sessionId)
  );

  useEffect(() => {
    if (currentRound && gameState === 'PLAYING' && !hasSubmittedGuess) {
      setGuess('');
    }
  }, [currentRound?.roundNumber, gameState, hasSubmittedGuess]);

  const handleReady = () => {
    if (currentPlayer) {
      actions.toggleReady(!currentPlayer.isReady);
    }
  };


  const handleSubmitGuess = () => {
    const year = parseInt(guess);
    if (isNaN(year) || year < 1800 || year > 2030) {
      toast.error('Please enter a valid year between 1800 and 2030');
      return;
    }
    actions.submitGuess(year);
    setGuess('');
  };


  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {(gameState === 'WAITING' || gameState === 'STARTING') && (
        <WaitingRoom
          lobby={lobby}
          players={players}
          currentPlayer={currentPlayer}
          gameState={gameState}
          countdown={countdown}
          isHost={isHost}
          onReady={handleReady}
          chatMessages={chatMessages}
          onSendMessage={actions.sendMessage}
          username={username}
          isConnected={isConnected}
          actions={actions}
        />
      )}

      {gameState === 'PLAYING' && (
        <GameInProgress
          currentRound={currentRound}
          timeRemaining={timeRemaining}
          guess={guess}
          onGuessChange={setGuess}
          onSubmitGuess={handleSubmitGuess}
          hasSubmittedGuess={hasSubmittedGuess}
          lobbyTimer={lobby.roundTimer}
          players={players}
          currentPlayer={currentPlayer}
          chatMessages={chatMessages}
          onSendMessage={actions.sendMessage}
          username={username}
          gameState={gameState}
          isHost={isHost}
          actions={actions}
        />
      )}

      {gameState === 'ROUND_RESULTS' && (
        <RoundResults
          lastRoundResults={lastRoundResults}
          leaderboard={leaderboard}
          onSendReaction={actions.sendReaction}
          currentPlayer={currentPlayer}
          chatMessages={chatMessages}
          onSendMessage={actions.sendMessage}
          username={username}
          nextRoundCountdown={nextRoundCountdown}
          gameState={gameState}
          isHost={isHost}
          actions={actions}
        />
      )}

      {gameState === 'FINISHED' && (
        <GameFinished leaderboard={leaderboard} />
      )}
    </div>
  );
}