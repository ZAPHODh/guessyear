"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMultiplayerLobby } from '@/hooks/use-multiplayer-lobby';
import { useOptimisticState } from '@/hooks/use-optimistic-state';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/kibo-ui/status';
import { AnonymousProfileDialog } from './anonymous-profile-dialog';
import { LobbyChat } from './lobby-chat';
import { PlayerSpots } from './player-spots';
import { PlayerList } from './player-list';
import { GameView } from './game-view';
import { ResultsView } from './results-view';
import { ShareDrawer } from '../shared/share-drawer';
import { ConnectionIndicator } from './connection-indicator';
import { toast } from 'sonner';
import { updateLobby } from '@/app/[locale]/(game)/lobby/actions';
import { updateUserProfile } from '@/app/[locale]/actions';
import {
  Users,
  Clock,
  Settings
} from 'lucide-react';
import type { Lobby, User, LobbyUpdateSettings, LobbyActions, Player, RoundData, ChatMessage, Guess } from '@/lib/types/lobby';

interface LobbyRoomProps {
  lobby: Lobby;
  user: User | null;
  sessionId?: string;
}

function GameSettingsDrawer({ lobby, onUpdateSettings }: { lobby: Lobby; onUpdateSettings: (settings: LobbyUpdateSettings) => void }) {
  const t = useScopedI18n('lobby');
  const [open, setOpen] = useState(false);
  const [gameMode, setGameMode] = useState<'CLASSIC' | 'ELIMINATION' | 'MARATHON'>(lobby.gameMode);
  const [roundTimer, setRoundTimer] = useState(lobby.roundTimer.toString());
  const [rounds, setRounds] = useState(lobby.rounds.toString());
  const [hintsEnabled, setHintsEnabled] = useState(lobby.hintsEnabled);
  const [maxPlayers, setMaxPlayers] = useState(lobby.maxPlayers.toString());

  useEffect(() => {
    setGameMode(lobby.gameMode);
    setRoundTimer(lobby.roundTimer.toString());
    setRounds(lobby.rounds.toString());
    setHintsEnabled(lobby.hintsEnabled);
    setMaxPlayers(lobby.maxPlayers.toString());
  }, [lobby]);

  const handleUpdateSettings = () => {
    onUpdateSettings({
      gameMode,
      roundTimer: parseInt(roundTimer),
      rounds: parseInt(rounds),
      hintsEnabled,
      maxPlayers: parseInt(maxPlayers)
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          {t('room.settings')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>
              {t('room.gameSettings.title')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-6">
            <div className="flex-col gap-6 mb-6">
              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.gameMode')}</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as 'CLASSIC' | 'ELIMINATION' | 'MARATHON')}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLASSIC">{t('lobby.gameMode.classic')}</SelectItem>
                    <SelectItem value="ELIMINATION">{t('lobby.gameMode.elimination')}</SelectItem>
                    <SelectItem value="MARATHON">{t('lobby.gameMode.marathon')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.maxPlayers')}</label>
                <Select value={maxPlayers} onValueChange={setMaxPlayers}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">{t('room.gameSettings.options.players2')}</SelectItem>
                    <SelectItem value="4">{t('room.gameSettings.options.players4')}</SelectItem>
                    <SelectItem value="6">{t('room.gameSettings.options.players6')}</SelectItem>
                    <SelectItem value="8">{t('room.gameSettings.options.players8')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.roundTimer')}</label>
                <Select value={roundTimer} onValueChange={setRoundTimer}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">{t('room.gameSettings.options.timer30')}</SelectItem>
                    <SelectItem value="60">{t('room.gameSettings.options.timer60')}</SelectItem>
                    <SelectItem value="90">{t('room.gameSettings.options.timer90')}</SelectItem>
                    <SelectItem value="120">{t('room.gameSettings.options.timer120')}</SelectItem>
                    <SelectItem value="180">{t('room.gameSettings.options.timer180')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t('room.gameSettings.rounds')}</label>
                <Select value={rounds} onValueChange={setRounds}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{t('room.gameSettings.options.rounds3')}</SelectItem>
                    <SelectItem value="5">{t('room.gameSettings.options.rounds5')}</SelectItem>
                    <SelectItem value="8">{t('room.gameSettings.options.rounds8')}</SelectItem>
                    <SelectItem value="10">{t('room.gameSettings.options.rounds10')}</SelectItem>
                    <SelectItem value="15">{t('room.gameSettings.options.rounds15')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-medium">{t('room.gameSettings.hintsEnabled')}</label>
              <Button
                variant={hintsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setHintsEnabled(!hintsEnabled)}
              >
                {hintsEnabled ? t('room.gameSettings.on') : t('room.gameSettings.off')}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                {t('room.gameSettings.cancel')}
              </Button>
              <Button onClick={handleUpdateSettings} className="flex-1">
                {t('room.gameSettings.updateSettings')}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface WaitingRoomProps {
  lobby: Lobby;
  players: Player[];
  currentPlayer: Player | undefined;
  gameState: string;
  countdown: number | null;
  isHost: boolean;
  onReady: () => void;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  isConnected: boolean;
  actions: LobbyActions;
  optimisticReady: boolean;
  gameFinished?: boolean;
  leaderboard?: Player[];
}

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
  actions,
  optimisticReady,
  gameFinished = false,
  leaderboard = []
}: WaitingRoomProps) {
  const t = useScopedI18n('lobby');
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Status status={isConnected ? 'online' : 'offline'}>
              <StatusIndicator />
              <StatusLabel>
                {isConnected ? t('room.connected') : t('room.disconnected')}
              </StatusLabel>
            </Status>
            <ConnectionIndicator />
          </div>
          <div className="flex items-center gap-2">
            {isHost && (
              <GameSettingsDrawer
                lobby={lobby}
                onUpdateSettings={actions.updateLobbySettings}
              />
            )}
            <ShareDrawer
              title={t('room.invite.title')}
              description={t('room.invite.description')}
              shareText={t('room.invite.shareText', { lobbyName: lobby.name })}
              url={inviteUrl}
              buttonText={t('room.inviteButton')}
              buttonVariant="outline"
              buttonSize="sm"
            />
          </div>
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
            <span>{t('lobby.playersCount', { current: players.length, max: lobby.maxPlayers })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{t('lobby.roundTimer', { seconds: lobby.roundTimer })}</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {t(`lobby.gameMode.${lobby.gameMode.toLowerCase()}` as any)}
          </Badge>
          {lobby.hintsEnabled && (
            <Badge variant="outline">{t('lobby.hintsEnabled')}</Badge>
          )}
        </div>
      </div>

      {gameFinished && isHost && (
        <div className="flex justify-center mb-6">
          <Button
            onClick={actions.restartGame}
            size="lg"
            className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg"
          >
            🎮 {t('room.playAgain')}
          </Button>
        </div>
      )}

      <PlayerSpots
        players={players}
        maxPlayers={lobby.maxPlayers}
        currentPlayer={currentPlayer}
        onToggleReady={onReady}
        gameState={gameState}
        isHost={isHost}
        onKickPlayer={actions.kickPlayer}
        onTransferHost={actions.transferHost}
        optimisticReady={optimisticReady}
      />

      {gameState === 'STARTING' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-white">{t('room.gameStarting')}</h3>
            <div className="text-8xl font-bold text-white mb-4">
              {countdown || 0}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
          gameFinished={gameFinished}
          leaderboard={leaderboard}
        />
      </div>
    </div>
  );
}

interface GameInProgressProps {
  currentRound: RoundData | null;
  timeRemaining: number;
  guess: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: () => void;
  hasSubmittedGuess: boolean;
  lobbyTimer: number;
  players: Player[];
  leaderboard: Player[];
  currentPlayer: Player | undefined;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  gameState: string;
  isHost: boolean;
  actions: LobbyActions;
  lastRoundResults?: {
    correctYear: number;
    guesses: Guess[];
  } | null;
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
  leaderboard,
  currentPlayer,
  chatMessages,
  onSendMessage,
  username,
  gameState,
  isHost,
  actions,
  lastRoundResults
}: GameInProgressProps) {
  const t = useScopedI18n('lobby');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-4 lg:gap-6">
      <div className="min-w-0">
        {currentRound && (
          <GameView
            round={currentRound}
            timeRemaining={timeRemaining}
            guess={guess}
            onGuessChange={onGuessChange}
            onSubmitGuess={onSubmitGuess}
            hasSubmittedGuess={hasSubmittedGuess}
            lobbyTimer={lobbyTimer}
            players={leaderboard.length > 0 ? leaderboard : players}
            currentPlayer={currentPlayer}
          />
        )}
      </div>
      <div className="hidden lg:flex lg:flex-col space-y-4 min-w-0">
        <PlayerList
          players={leaderboard.length > 0 ? leaderboard : players}
          currentPlayer={currentPlayer}
          gameState={gameState}
          showScores
          isHost={isHost}
          onKickPlayer={actions.kickPlayer}
          onTransferHost={actions.transferHost}
          title={t('players.title')}
          compact
        />
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
          lastRoundResults={lastRoundResults}
        />
      </div>
      <div className="lg:hidden space-y-3">
        <LobbyChat
          messages={chatMessages}
          onSendMessage={onSendMessage}
          currentUsername={username}
          compact
          lastRoundResults={lastRoundResults}
        />
      </div>
    </div>
  );
}

interface RoundResultsProps {
  lastRoundResults: {
    correctYear: number;
    guesses: Guess[];
  } | null;
  leaderboard: Player[];
  onSendReaction: (emoji: string, targetType: string, targetId?: string, roundId?: string) => void;
  currentPlayer: Player | undefined;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string, type?: 'CHAT' | 'QUICK_PHRASE') => void;
  username: string;
  nextRoundCountdown?: number | null;
  gameState: string;
  isHost: boolean;
  actions: LobbyActions;
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
}: RoundResultsProps) {
  const t = useScopedI18n('lobby');
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
        <PlayerList
          players={leaderboard}
          currentPlayer={currentPlayer}
          gameState={gameState}
          showScores
          isHost={isHost}
          onKickPlayer={actions.kickPlayer}
          onTransferHost={actions.transferHost}
          title={t('players.leaderboard')}
          compact
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

interface GameFinishedProps {
  leaderboard: Player[];
  isHost: boolean;
  onRestartGame: () => void;
}

function GameFinished({
  leaderboard,
  isHost,
  onRestartGame
}: GameFinishedProps) {
  const t = useScopedI18n('lobby');
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t('game.finished.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">{t('game.finished.finalResults')}</h3>
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold">
                      {t('game.finished.position', { position: index + 1 })}
                    </div>
                    <div>
                      <div className="font-medium">{player.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('game.finished.streak', { streak: player.streak })}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {t('game.finished.score', { score: player.score })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        {isHost && (
          <Button onClick={onRestartGame} className="gap-2">
            {t('room.playAgain')}
          </Button>
        )}
        <Button variant="outline" onClick={() => window.location.href = '/lobby'}>
          {t('backToLobbies')}
        </Button>
      </div>
    </div>
  );
}

export function LobbyRoom({ lobby, user: initialUser, sessionId }: LobbyRoomProps) {
  const t = useScopedI18n('lobby');
  const [guess, setGuess] = useState('');
  const [user, setUser] = useState(initialUser); // Local user state that can be updated
  const [showProfileDialog, setShowProfileDialog] = useState(!user || !user.name);
  const [anonymousProfile, setAnonymousProfile] = useState({
    name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
    avatar: user?.picture || ''
  });
  const [isProfileSet, setIsProfileSet] = useState(!!user?.name);
  const username = anonymousProfile.name;
  const router = useRouter();

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
    userId: user?.id ?? null,
    sessionId: sessionId ?? null,
    username,
    avatar: anonymousProfile.avatar || username.charAt(0).toUpperCase(),
    enabled: isProfileSet // Only connect when profile is set
  });

  const isHost = !!(user && lobby.hostUserId === user.id);
  const currentPlayer = players.find(p =>
    (user && p.userId === user.id) || (!user && p.sessionId === sessionId)
  );

  // Optimistic ready state
  const {
    value: optimisticReady,
    setOptimistic: setOptimisticReady,
    confirmOptimistic: confirmOptimisticReady,
    setServer: setServerReady
  } = useOptimisticState(currentPlayer?.isReady ?? false);

  useEffect(() => {
    if (currentRound && gameState === 'PLAYING' && !hasSubmittedGuess) {
      setGuess('');
    }
  }, [currentRound?.roundNumber, gameState, hasSubmittedGuess]);

  // Update optimistic state when actual state changes
  useEffect(() => {
    if (currentPlayer?.isReady !== undefined) {
      setServerReady(currentPlayer.isReady);
    }
  }, [currentPlayer?.isReady, setServerReady]);

  const handleReady = () => {
    if (currentPlayer) {
      const newReadyState = !optimisticReady;
      const updateId = `ready_${currentPlayer.id}_${Date.now()}`;
      setOptimisticReady(updateId, newReadyState);
      actions.toggleReady(newReadyState);
    }
  };


  const handleSubmitGuess = () => {
    const year = parseInt(guess);
    if (isNaN(year) || year < 1800 || year > 2030) {
      toast.error(t('errors.invalidYear'));
      return;
    }
    actions.submitGuess(year);
    setGuess('');
  };

  const handleSaveAnonymousProfile = async (profile: { name: string; avatar?: string }) => {
    try {
      // For logged-in users, update their profile in the database
      if (user) {
        const result = await updateUserProfile({
          name: profile.name,
          picture: profile.avatar
        });

        if (result?.data?.success) {
          // Update local user state
          setUser({
            ...user,
            name: profile.name,
            picture: profile.avatar || null
          });

          // Update local state with the saved profile
          setAnonymousProfile({
            name: profile.name,
            avatar: profile.avatar || ''
          });
          toast.success('Profile updated successfully!');
        } else {
          toast.error('Failed to update profile');
          return;
        }
      } else {
        // For anonymous users, just update local state
        setAnonymousProfile({
          name: profile.name,
          avatar: profile.avatar || ''
        });
      }

      setIsProfileSet(true);
      setShowProfileDialog(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };


  useEffect(() => {
    if (error) {
      toast.error(`${t('errors.connectionFailed')}: ${error}`);
      router.push('/lobby');
    }
  }, [error, router, t]);

  return (
    <div className="container mx-auto px-3 py-4 lg:px-4 lg:py-8 max-w-7xl">
      {/* Show loading state when profile dialog is open */}
      {showProfileDialog && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">{t('room.setProfile')}</h2>
            <p className="text-muted-foreground">
              {user ? t('room.setProfileLoggedIn') : t('room.setProfileAnonymous')}
            </p>
          </div>
        </div>
      )}

      {/* Show game content only when profile is set */}
      {!showProfileDialog && (
        <>
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
              optimisticReady={optimisticReady}
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
              leaderboard={leaderboard}
              currentPlayer={currentPlayer}
              chatMessages={chatMessages}
              onSendMessage={actions.sendMessage}
              username={username}
              gameState={gameState}
              isHost={isHost}
              actions={actions}
              lastRoundResults={lastRoundResults}
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
              optimisticReady={optimisticReady}
              gameFinished={true}
              leaderboard={leaderboard}
            />
          )}
        </>
      )}

      {/* Anonymous Profile Dialog */}
      <AnonymousProfileDialog
        open={showProfileDialog}
        onSave={handleSaveAnonymousProfile}
        defaultName={anonymousProfile.name}
      />
    </div>
  );
}