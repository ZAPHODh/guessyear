export default {
  // Page titles and navigation
  title: "Modo Multijogador",
  pageDescription: "Entre ou crie uma sala para jogar com amigos e competir em jogos de palpites em tempo real",
  createLobby: "Criar Sala",
  joinLobby: "Entrar na Sala",
  quickMatch: "Partida Rápida",
  backToLobbies: "Voltar às Salas",

  // Lobby browser
  browser: {
    searchPlaceholder: "Buscar salas...",
    filters: {
      all: "Todas",
      waiting: "Esperando",
      playing: "Jogando",
      public: "Públicas"
    } as const,
    noLobbies: "Nenhuma sala ativa",
    noLobbiesFiltered: "Nenhuma sala encontrada com seus critérios",
    refresh: "Atualizar",
    loading: "Carregando...",
    createdDate: "Criada em {date}",
    hostBy: "Host: {name}",
    hostAnonymous: "Host: Anônimo"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} jogadores",
    roundTimer: "{seconds}s por rodada",
    rounds: "{count} rodadas",
    targetScore: "{score} pts",
    hintsEnabled: "Dicas habilitadas",
    gameMode: {
      classic: "Clássico",
      elimination: "Eliminação",
      marathon: "Maratona"
    } as const,
    status: {
      waiting: "esperando",
      playing: "jogando",
      finished: "finalizada"
    } as const,
    actions: {
      join: "Entrar",
      spectate: "Assistir",
      full: "Cheia",
      private: "Privada"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Conectado",
    disconnected: "Desconectado",

    // Lobby info
    playersOnline: "{count} jogadores online",
    gameStarting: "Jogo Iniciando...",
    starting: "Iniciando",

    // Player actions
    ready: "Pronto",
    notReady: "Não Pronto",
    toggleReady: "Alternar Pronto",
    waitingForPlayers: "Esperando outros jogadores...",

    // Host actions
    inviteButton: "Convidar",
    settings: "Configurações",
    startGame: "Iniciar Jogo",
    playAgain: "🔄 Jogar Novamente",

    // Game settings
    gameSettings: {
      title: "Configurações do Jogo",
      gameMode: "Modo de Jogo",
      maxPlayers: "Máx. Jogadores",
      roundTimer: "Timer da Rodada",
      rounds: "Rodadas",
      hintsEnabled: "Dicas Habilitadas",
      on: "LIGADO",
      off: "DESLIGADO",
      cancel: "Cancelar",
      updateSettings: "Atualizar Configurações",
      settingsUpdated: "Configurações do jogo atualizadas!",
      options: {
        players2: "2 Jogadores",
        players4: "4 Jogadores",
        players6: "6 Jogadores",
        players8: "8 Jogadores",
        timer30: "30 segundos",
        timer60: "60 segundos",
        timer90: "90 segundos",
        timer120: "2 minutos",
        timer180: "3 minutos",
        rounds3: "3 rodadas",
        rounds5: "5 rodadas",
        rounds8: "8 rodadas",
        rounds10: "10 rodadas",
        rounds15: "15 rodadas"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Convidar Jogadores",
      description: "Compartilhe esta sala com seus amigos!",
      shareText: "Entre no meu jogo multijogador: {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Rodada {number}",
    timeRemaining: "Tempo restante",

    // Game prompt
    prompt: "Quando esta foto foi tirada?",
    promptDescription: "Digite o ano que você acha que esta foto foi tirada",
    yearPlaceholder: "Digite o ano (ex: 1995)",
    submit: "Enviar",

    // Game status
    submitted: "Palpite enviado: {year}",
    waitingForOthers: "Esperando outros jogadores...",
    imageLoadFailed: "Falha ao carregar imagem",

    // Results
    results: {
      title: "Resultados da Rodada",
      correctYear: "Ano correto: {year}",
      yourGuess: "Seu palpite: {year}",
      points: "{points} pontos",
      accuracy: "{years} anos de diferença",
      speedBonus: "+{bonus} bônus de velocidade",
      nextRound: "Próxima rodada em {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "Jogo Finalizado!",
      finalResults: "Resultados Finais",
      position: "#{position}",
      score: "{score} pts",
      streak: "{streak} sequência"
    } as const
  } as const,

  // Players section
  players: {
    title: "Jogadores",
    waitingForMorePlayers: "Aguardando mais jogadores...",
    waitingForAllReady: "Aguardando todos os jogadores ficarem prontos...",
    allPlayersReady: "Todos os jogadores prontos!",
    empty: "Vazio",
    makeHost: "Anfitrião",
    owner: "Dono",
    you: "Você",
    points: "{points} pts",
    ready: "Pronto",
    waiting: "Aguardando",
    readyQuestion: "Pronto?"
  } as const,

  // Results section
  results: {
    title: "Resultados da Rodada",
    correctYear: "Ano Correto",
    bestGuess: "Melhor Palpite",
    guessedYear: "Palpitou {year}",
    nextRoundStarting: "Próxima Rodada Iniciando",
    viewPlayerGuesses: "Ver Palpites dos Jogadores ({count})",
    playerGuessesTitle: "Palpites dos Jogadores - Resultados da Rodada",
    perfect: "Perfeito! 🎯",
    yearOff: "{count} ano de diferença",
    yearsOff: "{count} anos de diferença",
    guessedLabel: "Palpitou: {year}",
    points: "{points} pts",
    speedBonus: "+{bonus} bônus de velocidade",
    badges: {
      fast: "Rápido",
      accurate: "Preciso",
      perfect: "Perfeito"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Criar Nova Sala",
    lobbyName: "Nome da Sala",
    lobbyNamePlaceholder: "Batalha de Palpites Épica",
    description: "Descrição",
    descriptionPlaceholder: "Venha participar do nosso jogo amigável de palpites!",
    gameSettings: "Configurações do Jogo",
    maxPlayers: "Máx. Jogadores",
    playersCount: "{count} jogadores",
    roundTimer: "Timer da Rodada (segundos)",
    gameMode: "Modo de Jogo",
    gameModes: {
      classicDescription: "Todos os jogadores jogam todas as rodadas",
      eliminationDescription: "Último colocado eliminado a cada rodada",
      marathonDescription: "Jogar até atingir a pontuação alvo"
    } as const,
    numberOfRounds: "Número de Rodadas",
    roundsCount: "{count} rodadas",
    targetScore: "Pontuação Alvo",
    advancedOptions: "Opções Avançadas",
    publicLobby: "Sala Pública",
    publicLobbyDescription: "Permitir que qualquer pessoa encontre e entre nesta sala",
    enableHints: "Ativar Dicas",
    enableHintsDescription: "Mostrar dicas opcionais durante as rodadas",
    cancel: "Cancelar",
    createButton: "Criar Sala",
    creating: "Criando...",
    success: "Sala criada com sucesso!",
    failed: "Falha ao criar sala"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Digite uma mensagem...",
    noMessages: "Nenhuma mensagem ainda",
    startConversation: "Inicie a conversa!",
    send: "Enviar",
    quickPhrases: "Frases Rápidas",
    emojis: "Emojis",
    quick: "Rápida",
    systemMessage: "Sistema",
    quickPhrasesList: [
      "Boa!",
      "Quase!",
      "Nossa!",
      "Muito difícil",
      "Fácil demais",
      "GG!",
      "Vamos lá!",
      "Concentra!"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Sala não encontrada",
    lobbyFull: "Sala está cheia",
    gameInProgress: "Jogo já em andamento",
    connectionFailed: "Falha ao conectar à sala",
    invalidYear: "Por favor, digite um ano válido entre 1800 e 2030",
    onlyHostCanStart: "Apenas o host pode iniciar o jogo",
    onlyHostCanRestart: "Apenas o host pode reiniciar o jogo",
    onlyHostCanKick: "Apenas o host pode expulsar jogadores",
    onlyHostCanTransfer: "Apenas o host pode transferir propriedade",
    onlyHostCanUpdateSettings: "Apenas o host pode atualizar as configurações da sala",
    needTwoPlayers: "Necessário pelo menos 2 jogadores para iniciar",
    alreadyGuessed: "Já enviou palpite para esta rodada",
    cannotUpdateDuringGame: "Não é possível atualizar configurações durante o jogo",
    playerNotFound: "Jogador não encontrado",
    targetPlayerNotFound: "Jogador alvo não encontrado ou é convidado",
    failedToKick: "Falha ao expulsar jogador",
    failedToTransfer: "Falha ao transferir host",
    failedToUpdateSettings: "Falha ao atualizar configurações da sala",
    failedToRestart: "Falha ao reiniciar jogo",
    canOnlyRestartFinished: "Só é possível reiniciar jogos finalizados"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} entrou na sala",
    playerLeft: "{username} saiu da sala",
    gameStarted: "Jogo iniciado!",
    gameRestarted: "O jogo foi reiniciado!",
    guessSubmitted: "Palpite enviado!",
    hostTransferred: "Host foi transferido",
    settingsUpdated: "Configurações do jogo atualizadas!"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} entrou no jogo",
    hostRestarted: "Host reiniciou o jogo",
    hostUpdatedSettings: "Host atualizou as configurações do jogo"
  } as const
} as const