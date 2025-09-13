export default {
  title: "Desafio de Imagem Diária",
  howToPlay: "Como jogar",
  guessPrompt: "Em que ano esta foto foi tirada?",
  submitGuess: "Enviar palpite",
  submitting: "Enviando...",
  yearPlaceholder: "Digite o ano (ex: 1975)",
  attemptsLeft: "tentativas restantes",
  congratulations: "Parabéns!",
  betterLuck: "Mais sorte amanhã!",
  correctYear: "O ano correto foi:",
  todaysWins: "Vitórias de Hoje",
  donate: "Nos apoie, faça sua doação!",
  loading: "Carregando...",
  failedToLoad: "Falha ao carregar imagem diária",
  invalidYear: "Por favor, digite um ano válido",
  previousGuesses: "Seus palpites",
  higher: "Mais alto",
  lower: "Mais baixo",
  correct: "Correto!",
  years: "anos de diferença",
  validRange: "Intervalo válido: {min} - {max}",
  rangeNarrowed: "estreitado",
  attempt: "Tentativa {number}",
  needHint: "Precisa de uma dica?",
  statsTitle: "Estatísticas Diárias - {games} Jogos",
  statsDescription: "Gráfico mostrando taxas de vitória e contagens de jogos por tentativa",
  winPercentageLabel: "Taxa de Vitória",
  gameCountLabel: "Jogos Ganhos",
  chart: {
    title: "Taxa de Vitória por Tentativa",
    basedOn: "Baseado em {count} jogos completados hoje",
    lossPercentage: "Taxa de Derrota"
  },
  tips: {
    generalHint: "Procure por pistas como estilos de roupas, arquitetura, veículos e tecnologia na imagem.",
    contextualHint: "Considere a qualidade e cor da foto - fotos mais antigas são frequentemente preto e branco ou sépia.",
    strategicHint: "Use seus palpites anteriores para estreitar o período de tempo mais efetivamente."
  },
  share: {
    button: "Compartilhar Resultado",
    title: "Compartilhe seu resultado",
    downloading: "Criando imagem...",
    generating: "Gerando...",
    success: "Imagem pronta para compartilhar!",
    copy: "Copiar",
    copied: "Copiado!",
    copySuccess: "Texto copiado para sua área de transferência 🎉",
    download: "Baixar",
    more: "Mais",
    cancel: "Cancelar",
    platforms: {
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      facebook: "Facebook"
    },
    shareText: {
      title: "Resultado do Desafio Diário",
      won: "Eu ganhei o Desafio de Foto Diário em {attempts} tentativa{plural}! 🎉",
      lost: "Eu tentei o Desafio de Foto Diário - a resposta era {correctYear}! 📸"
    },
    errors: {
      shareApiFailed: "API de compartilhamento falhou, imagem foi baixada",
      generateImageFailed: "Falha ao gerar imagem de compartilhamento:"
    },
    image: {
      wonText: "Consegui adivinhar!",
      lostText: "Quase consegui!",
      attemptsText: "Em {attempts} tentativa{plural}",
      yearText: "Ano:",
      playText: "Jogue também!"
    }
  }
} as const