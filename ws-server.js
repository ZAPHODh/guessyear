const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();
const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/api/socket',
  transports: ['websocket', 'polling']
});

// Store active lobbies and timers
const activeLobbies = new Map();
const roundTimers = new Map();

// Utility functions
const calculatePoints = (guess, correctYear, roundStartTime, hintsGiven = 0) => {
  const yearDiff = Math.abs(guess - correctYear);
  let basePoints = Math.max(0, 100 - yearDiff);

  // Speed bonus (0-20 points based on response time)
  const responseTime = Date.now() - roundStartTime;
  const maxResponseTime = 60000; // 60 seconds
  const speedBonus = Math.max(0, 20 - Math.floor((responseTime / maxResponseTime) * 20));

  // Hint penalty
  const hintPenalty = hintsGiven * 5;

  return {
    points: Math.max(0, basePoints + speedBonus - hintPenalty),
    speedBonus,
    accuracy: yearDiff
  };
};

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const broadcastToLobby = (lobbyId, event, data) => {
  io.to(`lobby_${lobbyId}`).emit(event, data);
};

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join lobby
  socket.on('join_lobby', async (data) => {
    try {
      const { lobbyId, userId, sessionId, username } = data;

      const lobby = await prisma.lobby.findUnique({
        where: { id: lobbyId },
        include: {
          players: {
            include: { user: true }
          },
          host: true
        }
      });

      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      if (lobby.status === 'PLAYING') {
        socket.emit('error', { message: 'Game already in progress' });
        return;
      }

      if (lobby.players.length >= lobby.maxPlayers) {
        socket.emit('error', { message: 'Lobby is full' });
        return;
      }

      // Check if player already exists
      const existingPlayer = lobby.players.find(p =>
        (userId && p.userId === userId) || (sessionId && p.sessionId === sessionId)
      );

      let player;
      if (existingPlayer) {
        player = existingPlayer;
      } else {
        player = await prisma.lobbyPlayer.create({
          data: {
            lobbyId,
            userId,
            sessionId,
            username,
            avatar: data.avatar || '🎮'
          },
          include: { user: true }
        });
      }

      socket.join(`lobby_${lobbyId}`);
      socket.lobbyId = lobbyId;
      socket.playerId = player.id;
      socket.userId = userId; // Set userId for host checks

      // Send lobby state to new player
      const updatedLobby = await getLobbyState(lobbyId);
      socket.emit('lobby_joined', updatedLobby);

      // Notify other players
      broadcastToLobby(lobbyId, 'player_joined', {
        player: {
          id: player.id,
          username: player.username,
          avatar: player.avatar,
          isReady: player.isReady
        }
      });

      // Send system message
      await createSystemMessage(lobbyId, `${username} joined the game`);

    } catch (error) {
      console.error('Error joining lobby:', error);
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  });

  // Leave lobby
  socket.on('leave_lobby', async () => {
    try {
      if (socket.lobbyId && socket.playerId) {
        const player = await prisma.lobbyPlayer.findUnique({
          where: { id: socket.playerId }
        });

        if (player) {
          await prisma.lobbyPlayer.delete({
            where: { id: socket.playerId }
          });

          broadcastToLobby(socket.lobbyId, 'player_left', {
            playerId: socket.playerId,
            username: player.username
          });

          await createSystemMessage(socket.lobbyId, `${player.username} left the game`);
        }

        socket.leave(`lobby_${socket.lobbyId}`);
        socket.lobbyId = null;
        socket.playerId = null;
      }
    } catch (error) {
      console.error('Error leaving lobby:', error);
    }
  });

  // Player ready/unready
  socket.on('player_ready', async (data) => {
    try {
      const { isReady } = data;

      await prisma.lobbyPlayer.update({
        where: { id: socket.playerId },
        data: { isReady }
      });

      broadcastToLobby(socket.lobbyId, 'player_ready_changed', {
        playerId: socket.playerId,
        isReady
      });

      // Check if all players are ready
      const lobby = await prisma.lobby.findUnique({
        where: { id: socket.lobbyId },
        include: { players: true }
      });

      console.log('Checking auto start conditions:', {
        totalPlayers: lobby.players.length,
        activePlayers: lobby.players.filter(p => !p.isEliminated).length,
        playersReady: lobby.players.map(p => ({ username: p.username, isReady: p.isReady, isEliminated: p.isEliminated })),
        lobbyStatus: lobby.status
      });

      // Only count non-eliminated players for ready check
      const activePlayers = lobby.players.filter(p => !p.isEliminated);
      const allReady = activePlayers.length >= 2 && activePlayers.every(p => p.isReady);
      console.log('All players ready:', allReady);

      if (allReady && lobby.status === 'WAITING') {
        console.log('Starting game countdown for lobby:', socket.lobbyId);
        // Start game countdown
        broadcastToLobby(socket.lobbyId, 'game_starting', { countdown: 5 });
        setTimeout(() => startGame(socket.lobbyId), 5000);
      }

    } catch (error) {
      console.error('Error updating ready status:', error);
    }
  });

  // Start game (host only)
  socket.on('start_game', async () => {
    try {
      const lobby = await prisma.lobby.findUnique({
        where: { id: socket.lobbyId },
        include: { players: true }
      });

      if (lobby.hostUserId !== socket.userId && lobby.host.id !== socket.userId) {
        socket.emit('error', { message: 'Only host can start the game' });
        return;
      }

      if (lobby.players.length < 2) {
        socket.emit('error', { message: 'Need at least 2 players to start' });
        return;
      }

      await startGame(socket.lobbyId);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  });

  // Submit guess
  socket.on('submit_guess', async (data) => {
    try {
      const { year } = data;

      const round = await prisma.multiplayerGameRound.findFirst({
        where: {
          lobbyId: socket.lobbyId,
          status: 'ACTIVE'
        },
        include: { image: true }
      });

      if (!round) {
        socket.emit('error', { message: 'No active round' });
        return;
      }

      // Check if player already guessed
      const existingGuess = await prisma.multiplayerGuess.findUnique({
        where: {
          roundId_playerId: {
            roundId: round.id,
            playerId: socket.playerId
          }
        }
      });

      if (existingGuess) {
        socket.emit('error', { message: 'Already submitted guess for this round' });
        return;
      }

      const pointsData = calculatePoints(year, round.image.year, round.startedAt.getTime());

      await prisma.multiplayerGuess.create({
        data: {
          roundId: round.id,
          playerId: socket.playerId,
          year,
          points: pointsData.points,
          speedBonus: pointsData.speedBonus,
          accuracy: pointsData.accuracy
        }
      });

      socket.emit('guess_submitted', { success: true });

      // Check if all players have guessed
      const allGuesses = await prisma.multiplayerGuess.findMany({
        where: { roundId: round.id },
        include: { player: true }
      });

      const activePlayers = await prisma.lobbyPlayer.findMany({
        where: {
          lobbyId: socket.lobbyId,
          isEliminated: false
        }
      });

      if (allGuesses.length === activePlayers.length) {
        await endRound(socket.lobbyId, round.id);
      }

    } catch (error) {
      console.error('Error submitting guess:', error);
    }
  });

  // Chat message
  socket.on('send_message', async (data) => {
    try {
      const { message, type = 'CHAT' } = data;

      const player = await prisma.lobbyPlayer.findUnique({
        where: { id: socket.playerId }
      });

      const chatMessage = await prisma.lobbyMessage.create({
        data: {
          lobbyId: socket.lobbyId,
          playerId: socket.playerId,
          username: player.username,
          message,
          type
        }
      });

      broadcastToLobby(socket.lobbyId, 'new_message', chatMessage);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Reaction
  socket.on('send_reaction', async (data) => {
    try {
      const { emoji, targetType, targetId, roundId } = data;

      await prisma.lobbyReaction.create({
        data: {
          lobbyId: socket.lobbyId,
          playerId: socket.playerId,
          roundId,
          emoji,
          targetType,
          targetId
        }
      });

      broadcastToLobby(socket.lobbyId, 'new_reaction', {
        playerId: socket.playerId,
        emoji,
        targetType,
        targetId,
        roundId
      });

    } catch (error) {
      console.error('Error sending reaction:', error);
    }
  });

  // Kick player (host only)
  socket.on('kick_player', async (data) => {
    try {
      const { playerId } = data;

      // Verify the requesting player is the host
      const lobby = await prisma.lobby.findUnique({
        where: { id: socket.lobbyId },
        include: { players: true }
      });

      if (!lobby || lobby.hostUserId !== socket.userId) {
        socket.emit('error', { message: 'Only the host can kick players' });
        return;
      }

      // Find the player to kick first
      const playerToKick = await prisma.lobbyPlayer.findUnique({
        where: { id: playerId },
        include: { user: true }
      });

      if (!playerToKick) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      if (playerToKick.lobbyId !== socket.lobbyId) {
        socket.emit('error', { message: 'Player is not in this lobby' });
        return;
      }

      // Remove the player from the lobby
      await prisma.lobbyPlayer.delete({
        where: { id: playerId }
      });

      // Create system message
      await createSystemMessage(socket.lobbyId, `${playerToKick.username} was kicked from the lobby`);

      // Find the socket of the kicked player and disconnect them
      const sockets = await io.in(`lobby_${socket.lobbyId}`).fetchSockets();
      for (const playerSocket of sockets) {
        if (playerSocket.playerId === playerId) {
          playerSocket.leave(`lobby_${socket.lobbyId}`);
          playerSocket.emit('error', { message: 'You have been kicked from the lobby' });
          break;
        }
      }

      // Notify all players in the lobby
      broadcastToLobby(socket.lobbyId, 'player_left', {
        playerId: playerId,
        username: playerToKick.username
      });

    } catch (error) {
      console.error('Error kicking player:', error);
      socket.emit('error', { message: 'Failed to kick player' });
    }
  });

  // Transfer host (host only)
  socket.on('transfer_host', async (data) => {
    try {
      const { playerId } = data;

      // Verify the requesting player is the current host
      const lobby = await prisma.lobby.findUnique({
        where: { id: socket.lobbyId },
        include: { players: true }
      });

      if (!lobby || lobby.hostUserId !== socket.userId) {
        socket.emit('error', { message: 'Only the host can transfer ownership' });
        return;
      }

      // Find the target player
      const targetPlayer = await prisma.lobbyPlayer.findUnique({
        where: { id: playerId }
      });

      if (!targetPlayer || !targetPlayer.userId) {
        socket.emit('error', { message: 'Target player not found or is a guest' });
        return;
      }

      // Update the lobby host
      await prisma.lobby.update({
        where: { id: socket.lobbyId },
        data: { hostUserId: targetPlayer.userId }
      });

      // Broadcast the host change to all players
      broadcastToLobby(socket.lobbyId, 'host_transferred', {
        newHostUserId: targetPlayer.userId,
        newHostPlayerId: playerId
      });

    } catch (error) {
      console.error('Error transferring host:', error);
      socket.emit('error', { message: 'Failed to transfer host' });
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);

    try {
      if (socket.lobbyId && socket.playerId) {
        const player = await prisma.lobbyPlayer.findUnique({
          where: { id: socket.playerId }
        });

        if (player) {
          // Remove player from lobby
          await prisma.lobbyPlayer.delete({
            where: { id: socket.playerId }
          });

          // Broadcast to remaining players
          broadcastToLobby(socket.lobbyId, 'player_left', {
            playerId: socket.playerId,
            username: player.username
          });

          await createSystemMessage(socket.lobbyId, `${player.username} disconnected`);

          // Check if lobby should be ended due to insufficient players
          await checkLobbyState(socket.lobbyId);
        }
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// Game logic functions
const startGame = async (lobbyId) => {
  try {
    await prisma.lobby.update({
      where: { id: lobbyId },
      data: {
        status: 'PLAYING',
        currentRound: 1
      }
    });

    await createSystemMessage(lobbyId, 'Game started! Get ready for the first round.');

    broadcastToLobby(lobbyId, 'game_started');

    // Start first round
    setTimeout(() => startRound(lobbyId, 1), 2000);

  } catch (error) {
    console.error('Error starting game:', error);
  }
};

const startRound = async (lobbyId, roundNumber) => {
  try {
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId }
    });

    // Get images already used in this lobby to avoid repetition
    const usedImageIds = await prisma.multiplayerGameRound.findMany({
      where: { lobbyId },
      select: { imageId: true }
    }).then(rounds => rounds.map(round => round.imageId));

    // Get available images (excluding used ones if any)
    const whereClause = usedImageIds.length > 0 ? { id: { notIn: usedImageIds } } : {};

    // Count available images
    const availableCount = await prisma.dailyImage.count({ where: whereClause });

    // If no available images (used all), reset and use any image
    let randomImage;
    if (availableCount === 0) {
      const totalCount = await prisma.dailyImage.count();
      randomImage = await prisma.dailyImage.findFirst({
        skip: Math.floor(Math.random() * totalCount)
      });
    } else {
      // Get a random unused image
      randomImage = await prisma.dailyImage.findFirst({
        where: whereClause,
        skip: Math.floor(Math.random() * availableCount)
      });
    }

    // Safety check: ensure we have a valid image
    if (!randomImage) {
      console.error('No image found for round:', lobbyId, roundNumber);
      throw new Error('No images available for the game');
    }

    console.log(`Round ${roundNumber} for lobby ${lobbyId}: Using image ${randomImage.id}`);

    const round = await prisma.multiplayerGameRound.create({
      data: {
        lobbyId,
        roundNumber,
        imageId: randomImage.id,
        status: 'ACTIVE',
        startedAt: new Date(),
        timerEndsAt: new Date(Date.now() + lobby.roundTimer * 1000)
      },
      include: { image: true }
    });

    broadcastToLobby(lobbyId, 'round_started', {
      roundNumber,
      image: {
        url: round.image.cloudinaryUrl,
        description: round.image.description
      },
      timer: lobby.roundTimer,
      hintsEnabled: lobby.hintsEnabled
    });

    // Set round timer
    const timerId = setTimeout(() => {
      endRound(lobbyId, round.id);
    }, lobby.roundTimer * 1000);

    roundTimers.set(round.id, timerId);

    // Optional hints
    if (lobby.hintsEnabled) {
      setTimeout(() => {
        const hint = round.image.tip ? JSON.parse(round.image.tip) : null;
        if (hint) {
          broadcastToLobby(lobbyId, 'hint_available', { hint });
        }
      }, (lobby.roundTimer * 1000) / 2); // Hint at halfway point
    }

  } catch (error) {
    console.error('Error starting round:', error);
  }
};

const endRound = async (lobbyId, roundId) => {
  try {
    const timer = roundTimers.get(roundId);
    if (timer) {
      clearTimeout(timer);
      roundTimers.delete(roundId);
    }

    await prisma.multiplayerGameRound.update({
      where: { id: roundId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date()
      }
    });

    const round = await prisma.multiplayerGameRound.findUnique({
      where: { id: roundId },
      include: {
        image: true,
        guesses: {
          include: { player: true }
        }
      }
    });

    // Update player scores and streaks
    for (const guess of round.guesses) {
      const isAccurate = guess.accuracy <= 5; // Within 5 years is considered accurate

      await prisma.lobbyPlayer.update({
        where: { id: guess.playerId },
        data: {
          score: { increment: guess.points + guess.speedBonus },
          streak: isAccurate ? { increment: 1 } : 0
        }
      });
    }

    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: { players: { orderBy: { score: 'desc' } } }
    });

    // Handle elimination mode
    if (lobby.gameMode === 'ELIMINATION' && round.guesses.length > 1) {
      const worstGuess = round.guesses.reduce((worst, current) =>
        current.accuracy > worst.accuracy ? current : worst
      );

      await prisma.lobbyPlayer.update({
        where: { id: worstGuess.playerId },
        data: { isEliminated: true }
      });
    }

    // Check if game should continue
    const activePlayers = lobby.players.filter(p => !p.isEliminated);
    const shouldContinue =
      (lobby.gameMode === 'CLASSIC' && lobby.currentRound < lobby.rounds) ||
      (lobby.gameMode === 'ELIMINATION' && activePlayers.length > 1) ||
      (lobby.gameMode === 'MARATHON' && !lobby.players.some(p => p.score >= lobby.targetScore));

    broadcastToLobby(lobbyId, 'round_ended', {
      correctYear: round.image.year,
      guesses: round.guesses.map(g => ({
        player: g.player.username,
        year: g.year,
        points: g.points,
        speedBonus: g.speedBonus,
        accuracy: g.accuracy
      })),
      leaderboard: lobby.players.map(p => ({
        username: p.username,
        score: p.score,
        streak: p.streak,
        isEliminated: p.isEliminated
      })),
      nextRoundCountdown: shouldContinue ? lobby.betweenRoundsTimer : null
    });

    if (shouldContinue) {
      await prisma.lobby.update({
        where: { id: lobbyId },
        data: { currentRound: { increment: 1 } }
      });

      setTimeout(() => startRound(lobbyId, lobby.currentRound + 1), lobby.betweenRoundsTimer * 1000);
    } else {
      await endGame(lobbyId);
    }

  } catch (error) {
    console.error('Error ending round:', error);
  }
};

const endGame = async (lobbyId) => {
  try {
    await prisma.lobby.update({
      where: { id: lobbyId },
      data: { status: 'FINISHED' }
    });

    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        players: {
          orderBy: { score: 'desc' }
        }
      }
    });

    broadcastToLobby(lobbyId, 'game_ended', {
      finalLeaderboard: lobby.players.map((p, index) => ({
        position: index + 1,
        username: p.username,
        score: p.score,
        streak: p.streak
      }))
    });

    await createSystemMessage(lobbyId, `Game finished! Winner: ${lobby.players[0]?.username || 'Unknown'}`);

  } catch (error) {
    console.error('Error ending game:', error);
  }
};

const getLobbyState = async (lobbyId) => {
  const lobby = await prisma.lobby.findUnique({
    where: { id: lobbyId },
    include: {
      players: {
        include: { user: true }
      },
      host: true,
      chatMessages: {
        orderBy: { createdAt: 'asc' },
        take: 50
      }
    }
  });

  // Transform players to include required fields for frontend
  if (lobby) {
    lobby.players = lobby.players.map(player => ({
      id: player.id,
      userId: player.userId,
      sessionId: player.sessionId,
      username: player.username,
      avatar: player.avatar,
      score: player.score,
      isReady: player.isReady,
      isEliminated: player.isEliminated,
      streak: player.streak
    }));
  }

  return lobby;
};

const createSystemMessage = async (lobbyId, message) => {
  return await prisma.lobbyMessage.create({
    data: {
      lobbyId,
      username: 'System',
      message,
      type: 'SYSTEM'
    }
  });
};

const checkLobbyState = async (lobbyId) => {
  try {
    const lobby = await prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        players: true,
        host: true
      }
    });

    if (!lobby) return;

    // If lobby has no players, end it
    if (lobby.players.length === 0) {
      await prisma.lobby.update({
        where: { id: lobbyId },
        data: { status: 'FINISHED' }
      });

      console.log(`Ended empty lobby: ${lobbyId}`);
      return;
    }

    // If only 1 player left and game is in progress, end the game
    if (lobby.players.length === 1 && lobby.status === 'PLAYING') {
      await endGame(lobbyId);
      await createSystemMessage(lobbyId, 'Game ended - not enough players remaining');
      return;
    }

    // If host left and lobby is waiting, transfer host to first player
    const hostStillInLobby = lobby.players.some(p => p.userId === lobby.hostUserId);
    if (!hostStillInLobby && lobby.status === 'WAITING' && lobby.players.length > 0) {
      const newHost = lobby.players[0];

      await prisma.lobby.update({
        where: { id: lobbyId },
        data: { hostUserId: newHost.userId || 'anonymous' }
      });

      // Update new host's avatar to crown
      await prisma.lobbyPlayer.update({
        where: { id: newHost.id },
        data: { avatar: '👑' }
      });

      broadcastToLobby(lobbyId, 'host_changed', {
        newHostId: newHost.id,
        newHostUsername: newHost.username
      });

      await createSystemMessage(lobbyId, `${newHost.username} is now the host`);
    }
  } catch (error) {
    console.error('Error checking lobby state:', error);
  }
};

