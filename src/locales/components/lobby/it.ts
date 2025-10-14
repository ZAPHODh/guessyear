export default {
  // Page titles and navigation
  title: "Modalità Multigiocatore",
  pageDescription: "Entra o crea una lobby per giocare con gli amici e competere in giochi di indovinelli in tempo reale",
  createLobby: "Crea Lobby",
  joinLobby: "Entra in Lobby",
  quickMatch: "Partita Rapida",
  backToLobbies: "Torna alle Lobby",

  // Lobby browser
  browser: {
    searchPlaceholder: "Cerca lobby...",
    filters: {
      all: "Tutte",
      waiting: "In attesa",
      playing: "In gioco",
      public: "Pubbliche"
    } as const,
    noLobbies: "Nessuna lobby attiva",
    noLobbiesFiltered: "Nessuna lobby trovata che corrisponda ai tuoi criteri",
    refresh: "Aggiorna",
    loading: "Caricamento...",
    createdDate: "Creata il {date}",
    hostBy: "Host: {name}",
    hostAnonymous: "Host: Anonimo"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} giocatori",
    roundTimer: "{seconds}s per round",
    rounds: "{count} round",
    targetScore: "{score} pt",
    hintsEnabled: "Suggerimenti abilitati",
    gameMode: {
      classic: "Classica",
      elimination: "Eliminazione",
      marathon: "Maratona"
    } as const,
    status: {
      waiting: "in attesa",
      playing: "in gioco",
      finished: "finita"
    } as const,
    actions: {
      join: "Entra",
      spectate: "Osserva",
      full: "Piena",
      private: "Privata"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Connesso",
    disconnected: "Disconnesso",

    // Lobby info
    playersOnline: "{count} giocatori online",
    gameStarting: "Gioco in Avvio...",
    starting: "Avviando",

    // Player actions
    ready: "Pronto",
    notReady: "Non Pronto",
    toggleReady: "Commuta Pronto",
    waitingForPlayers: "Aspettando altri giocatori...",

    // Host actions
    inviteButton: "Invita",
    settings: "Impostazioni",
    startGame: "Avvia Gioco",
    playAgain: "🔄 Gioca Ancora",

    // Profile setup
    setProfile: "Configura Il Tuo Profilo",
    setProfileLoggedIn: "Imposta il tuo nome visualizzato per entrare nella lobby",
    setProfileAnonymous: "Imposta il tuo nome visualizzato per entrare nella lobby",

    // Game settings
    gameSettings: {
      title: "Impostazioni Gioco",
      gameMode: "Modalità Gioco",
      maxPlayers: "Max. Giocatori",
      roundTimer: "Timer Round",
      rounds: "Round",
      hintsEnabled: "Suggerimenti Abilitati",
      on: "ACCESO",
      off: "SPENTO",
      cancel: "Annulla",
      updateSettings: "Aggiorna Impostazioni",
      settingsUpdated: "Impostazioni del gioco aggiornate!",
      options: {
        players2: "2 Giocatori",
        players4: "4 Giocatori",
        players6: "6 Giocatori",
        players8: "8 Giocatori",
        timer30: "30 secondi",
        timer60: "60 secondi",
        timer90: "90 secondi",
        timer120: "2 minuti",
        timer180: "3 minuti",
        rounds3: "3 round",
        rounds5: "5 round",
        rounds8: "8 round",
        rounds10: "10 round",
        rounds15: "15 round"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Invita Giocatori",
      description: "Condividi questa lobby con i tuoi amici!",
      shareText: "Unisciti al mio gioco multigiocatore: {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Round {number}",
    timeRemaining: "Tempo rimanente",

    // Game prompt
    prompt: "Quando è stata scattata questa foto?",
    promptDescription: "Inserisci l'anno in cui pensi sia stata scattata questa foto",
    yearPlaceholder: "Inserisci anno (es. 1995)",
    submit: "Invia",

    // Game status
    submitted: "Risposta inviata: {year}",
    waitingForOthers: "Aspettando altri giocatori...",
    imageLoadFailed: "Caricamento immagine fallito",

    // Results
    results: {
      title: "Risultati del Round",
      correctYear: "Anno corretto: {year}",
      yourGuess: "La tua risposta: {year}",
      points: "{points} punti",
      accuracy: "{years} anni di scarto",
      speedBonus: "+{bonus} bonus velocità",
      nextRound: "Prossimo round tra {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "Gioco Finito!",
      finalResults: "Risultati Finali",
      position: "#{position}",
      score: "{score} pt",
      streak: "{streak} serie"
    } as const
  } as const,

  // Players section
  players: {
    title: "Giocatori",
    waitingForMorePlayers: "Aspettando più giocatori...",
    waitingForAllReady: "Aspettando che tutti i giocatori siano pronti...",
    allPlayersReady: "Tutti i giocatori pronti!",
    empty: "Vuoto",
    makeHost: "Host",
    owner: "Proprietario",
    you: "Tu",
    points: "{points} pt",
    ready: "Pronto",
    waiting: "In attesa",
    readyQuestion: "Pronto?"
  } as const,

  // Results section
  results: {
    title: "Risultati del Round",
    correctYear: "Anno Corretto",
    bestGuess: "Migliore Supposizione",
    guessedYear: "Ha indovinato {year}",
    nextRoundStarting: "Prossimo Round in Avvio",
    viewPlayerGuesses: "Vedi Supposizioni Giocatori ({count})",
    playerGuessesTitle: "Supposizioni Giocatori - Risultati Round",
    perfect: "Perfetto! 🎯",
    yearOff: "{count} anno di scarto",
    yearsOff: "{count} anni di scarto",
    guessedLabel: "Ha indovinato: {year}",
    points: "{points} pt",
    speedBonus: "+{bonus} bonus velocità",
    badges: {
      fast: "Veloce",
      accurate: "Preciso",
      perfect: "Perfetto"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Crea Nuova Lobby",
    lobbyName: "Nome della Lobby",
    lobbyNamePlaceholder: "Battaglia di Indovinelli Epica",
    description: "Descrizione",
    descriptionPlaceholder: "Vieni a unirti al nostro gioco di indovinelli amichevole!",
    gameSettings: "Impostazioni Gioco",
    maxPlayers: "Max. Giocatori",
    playersCount: "{count} giocatori",
    roundTimer: "Timer Round (secondi)",
    gameMode: "Modalità Gioco",
    gameModes: {
      classicDescription: "Tutti i giocatori giocano tutti i round",
      eliminationDescription: "Ultimo posto eliminato ogni round",
      marathonDescription: "Gioca fino al raggiungimento del punteggio target"
    } as const,
    numberOfRounds: "Numero di Round",
    roundsCount: "{count} round",
    targetScore: "Punteggio Target",
    advancedOptions: "Opzioni Avanzate",
    publicLobby: "Lobby Pubblica",
    publicLobbyDescription: "Permetti a chiunque di trovare e unirsi a questa lobby",
    enableHints: "Abilita Suggerimenti",
    enableHintsDescription: "Mostra suggerimenti opzionali durante i round",
    cancel: "Annulla",
    createButton: "Crea Lobby",
    creating: "Creazione...",
    success: "Lobby creata con successo!",
    failed: "Creazione lobby fallita"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Scrivi un messaggio...",
    noMessages: "Nessun messaggio ancora",
    startConversation: "Inizia la conversazione!",
    send: "Invia",
    quickPhrases: "Frasi Rapide",
    emojis: "Emoji",
    quick: "Rapida",
    systemMessage: "Sistema",
    quickPhrasesList: [
      "Bene!",
      "Vicino!",
      "Wow!",
      "Molto difficile",
      "Troppo facile",
      "GG!",
      "Andiamo!",
      "Concentrati!"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Lobby non trovata",
    lobbyFull: "Lobby piena",
    gameInProgress: "Gioco già in corso",
    connectionFailed: "Connessione alla lobby fallita",
    invalidYear: "Per favore inserisci un anno valido tra 1800 e 2030",
    onlyHostCanStart: "Solo l'host può avviare il gioco",
    onlyHostCanRestart: "Solo l'host può riavviare il gioco",
    onlyHostCanKick: "Solo l'host può espellere giocatori",
    onlyHostCanTransfer: "Solo l'host può trasferire la proprietà",
    onlyHostCanUpdateSettings: "Solo l'host può aggiornare le impostazioni della lobby",
    needTwoPlayers: "Servono almeno 2 giocatori per iniziare",
    alreadyGuessed: "Già inviata risposta per questo round",
    cannotUpdateDuringGame: "Non è possibile aggiornare le impostazioni durante il gioco",
    playerNotFound: "Giocatore non trovato",
    targetPlayerNotFound: "Giocatore target non trovato o è ospite",
    failedToKick: "Espulsione giocatore fallita",
    failedToTransfer: "Trasferimento host fallito",
    failedToUpdateSettings: "Aggiornamento impostazioni lobby fallito",
    failedToRestart: "Riavvio gioco fallito",
    canOnlyRestartFinished: "È possibile riavviare solo giochi finiti"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} è entrato nella lobby",
    playerLeft: "{username} ha lasciato la lobby",
    gameStarted: "Gioco avviato!",
    gameRestarted: "Il gioco è stato riavviato!",
    guessSubmitted: "Risposta inviata!",
    hostTransferred: "L'host è stato trasferito",
    settingsUpdated: "Impostazioni del gioco aggiornate!"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} è entrato nel gioco",
    hostRestarted: "L'host ha riavviato il gioco",
    hostUpdatedSettings: "L'host ha aggiornato le impostazioni del gioco"
  } as const
} as const