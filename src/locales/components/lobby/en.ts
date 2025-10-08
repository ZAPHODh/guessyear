export default {
  // Page titles and navigation
  title: "Multiplayer Lobbies",
  pageDescription: "Join or create a lobby to play with friends and compete in real-time guessing games",
  createLobby: "Create Lobby",
  joinLobby: "Join Lobby",
  quickMatch: "Quick Match",
  backToLobbies: "Back to Lobbies",

  // Lobby browser
  browser: {
    searchPlaceholder: "Search lobbies...",
    filters: {
      all: "All",
      waiting: "Waiting",
      playing: "Playing",
      public: "Public"
    } as const,
    noLobbies: "No active lobbies",
    noLobbiesFiltered: "No lobbies found matching your criteria",
    refresh: "Refresh",
    loading: "Loading...",
    createdDate: "Created {date}",
    hostBy: "Host: {name}",
    hostAnonymous: "Host: Anonymous"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} players",
    roundTimer: "{seconds}s per round",
    rounds: "{count} rounds",
    targetScore: "{score} pts",
    hintsEnabled: "Hints enabled",
    gameMode: {
      classic: "Classic",
      elimination: "Elimination",
      marathon: "Marathon"
    } as const,
    status: {
      waiting: "waiting",
      playing: "playing",
      finished: "finished"
    } as const,
    actions: {
      join: "Join",
      spectate: "Spectate",
      full: "Full",
      private: "Private"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Connected",
    disconnected: "Disconnected",

    // Lobby info
    playersOnline: "{count} players online",
    gameStarting: "Game Starting...",
    starting: "Starting",

    // Player actions
    ready: "Ready",
    notReady: "Not Ready",
    toggleReady: "Toggle Ready",
    waitingForPlayers: "Waiting for other players...",

    // Host actions
    inviteButton: "Invite",
    settings: "Settings",
    startGame: "Start Game",
    playAgain: "🔄 Play Again",

    // Profile setup
    setProfile: "Set Your Profile",
    setProfileLoggedIn: "Please set your display name to join the lobby",
    setProfileAnonymous: "Please set your display name and avatar to join the lobby",

    // Game settings
    gameSettings: {
      title: "Game Settings",
      gameMode: "Game Mode",
      maxPlayers: "Max Players",
      roundTimer: "Round Timer",
      rounds: "Rounds",
      hintsEnabled: "Hints Enabled",
      on: "ON",
      off: "OFF",
      cancel: "Cancel",
      updateSettings: "Update Settings",
      settingsUpdated: "Game settings updated!",
      options: {
        players2: "2 Players",
        players4: "4 Players",
        players6: "6 Players",
        players8: "8 Players",
        timer30: "30 seconds",
        timer60: "60 seconds",
        timer90: "90 seconds",
        timer120: "2 minutes",
        timer180: "3 minutes",
        rounds3: "3 rounds",
        rounds5: "5 rounds",
        rounds8: "8 rounds",
        rounds10: "10 rounds",
        rounds15: "15 rounds"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Invite Players",
      description: "Share this lobby with your friends!",
      shareText: "Join my multiplayer game: {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Round {number}",
    timeRemaining: "Time remaining",

    // Game prompt
    prompt: "When was this photo taken?",
    promptDescription: "Enter the year you think this photo was taken",
    yearPlaceholder: "Enter year (e.g., 1995)",
    submit: "Submit",

    // Game status
    submitted: "Guess submitted: {year}",
    waitingForOthers: "Waiting for other players...",
    imageLoadFailed: "Failed to load image",

    // Results
    results: {
      title: "Round Results",
      correctYear: "Correct year: {year}",
      yourGuess: "Your guess: {year}",
      points: "{points} points",
      accuracy: "{years} years off",
      speedBonus: "+{bonus} speed bonus",
      nextRound: "Next round in {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "Game Finished!",
      finalResults: "Final Results",
      position: "#{position}",
      score: "{score} pts",
      streak: "{streak} streak"
    } as const
  } as const,

  // Players section
  players: {
    title: "Players",
    leaderboard: "Leaderboard",
    eliminated: "Eliminated",
    waitingForMorePlayers: "Waiting for more players...",
    waitingForAllReady: "Waiting for all players to be ready...",
    allPlayersReady: "All players ready!",
    empty: "Empty",
    makeHost: "Host",
    owner: "Owner",
    you: "You",
    points: "{points} pts",
    ready: "Ready",
    waiting: "Waiting",
    readyQuestion: "Ready?"
  } as const,

  // Results section
  results: {
    title: "Round Results",
    correctYear: "Correct Year",
    bestGuess: "Best Guess",
    guessedYear: "Guessed {year}",
    nextRoundStarting: "Next Round Starting",
    viewPlayerGuesses: "View Player Guesses ({count})",
    playerGuessesTitle: "Player Guesses - Round Results",
    perfect: "Perfect! 🎯",
    yearOff: "{count} year off",
    yearsOff: "{count} years off",
    guessedLabel: "Guessed: {year}",
    points: "{points} pts",
    speedBonus: "+{bonus} speed bonus",
    badges: {
      fast: "Fast",
      accurate: "Accurate",
      perfect: "Perfect"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Create New Lobby",
    lobbyName: "Lobby Name",
    lobbyNamePlaceholder: "Epic Guessing Battle",
    description: "Description",
    descriptionPlaceholder: "Come join our friendly guessing game!",
    gameSettings: "Game Settings",
    maxPlayers: "Max Players",
    playersCount: "{count} players",
    roundTimer: "Round Timer (seconds)",
    gameMode: "Game Mode",
    gameModes: {
      classicDescription: "All players play all rounds",
      eliminationDescription: "Last place eliminated each round",
      marathonDescription: "Play until target score reached"
    } as const,
    numberOfRounds: "Number of Rounds",
    roundsCount: "{count} rounds",
    targetScore: "Target Score",
    advancedOptions: "Advanced Options",
    publicLobby: "Public Lobby",
    publicLobbyDescription: "Allow anyone to find and join this lobby",
    enableHints: "Enable Hints",
    enableHintsDescription: "Show optional hints during rounds",
    cancel: "Cancel",
    createButton: "Create Lobby",
    creating: "Creating...",
    success: "Lobby created successfully!",
    failed: "Failed to create lobby"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Type a message...",
    noMessages: "No messages yet",
    startConversation: "Start the conversation!",
    send: "Send",
    quickPhrases: "Quick Phrases",
    emojis: "Emojis",
    quick: "Quick",
    systemMessage: "System",
    scrollPaused: "Scroll paused",
    quickPhrasesList: [
      "Nice!",
      "Close!",
      "Wow!",
      "Very difficult",
      "Too easy",
      "GG!",
      "Let's go!",
      "Focus!"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Lobby not found",
    lobbyFull: "Lobby is full",
    gameInProgress: "Game already in progress",
    connectionFailed: "Failed to connect to lobby",
    invalidYear: "Please enter a valid year between 1800 and 2030",
    onlyHostCanStart: "Only the host can start the game",
    onlyHostCanRestart: "Only the host can restart the game",
    onlyHostCanKick: "Only the host can kick players",
    onlyHostCanTransfer: "Only the host can transfer ownership",
    onlyHostCanUpdateSettings: "Only the host can update lobby settings",
    needTwoPlayers: "Need at least 2 players to start",
    alreadyGuessed: "Already submitted guess for this round",
    cannotUpdateDuringGame: "Cannot update settings during game",
    playerNotFound: "Player not found",
    targetPlayerNotFound: "Target player not found or is a guest",
    failedToKick: "Failed to kick player",
    failedToTransfer: "Failed to transfer host",
    failedToUpdateSettings: "Failed to update lobby settings",
    failedToRestart: "Failed to restart game",
    canOnlyRestartFinished: "Can only restart finished games"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} joined the lobby",
    playerLeft: "{username} left the lobby",
    gameStarted: "Game started!",
    gameRestarted: "Game has been restarted!",
    guessSubmitted: "Guess submitted!",
    hostTransferred: "Host has been transferred",
    settingsUpdated: "Game settings updated!"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} joined the game",
    hostRestarted: "Host restarted the game",
    hostUpdatedSettings: "Host updated game settings"
  }
} as const