export default {
  // Page titles and navigation
  title: "Mehrspieler-Modus",
  pageDescription: "Treten Sie einer Lobby bei oder erstellen Sie eine, um mit Freunden zu spielen und an Echtzeit-Rate-Spielen teilzunehmen",
  createLobby: "Lobby Erstellen",
  joinLobby: "Lobby Beitreten",
  quickMatch: "Schnelles Spiel",
  backToLobbies: "Zurück zu Lobbys",

  // Lobby browser
  browser: {
    searchPlaceholder: "Lobbys suchen...",
    filters: {
      all: "Alle",
      waiting: "Wartend",
      playing: "Spielend",
      public: "Öffentlich"
    } as const,
    noLobbies: "Keine aktiven Lobbys",
    noLobbiesFiltered: "Keine Lobbys gefunden, die Ihren Kriterien entsprechen",
    refresh: "Aktualisieren",
    loading: "Lädt...",
    createdDate: "Erstellt am {date}",
    hostBy: "Host: {name}",
    hostAnonymous: "Host: Anonym"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} Spieler",
    roundTimer: "{seconds}s pro Runde",
    rounds: "{count} Runden",
    targetScore: "{score} Pkt",
    hintsEnabled: "Hinweise aktiviert",
    gameMode: {
      classic: "Klassisch",
      elimination: "Eliminierung",
      marathon: "Marathon"
    } as const,
    status: {
      waiting: "wartend",
      playing: "spielend",
      finished: "beendet"
    } as const,
    actions: {
      join: "Beitreten",
      spectate: "Zuschauen",
      full: "Voll",
      private: "Privat"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Verbunden",
    disconnected: "Getrennt",

    // Lobby info
    playersOnline: "{count} Spieler online",
    gameStarting: "Spiel Startet...",
    starting: "Startet",

    // Player actions
    ready: "Bereit",
    notReady: "Nicht Bereit",
    toggleReady: "Bereitschaft Umschalten",
    waitingForPlayers: "Warten auf andere Spieler...",

    // Host actions
    inviteButton: "Einladen",
    settings: "Einstellungen",
    startGame: "Spiel Starten",
    playAgain: "🔄 Nochmal Spielen",

    // Game settings
    gameSettings: {
      title: "Spiel-Einstellungen",
      gameMode: "Spielmodus",
      maxPlayers: "Max. Spieler",
      roundTimer: "Runden-Timer",
      rounds: "Runden",
      hintsEnabled: "Hinweise Aktiviert",
      on: "AN",
      off: "AUS",
      cancel: "Abbrechen",
      updateSettings: "Einstellungen Aktualisieren",
      settingsUpdated: "Spiel-Einstellungen aktualisiert!",
      options: {
        players2: "2 Spieler",
        players4: "4 Spieler",
        players6: "6 Spieler",
        players8: "8 Spieler",
        timer30: "30 Sekunden",
        timer60: "60 Sekunden",
        timer90: "90 Sekunden",
        timer120: "2 Minuten",
        timer180: "3 Minuten",
        rounds3: "3 Runden",
        rounds5: "5 Runden",
        rounds8: "8 Runden",
        rounds10: "10 Runden",
        rounds15: "15 Runden"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Spieler Einladen",
      description: "Teile diese Lobby mit deinen Freunden!",
      shareText: "Tritt meinem Mehrspieler-Spiel bei: {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Runde {number}",
    timeRemaining: "Verbleibende Zeit",

    // Game prompt
    prompt: "Wann wurde dieses Foto aufgenommen?",
    promptDescription: "Gib das Jahr ein, in dem du denkst, dass dieses Foto aufgenommen wurde",
    yearPlaceholder: "Jahr eingeben (z.B. 1995)",
    submit: "Senden",

    // Game status
    submitted: "Antwort gesendet: {year}",
    waitingForOthers: "Warten auf andere Spieler...",
    imageLoadFailed: "Bild konnte nicht geladen werden",

    // Results
    results: {
      title: "Runden-Ergebnisse",
      correctYear: "Korrektes Jahr: {year}",
      yourGuess: "Deine Antwort: {year}",
      points: "{points} Punkte",
      accuracy: "{years} Jahre daneben",
      speedBonus: "+{bonus} Geschwindigkeitsbonus",
      nextRound: "Nächste Runde in {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "Spiel Beendet!",
      finalResults: "Endergebnisse",
      position: "#{position}",
      score: "{score} Pkt",
      streak: "{streak} Serie"
    } as const
  } as const,

  // Players section
  players: {
    title: "Spieler",
    waitingForMorePlayers: "Warten auf mehr Spieler...",
    waitingForAllReady: "Warten darauf, dass alle Spieler bereit sind...",
    allPlayersReady: "Alle Spieler bereit!",
    empty: "Leer",
    makeHost: "Host",
    owner: "Besitzer",
    you: "Du",
    points: "{points} Pkt",
    ready: "Bereit",
    waiting: "Wartend",
    readyQuestion: "Bereit?"
  } as const,

  // Results section
  results: {
    title: "Runden-Ergebnisse",
    correctYear: "Korrektes Jahr",
    bestGuess: "Beste Schätzung",
    guessedYear: "Schätzte {year}",
    nextRoundStarting: "Nächste Runde Startet",
    viewPlayerGuesses: "Spieler-Schätzungen Ansehen ({count})",
    playerGuessesTitle: "Spieler-Schätzungen - Runden-Ergebnisse",
    perfect: "Perfekt! 🎯",
    yearOff: "{count} Jahr daneben",
    yearsOff: "{count} Jahre daneben",
    guessedLabel: "Schätzte: {year}",
    points: "{points} Pkt",
    speedBonus: "+{bonus} Geschwindigkeitsbonus",
    badges: {
      fast: "Schnell",
      accurate: "Genau",
      perfect: "Perfekt"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Neue Lobby Erstellen",
    lobbyName: "Lobby-Name",
    lobbyNamePlaceholder: "Epische Rate-Schlacht",
    description: "Beschreibung",
    descriptionPlaceholder: "Komm und mach mit bei unserem freundlichen Rate-Spiel!",
    gameSettings: "Spiel-Einstellungen",
    maxPlayers: "Max. Spieler",
    playersCount: "{count} Spieler",
    roundTimer: "Runden-Timer (Sekunden)",
    gameMode: "Spielmodus",
    gameModes: {
      classicDescription: "Alle Spieler spielen alle Runden",
      eliminationDescription: "Letzter Platz wird jede Runde eliminiert",
      marathonDescription: "Spielen bis Zielpunktzahl erreicht ist"
    } as const,
    numberOfRounds: "Anzahl der Runden",
    roundsCount: "{count} Runden",
    targetScore: "Zielpunktzahl",
    advancedOptions: "Erweiterte Optionen",
    publicLobby: "Öffentliche Lobby",
    publicLobbyDescription: "Erlaube jedem, diese Lobby zu finden und beizutreten",
    enableHints: "Hinweise Aktivieren",
    enableHintsDescription: "Zeige optionale Hinweise während der Runden",
    cancel: "Abbrechen",
    createButton: "Lobby Erstellen",
    creating: "Erstelle...",
    success: "Lobby erfolgreich erstellt!",
    failed: "Lobby-Erstellung fehlgeschlagen"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Nachricht eingeben...",
    noMessages: "Noch keine Nachrichten",
    startConversation: "Starte die Unterhaltung!",
    send: "Senden",
    quickPhrases: "Schnellphrasen",
    emojis: "Emojis",
    quick: "Schnell",
    systemMessage: "System",
    quickPhrasesList: [
      "Gut!",
      "Nah dran!",
      "Wow!",
      "Sehr schwierig",
      "Zu einfach",
      "GG!",
      "Los geht's!",
      "Konzentrier dich!"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Lobby nicht gefunden",
    lobbyFull: "Lobby ist voll",
    gameInProgress: "Spiel bereits im Gange",
    connectionFailed: "Verbindung zur Lobby fehlgeschlagen",
    invalidYear: "Bitte gib ein gültiges Jahr zwischen 1800 und 2030 ein",
    onlyHostCanStart: "Nur der Host kann das Spiel starten",
    onlyHostCanRestart: "Nur der Host kann das Spiel neustarten",
    onlyHostCanKick: "Nur der Host kann Spieler rauswerfen",
    onlyHostCanTransfer: "Nur der Host kann Besitzrechte übertragen",
    onlyHostCanUpdateSettings: "Nur der Host kann Lobby-Einstellungen aktualisieren",
    needTwoPlayers: "Mindestens 2 Spieler benötigt zum Starten",
    alreadyGuessed: "Bereits Antwort für diese Runde gesendet",
    cannotUpdateDuringGame: "Einstellungen können während des Spiels nicht aktualisiert werden",
    playerNotFound: "Spieler nicht gefunden",
    targetPlayerNotFound: "Ziel-Spieler nicht gefunden oder ist Gast",
    failedToKick: "Spieler rauswerfen fehlgeschlagen",
    failedToTransfer: "Host-Übertragung fehlgeschlagen",
    failedToUpdateSettings: "Lobby-Einstellungen aktualisieren fehlgeschlagen",
    failedToRestart: "Spiel neustarten fehlgeschlagen",
    canOnlyRestartFinished: "Kann nur beendete Spiele neustarten"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} ist der Lobby beigetreten",
    playerLeft: "{username} hat die Lobby verlassen",
    gameStarted: "Spiel gestartet!",
    gameRestarted: "Das Spiel wurde neugestartet!",
    guessSubmitted: "Antwort gesendet!",
    hostTransferred: "Host wurde übertragen",
    settingsUpdated: "Spiel-Einstellungen aktualisiert!"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} ist dem Spiel beigetreten",
    hostRestarted: "Host hat das Spiel neugestartet",
    hostUpdatedSettings: "Host hat die Spiel-Einstellungen aktualisiert"
  } as const
} as const