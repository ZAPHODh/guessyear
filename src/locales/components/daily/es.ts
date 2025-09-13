export default {
  title: "Desafío de Imagen Diario",
  howToPlay: "Cómo jugar",
  guessPrompt: "¿En qué año se tomó esta foto?",
  submitGuess: "Enviar respuesta",
  submitting: "Enviando...",
  yearPlaceholder: "Ingresa el año (ej., 1975)",
  attemptsLeft: "intentos restantes",
  congratulations: "¡Felicidades!",
  betterLuck: "¡Mejor suerte mañana!",
  correctYear: "El año correcto era:",
  todaysWins: "Victorias de Hoy",
  donate: "¡Apóyanos, haz una donación!",
  loading: "Cargando...",
  failedToLoad: "Error al cargar la imagen diaria",
  invalidYear: "Por favor ingresa un año válido",
  previousGuesses: "Tus Respuestas",
  higher: "Más alto",
  lower: "Más bajo",
  correct: "¡Correcto!",
  years: "años de diferencia",
  validRange: "Rango válido: {min} - {max}",
  rangeNarrowed: "reducido",
  attempt: "Intento {number}",
  needHint: "¿Necesitas una pista?",
  statsTitle: "Estadísticas Diarias - {games} Juegos",
  statsDescription: "Gráfico interactivo mostrando tasas de victoria y conteos de juegos por intento",
  winPercentageLabel: "Porcentaje de Victoria",
  gameCountLabel: "Conteo de Juegos",
  chart: {
    title: "Tasa de Victoria por Intento",
    basedOn: "Basado en {count} juegos completados hoy",
    lossPercentage: "Tasa de Derrota"
  },
  tips: {
    generalHint: "Busca pistas como estilos de ropa, arquitectura, vehículos y tecnología en la imagen.",
    contextualHint: "Considera la calidad y color de la foto - las fotos más antiguas suelen ser en blanco y negro o sepia.",
    strategicHint: "Usa tus suposiciones anteriores para reducir el período de tiempo de manera más efectiva."
  },
  share: {
    button: "Compartir Resultado",
    title: "Comparte tu resultado",
    downloading: "Creando imagen...",
    generating: "Generando...",
    success: "¡Imagen lista para compartir!",
    copy: "Copiar",
    copied: "¡Copiado!",
    copySuccess: "Texto copiado a tu portapapeles 🎉",
    download: "Descargar",
    more: "Más",
    cancel: "Cancelar",
    platforms: {
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      facebook: "Facebook"
    },
    shareText: {
      title: "Resultado del Desafío Diario",
      won: "¡Gané el Desafío de Foto Diario en {attempts} intento{plural}! 🎉",
      lost: "¡Intenté el Desafío de Foto Diario - la respuesta era {correctYear}! 📸",
      playAt: "Juega en:"
    },
    errors: {
      shareApiFailed: "API de compartir falló, imagen descargada en su lugar",
      generateImageFailed: "Error al generar imagen para compartir:"
    },
    image: {
      wonText: "¡Lo adiviné!",
      lostText: "¡Casi lo logro!",
      attemptsText: "En {attempts} intento{plural}",
      yearText: "Año:",
      playText: "¡Juega también!"
    }
  }
} as const