export default {
  title: "Comment jouer",
  subtitle: "Apprenez à maîtriser le jeu quotidien de devinette d'images !",
  objective: {
    title: "Objectif",
    description: "Devinez l'année où une photographie a été prise. Vous avez 5 tentatives pour trouver la bonne réponse !"
  },
  howItWorks: {
    title: "Comment ça fonctionne",
    step1: "Regardez attentivement la photographie pour des indices sur l'époque.",
    step2: "Entrez votre estimation pour l'année de prise de la photo.",
    step3: "Recevez des commentaires : 'Plus haut' si l'année réelle est plus tardive, 'Plus bas' si elle est plus tôt.",
    step4: "Utilisez les commentaires pour affiner votre prochaine estimation. La plage valide s'ajustera automatiquement !"
  },
  smartRange: {
    title: "Système de plage intelligente",
    description: "Après chaque estimation, le jeu réduit intelligemment les années possibles pour vous aider :",
    example: {
      title: "Exemple",
      step1: "Vous devinez 1950, la réponse est 'Plus haut' → Nouvelle plage : 1951-2025",
      step2: "Vous devinez 1980, la réponse est 'Plus bas' → Nouvelle plage : 1951-1979",
      step3: "Vous devinez 1965, la réponse est 'Correct !' → Vous gagnez !"
    }
  },
  tips: {
    title: "Conseils",
    tip1: "Cherchez les styles vestimentaires, l'architecture, les voitures et la technologie dans la photo",
    tip2: "Commencez par une estimation dans la moyenne pour réduire rapidement les possibilités",
    tip3: "Attention à la qualité photo - les anciennes photos ont tendance à être en noir & blanc ou sépia"
  }
} as const