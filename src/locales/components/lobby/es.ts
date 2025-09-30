export default {
  // Page titles and navigation
  title: "Modo Multijugador",
  pageDescription: "Únete o crea una sala para jugar con amigos y competir en juegos de adivinanzas en tiempo real",
  createLobby: "Crear Sala",
  joinLobby: "Unirse a Sala",
  quickMatch: "Partida Rápida",
  backToLobbies: "Volver a Salas",

  // Lobby browser
  browser: {
    searchPlaceholder: "Buscar salas...",
    filters: {
      all: "Todas",
      waiting: "Esperando",
      playing: "Jugando",
      public: "Públicas"
    } as const,
    noLobbies: "No hay salas activas",
    noLobbiesFiltered: "No se encontraron salas que coincidan con sus criterios",
    refresh: "Actualizar",
    loading: "Cargando...",
    createdDate: "Creada el {date}",
    hostBy: "Anfitrión: {name}",
    hostAnonymous: "Anfitrión: Anónimo"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} jugadores",
    roundTimer: "{seconds}s por ronda",
    rounds: "{count} rondas",
    targetScore: "{score} pts",
    hintsEnabled: "Pistas habilitadas",
    gameMode: {
      classic: "Clásico",
      elimination: "Eliminación",
      marathon: "Maratón"
    } as const,
    status: {
      waiting: "esperando",
      playing: "jugando",
      finished: "terminado"
    } as const,
    actions: {
      join: "Unirse",
      spectate: "Observar",
      full: "Llena",
      private: "Privada"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Conectado",
    disconnected: "Desconectado",

    // Lobby info
    playersOnline: "{count} jugadores en línea",
    gameStarting: "Juego Iniciando...",
    starting: "Iniciando",

    // Player actions
    ready: "Listo",
    notReady: "No Listo",
    toggleReady: "Alternar Listo",
    waitingForPlayers: "Esperando otros jugadores...",

    // Host actions
    inviteButton: "Invitar",
    settings: "Configuración",
    startGame: "Iniciar Juego",
    playAgain: "🔄 Jugar de Nuevo",

    // Game settings
    gameSettings: {
      title: "Configuración del Juego",
      gameMode: "Modo de Juego",
      maxPlayers: "Máx. Jugadores",
      roundTimer: "Temporizador de Ronda",
      rounds: "Rondas",
      hintsEnabled: "Pistas Habilitadas",
      on: "ENCENDIDO",
      off: "APAGADO",
      cancel: "Cancelar",
      updateSettings: "Actualizar Configuración",
      settingsUpdated: "¡Configuración del juego actualizada!",
      options: {
        players2: "2 Jugadores",
        players4: "4 Jugadores",
        players6: "6 Jugadores",
        players8: "8 Jugadores",
        timer30: "30 segundos",
        timer60: "60 segundos",
        timer90: "90 segundos",
        timer120: "2 minutos",
        timer180: "3 minutos",
        rounds3: "3 rondas",
        rounds5: "5 rondas",
        rounds8: "8 rondas",
        rounds10: "10 rondas",
        rounds15: "15 rondas"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Invitar Jugadores",
      description: "¡Comparte esta sala con tus amigos!",
      shareText: "Únete a mi juego multijugador: {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Ronda {number}",
    timeRemaining: "Tiempo restante",

    // Game prompt
    prompt: "¿Cuándo fue tomada esta foto?",
    promptDescription: "Ingresa el año en que crees que fue tomada esta foto",
    yearPlaceholder: "Ingresa año (ej: 1995)",
    submit: "Enviar",

    // Game status
    submitted: "Respuesta enviada: {year}",
    waitingForOthers: "Esperando otros jugadores...",
    imageLoadFailed: "Error al cargar imagen",

    // Results
    results: {
      title: "Resultados de la Ronda",
      correctYear: "Año correcto: {year}",
      yourGuess: "Tu respuesta: {year}",
      points: "{points} puntos",
      accuracy: "{years} años de diferencia",
      speedBonus: "+{bonus} bonus velocidad",
      nextRound: "Siguiente ronda en {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "¡Juego Terminado!",
      finalResults: "Resultados Finales",
      position: "#{position}",
      score: "{score} pts",
      streak: "{streak} racha"
    } as const
  } as const,

  // Players section
  players: {
    title: "Jugadores",
    waitingForMorePlayers: "Esperando más jugadores...",
    waitingForAllReady: "Esperando que todos los jugadores estén listos...",
    allPlayersReady: "¡Todos los jugadores listos!",
    empty: "Vacío",
    makeHost: "Anfitrión",
    owner: "Propietario",
    you: "Tú",
    points: "{points} pts",
    ready: "Listo",
    waiting: "Esperando",
    readyQuestion: "¿Listo?"
  } as const,

  // Results section
  results: {
    title: "Resultados de la Ronda",
    correctYear: "Año Correcto",
    bestGuess: "Mejor Adivinanza",
    guessedYear: "Adivinó {year}",
    nextRoundStarting: "Próxima Ronda Iniciando",
    viewPlayerGuesses: "Ver Adivinanzas de Jugadores ({count})",
    playerGuessesTitle: "Adivinanzas de Jugadores - Resultados de Ronda",
    perfect: "¡Perfecto! 🎯",
    yearOff: "{count} año de diferencia",
    yearsOff: "{count} años de diferencia",
    guessedLabel: "Adivinó: {year}",
    points: "{points} pts",
    speedBonus: "+{bonus} bonus de velocidad",
    badges: {
      fast: "Rápido",
      accurate: "Preciso",
      perfect: "Perfecto"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Crear Nueva Sala",
    lobbyName: "Nombre de la Sala",
    lobbyNamePlaceholder: "Batalla de Adivinanzas Épica",
    description: "Descripción",
    descriptionPlaceholder: "¡Ven a unirte a nuestro juego amigable de adivinanzas!",
    gameSettings: "Configuración del Juego",
    maxPlayers: "Máx. Jugadores",
    playersCount: "{count} jugadores",
    roundTimer: "Temporizador de Ronda (segundos)",
    gameMode: "Modo de Juego",
    gameModes: {
      classicDescription: "Todos los jugadores juegan todas las rondas",
      eliminationDescription: "Último lugar eliminado cada ronda",
      marathonDescription: "Jugar hasta alcanzar la puntuación objetivo"
    } as const,
    numberOfRounds: "Número de Rondas",
    roundsCount: "{count} rondas",
    targetScore: "Puntuación Objetivo",
    advancedOptions: "Opciones Avanzadas",
    publicLobby: "Sala Pública",
    publicLobbyDescription: "Permitir que cualquiera encuentre y se una a esta sala",
    enableHints: "Habilitar Pistas",
    enableHintsDescription: "Mostrar pistas opcionales durante las rondas",
    cancel: "Cancelar",
    createButton: "Crear Sala",
    creating: "Creando...",
    success: "¡Sala creada exitosamente!",
    failed: "Error al crear la sala"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Escribe un mensaje...",
    noMessages: "No hay mensajes aún",
    startConversation: "¡Inicia la conversación!",
    send: "Enviar",
    quickPhrases: "Frases Rápidas",
    emojis: "Emojis",
    quick: "Rápida",
    systemMessage: "Sistema",
    quickPhrasesList: [
      "¡Bien!",
      "¡Cerca!",
      "¡Wow!",
      "Muy difícil",
      "Demasiado fácil",
      "¡GG!",
      "¡Vamos!",
      "¡Concéntrate!"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Sala no encontrada",
    lobbyFull: "Sala llena",
    gameInProgress: "Juego ya en progreso",
    connectionFailed: "Error al conectar a la sala",
    invalidYear: "Por favor ingresa un año válido entre 1800 y 2030",
    onlyHostCanStart: "Solo el anfitrión puede iniciar el juego",
    onlyHostCanRestart: "Solo el anfitrión puede reiniciar el juego",
    onlyHostCanKick: "Solo el anfitrión puede expulsar jugadores",
    onlyHostCanTransfer: "Solo el anfitrión puede transferir la propiedad",
    onlyHostCanUpdateSettings: "Solo el anfitrión puede actualizar la configuración de la sala",
    needTwoPlayers: "Se necesitan al menos 2 jugadores para empezar",
    alreadyGuessed: "Ya enviaste respuesta para esta ronda",
    cannotUpdateDuringGame: "No se puede actualizar configuración durante el juego",
    playerNotFound: "Jugador no encontrado",
    targetPlayerNotFound: "Jugador objetivo no encontrado o es invitado",
    failedToKick: "Error al expulsar jugador",
    failedToTransfer: "Error al transferir anfitrión",
    failedToUpdateSettings: "Error al actualizar configuración de sala",
    failedToRestart: "Error al reiniciar juego",
    canOnlyRestartFinished: "Solo se pueden reiniciar juegos terminados"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} se unió a la sala",
    playerLeft: "{username} salió de la sala",
    gameStarted: "¡Juego iniciado!",
    gameRestarted: "¡El juego ha sido reiniciado!",
    guessSubmitted: "¡Respuesta enviada!",
    hostTransferred: "El anfitrión ha sido transferido",
    settingsUpdated: "¡Configuración del juego actualizada!"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} se unió al juego",
    hostRestarted: "El anfitrión reinició el juego",
    hostUpdatedSettings: "El anfitrión actualizó la configuración del juego"
  } as const
} as const