// Cleanup function to run periodically
const cleanupAbandonedLobbies = async () => {
  try {
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

    // Find lobbies that haven't been updated recently and have no players
    const abandonedLobbies = await prisma.lobby.findMany({
      where: {
        updatedAt: { lt: cutoffTime },
        status: { not: 'FINISHED' }
      },
      include: {
        players: true
      }
    });

    for (const lobby of abandonedLobbies) {
      if (lobby.players.length === 0) {
        await prisma.lobby.update({
          where: { id: lobby.id },
          data: { status: 'FINISHED' }
        });
        console.log(`Cleaned up abandoned lobby: ${lobby.id}`);
      }
    }

    // Also clean up very old finished lobbies (older than 24 hours)
    const veryOldCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deletedCount = await prisma.lobby.deleteMany({
      where: {
        status: 'FINISHED',
        updatedAt: { lt: veryOldCutoff }
      }
    });

    if (deletedCount.count > 0) {
      console.log(`Deleted ${deletedCount.count} old finished lobbies`);
    }
  } catch (error) {
    console.error('Error during lobby cleanup:', error);
  }
};

const PORT = process.env.WS_PORT || 3001;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);

  // Run cleanup immediately on startup
  cleanupAbandonedLobbies();

  // Run cleanup every 10 minutes
  setInterval(cleanupAbandonedLobbies, 10 * 60 * 1000);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down WebSocket server...');
  await prisma.$disconnect();
  server.close();
});