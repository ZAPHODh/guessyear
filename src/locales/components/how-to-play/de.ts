export default {
  title: "So wird gespielt",
  subtitle: "Lernen Sie, wie Sie das tägliche Bilderrätselspiel meistern!",
  objective: {
    title: "Ziel",
    description: "Erraten Sie das Jahr, in dem ein Foto aufgenommen wurde. Sie haben 5 Versuche, um es richtig zu machen!"
  },
  howItWorks: {
    title: "So funktioniert es",
    step1: "Betrachten Sie das Foto sorgfältig nach Hinweisen auf die Zeitperiode.",
    step2: "Geben Sie Ihre Vermutung für das Jahr ein, in dem das Foto aufgenommen wurde.",
    step3: "Erhalten Sie Feedback: 'Höher' wenn das tatsächliche Jahr später ist, 'Niedriger' wenn es früher ist.",
    step4: "Nutzen Sie das Feedback, um Ihre nächste Vermutung einzugrenzen. Der gültige Bereich passt sich automatisch an!"
  },
  smartRange: {
    title: "Intelligentes Bereichssystem",
    description: "Nach jeder Vermutung grenzt das Spiel intelligent die möglichen Jahre ein, um Ihnen zu helfen:",
    example: {
      title: "Beispiel",
      step1: "Sie raten 1950, Antwort ist 'Höher' → Neuer Bereich: 1951-2025",
      step2: "Sie raten 1980, Antwort ist 'Niedriger' → Neuer Bereich: 1951-1979",
      step3: "Sie raten 1965, Antwort ist 'Richtig!' → Sie gewinnen!"
    }
  },
  tips: {
    title: "Tipps",
    tip1: "Achten Sie auf Kleidungsstile, Architektur, Autos und Technologie im Foto",
    tip2: "Beginnen Sie mit einer mittleren Vermutung, um die Möglichkeiten schnell einzugrenzen",
    tip3: "Beachten Sie die Fotoqualität - ältere Fotos sind tendenziell schwarz-weiß oder sepia"
  },
  readyToPlay: "Bereit zum Spielen!"
} as const