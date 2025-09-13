export default {
  title: "Défi Photo Quotidien",
  howToPlay: "Comment jouer",
  guessPrompt: "En quelle année cette photo a-t-elle été prise ?",
  submitGuess: "Soumettre la réponse",
  submitting: "Envoi en cours...",
  yearPlaceholder: "Entrez l'année (ex: 1975)",
  attemptsLeft: "tentatives restantes",
  congratulations: "Félicitations !",
  betterLuck: "Meilleure chance demain !",
  correctYear: "L'année correcte était :",
  todaysWins: "Victoires d'aujourd'hui",
  donate: "Soutenez-nous, faites un don !",
  loading: "Chargement...",
  failedToLoad: "Impossible de charger l'image du jour",
  invalidYear: "Veuillez entrer une année valide",
  previousGuesses: "Vos tentatives",
  higher: "Plus haut",
  lower: "Plus bas",
  correct: "Correct !",
  years: "années de différence",
  validRange: "Plage valide : {min} - {max}",
  rangeNarrowed: "réduite",
  attempt: "Tentative {number}",
  needHint: "Besoin d'un indice ?",
  statsTitle: "Statistiques Quotidiennes - {games} Jeux",
  statsDescription: "Graphique interactif montrant les taux de victoire et les comptes de jeux par tentative",
  winPercentageLabel: "Pourcentage de Victoire",
  gameCountLabel: "Compte de Jeux",
  chart: {
    title: "Taux de Victoire par Tentative",
    basedOn: "Basé sur {count} jeux terminés aujourd'hui",
    lossPercentage: "Taux de Défaite"
  },
  tips: {
    generalHint: "Cherchez des indices comme les styles vestimentaires, l'architecture, les véhicules et la technologie dans l'image.",
    contextualHint: "Considérez la qualité et la couleur de la photo - les photos plus anciennes sont souvent en noir et blanc ou sépia.",
    strategicHint: "Utilisez vos suppositions précédentes pour réduire la période de temps plus efficacement."
  },
  share: {
    button: "Partager le Résultat",
    title: "Partagez votre résultat",
    downloading: "Création de l'image...",
    generating: "Génération...",
    success: "Image prête à partager !",
    copy: "Copier",
    copied: "Copié !",
    copySuccess: "Texte copié dans votre presse-papiers 🎉",
    download: "Télécharger",
    more: "Plus",
    cancel: "Annuler",
    platforms: {
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      facebook: "Facebook"
    },
    shareText: {
      title: "Résultat du Défi Quotidien",
      won: "J'ai gagné le Défi Photo Quotidien en {attempts} tentative{plural}! 🎉",
      lost: "J'ai essayé le Défi Photo Quotidien - la réponse était {correctYear}! 📸",
      playAt: "Jouez sur :"
    },
    errors: {
      shareApiFailed: "API de partage échouée, image téléchargée à la place",
      generateImageFailed: "Échec de génération de l'image de partage:"
    },
    image: {
      wonText: "J'ai deviné!",
      lostText: "Presque réussi!",
      attemptsText: "En {attempts} tentative{plural}",
      yearText: "Année:",
      playText: "Jouez aussi!"
    }
  }
} as const