export default {
  // Page titles and navigation
  title: "Mode Multijoueur",
  pageDescription: "Rejoignez ou créez un salon pour jouer avec des amis et participer à des jeux de devinettes en temps réel",
  createLobby: "Créer Salon",
  joinLobby: "Rejoindre Salon",
  quickMatch: "Match Rapide",
  backToLobbies: "Retour aux Salons",

  // Lobby browser
  browser: {
    searchPlaceholder: "Rechercher des salons...",
    filters: {
      all: "Tous",
      waiting: "En attente",
      playing: "En cours",
      public: "Publics"
    } as const,
    noLobbies: "Aucun salon actif",
    noLobbiesFiltered: "Aucun salon trouvé correspondant à vos critères",
    refresh: "Actualiser",
    loading: "Chargement...",
    createdDate: "Créé le {date}",
    hostBy: "Hôte : {name}",
    hostAnonymous: "Hôte : Anonyme"
  } as const,

  // Lobby details
  lobby: {
    playersCount: "{current}/{max} joueurs",
    roundTimer: "{seconds}s par manche",
    rounds: "{count} manches",
    targetScore: "{score} pts",
    hintsEnabled: "Indices activés",
    gameMode: {
      classic: "Classique",
      elimination: "Élimination",
      marathon: "Marathon"
    } as const,
    status: {
      waiting: "en attente",
      playing: "en cours",
      finished: "terminé"
    } as const,
    actions: {
      join: "Rejoindre",
      spectate: "Observer",
      full: "Complet",
      private: "Privé"
    } as const
  } as const,

  // Lobby room
  room: {
    // Connection status
    connected: "Connecté",
    disconnected: "Déconnecté",

    // Lobby info
    playersOnline: "{count} joueurs en ligne",
    gameStarting: "Jeu en Démarrage...",
    starting: "Démarrage",

    // Player actions
    ready: "Prêt",
    notReady: "Pas Prêt",
    toggleReady: "Basculer Prêt",
    waitingForPlayers: "En attente des autres joueurs...",

    // Host actions
    inviteButton: "Inviter",
    settings: "Paramètres",
    startGame: "Démarrer Jeu",
    playAgain: "🔄 Rejouer",

    // Profile setup
    setProfile: "Configurez Votre Profil",
    setProfileLoggedIn: "Veuillez définir votre nom d'affichage pour rejoindre le lobby",
    setProfileAnonymous: "Veuillez définir votre nom d'affichage pour rejoindre le lobby",

    // Game settings
    gameSettings: {
      title: "Paramètres du Jeu",
      gameMode: "Mode de Jeu",
      maxPlayers: "Max. Joueurs",
      roundTimer: "Minuteur Manche",
      rounds: "Manches",
      hintsEnabled: "Indices Activés",
      on: "ACTIVÉ",
      off: "DÉSACTIVÉ",
      cancel: "Annuler",
      updateSettings: "Mettre à Jour",
      settingsUpdated: "Paramètres du jeu mis à jour !",
      options: {
        players2: "2 Joueurs",
        players4: "4 Joueurs",
        players6: "6 Joueurs",
        players8: "8 Joueurs",
        timer30: "30 secondes",
        timer60: "60 secondes",
        timer90: "90 secondes",
        timer120: "2 minutes",
        timer180: "3 minutes",
        rounds3: "3 manches",
        rounds5: "5 manches",
        rounds8: "8 manches",
        rounds10: "10 manches",
        rounds15: "15 manches"
      } as const
    } as const,

    // Invite sharing
    invite: {
      title: "Inviter des Joueurs",
      description: "Partagez ce salon avec vos amis !",
      shareText: "Rejoignez mon jeu multijoueur : {lobbyName}"
    } as const
  } as const,

  // Game states
  game: {
    // Round info
    roundTitle: "Manche {number}",
    timeRemaining: "Temps restant",

    // Game prompt
    prompt: "Quand cette photo a-t-elle été prise ?",
    promptDescription: "Entrez l'année où vous pensez que cette photo a été prise",
    yearPlaceholder: "Entrez l'année (ex : 1995)",
    submit: "Envoyer",

    // Game status
    submitted: "Réponse envoyée : {year}",
    waitingForOthers: "En attente des autres joueurs...",
    imageLoadFailed: "Échec du chargement de l'image",

    // Results
    results: {
      title: "Résultats de la Manche",
      correctYear: "Année correcte : {year}",
      yourGuess: "Votre réponse : {year}",
      points: "{points} points",
      accuracy: "{years} années d'écart",
      speedBonus: "+{bonus} bonus vitesse",
      nextRound: "Prochaine manche dans {seconds}s"
    } as const,

    // Final results
    finished: {
      title: "Jeu Terminé !",
      finalResults: "Résultats Finaux",
      position: "#{position}",
      score: "{score} pts",
      streak: "{streak} série"
    } as const
  } as const,

  // Players section
  players: {
    title: "Joueurs",
    waitingForMorePlayers: "En attente de plus de joueurs...",
    waitingForAllReady: "En attente que tous les joueurs soient prêts...",
    allPlayersReady: "Tous les joueurs sont prêts !",
    empty: "Vide",
    makeHost: "Hôte",
    owner: "Propriétaire",
    you: "Vous",
    points: "{points} pts",
    ready: "Prêt",
    waiting: "En attente",
    readyQuestion: "Prêt ?"
  } as const,

  // Results section
  results: {
    title: "Résultats du Tour",
    correctYear: "Année Correcte",
    bestGuess: "Meilleure Estimation",
    guessedYear: "A deviné {year}",
    nextRoundStarting: "Prochain Tour en Cours",
    viewPlayerGuesses: "Voir les Estimations des Joueurs ({count})",
    playerGuessesTitle: "Estimations des Joueurs - Résultats du Tour",
    perfect: "Parfait ! 🎯",
    yearOff: "{count} année d'écart",
    yearsOff: "{count} années d'écart",
    guessedLabel: "A deviné : {year}",
    points: "{points} pts",
    speedBonus: "+{bonus} bonus de vitesse",
    badges: {
      fast: "Rapide",
      accurate: "Précis",
      perfect: "Parfait"
    } as const
  } as const,

  // Create lobby dialog
  create: {
    title: "Créer Nouveau Salon",
    lobbyName: "Nom du Salon",
    lobbyNamePlaceholder: "Bataille de Devinettes Épique",
    description: "Description",
    descriptionPlaceholder: "Venez rejoindre notre jeu de devinettes amical !",
    gameSettings: "Paramètres du Jeu",
    maxPlayers: "Max. Joueurs",
    playersCount: "{count} joueurs",
    roundTimer: "Minuteur de Manche (secondes)",
    gameMode: "Mode de Jeu",
    gameModes: {
      classicDescription: "Tous les joueurs jouent toutes les manches",
      eliminationDescription: "Dernier éliminé à chaque manche",
      marathonDescription: "Jouer jusqu'à atteindre le score cible"
    } as const,
    numberOfRounds: "Nombre de Manches",
    roundsCount: "{count} manches",
    targetScore: "Score Cible",
    advancedOptions: "Options Avancées",
    publicLobby: "Salon Public",
    publicLobbyDescription: "Permettre à n'importe qui de trouver et rejoindre ce salon",
    enableHints: "Activer les Indices",
    enableHintsDescription: "Afficher des indices optionnels pendant les manches",
    cancel: "Annuler",
    createButton: "Créer Salon",
    creating: "Création...",
    success: "Salon créé avec succès !",
    failed: "Échec de la création du salon"
  } as const,

  // Chat
  chat: {
    title: "Chat",
    placeholder: "Tapez un message...",
    noMessages: "Aucun message encore",
    startConversation: "Commencez la conversation !",
    send: "Envoyer",
    quickPhrases: "Phrases Rapides",
    emojis: "Emojis",
    quick: "Rapide",
    systemMessage: "Système",
    quickPhrasesList: [
      "Bien !",
      "Proche !",
      "Wow !",
      "Très difficile",
      "Trop facile",
      "GG !",
      "Allons-y !",
      "Concentrez-vous !"
    ] as const
  } as const,

  // Error messages
  errors: {
    lobbyNotFound: "Salon introuvable",
    lobbyFull: "Salon complet",
    gameInProgress: "Jeu déjà en cours",
    connectionFailed: "Échec de connexion au salon",
    invalidYear: "Veuillez entrer une année valide entre 1800 et 2030",
    onlyHostCanStart: "Seul l'hôte peut démarrer le jeu",
    onlyHostCanRestart: "Seul l'hôte peut redémarrer le jeu",
    onlyHostCanKick: "Seul l'hôte peut expulser les joueurs",
    onlyHostCanTransfer: "Seul l'hôte peut transférer la propriété",
    onlyHostCanUpdateSettings: "Seul l'hôte peut mettre à jour les paramètres du salon",
    needTwoPlayers: "Besoin d'au moins 2 joueurs pour commencer",
    alreadyGuessed: "Réponse déjà envoyée pour cette manche",
    cannotUpdateDuringGame: "Impossible de mettre à jour les paramètres pendant le jeu",
    playerNotFound: "Joueur introuvable",
    targetPlayerNotFound: "Joueur cible introuvable ou est un invité",
    failedToKick: "Échec de l'expulsion du joueur",
    failedToTransfer: "Échec du transfert d'hôte",
    failedToUpdateSettings: "Échec de mise à jour des paramètres du salon",
    failedToRestart: "Échec du redémarrage du jeu",
    canOnlyRestartFinished: "Ne peut redémarrer que les jeux terminés"
  } as const,

  // Success messages
  success: {
    playerJoined: "{username} a rejoint le salon",
    playerLeft: "{username} a quitté le salon",
    gameStarted: "Jeu démarré !",
    gameRestarted: "Le jeu a été redémarré !",
    guessSubmitted: "Réponse envoyée !",
    hostTransferred: "L'hôte a été transféré",
    settingsUpdated: "Paramètres du jeu mis à jour !"
  } as const,

  // System messages
  system: {
    playerJoined: "{username} a rejoint le jeu",
    hostRestarted: "L'hôte a redémarré le jeu",
    hostUpdatedSettings: "L'hôte a mis à jour les paramètres du jeu"
  } as const
} as const