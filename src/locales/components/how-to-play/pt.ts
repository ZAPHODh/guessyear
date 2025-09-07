export default {
  title: "Como Jogar",
  subtitle: "Aprenda a dominar o jogo diário de adivinhar imagens!",
  objective: {
    title: "🎯 Objetivo",
    description: "Adivinhe o ano em que uma fotografia histórica foi tirada. Você tem 5 tentativas para acertar!"
  },
  howItWorks: {
    title: "🕹️ Como Funciona",
    step1: "Observe a fotografia histórica cuidadosamente em busca de pistas sobre a época.",
    step2: "Digite seu palpite para o ano em que a foto foi tirada.",
    step3: "Receba feedback: 'Mais alto' se o ano real for posterior, 'Mais baixo' se for anterior.",
    step4: "Use o feedback para refinar seu próximo palpite. O intervalo válido se ajustará automaticamente!"
  },
  smartRange: {
    title: "🧠 Sistema de Intervalo Inteligente",
    description: "Após cada palpite, o jogo estreita inteligentemente os anos possíveis para te ajudar:",
    example: {
      title: "Exemplo",
      step1: "Você chuta 1950, resposta é 'Mais alto' → Novo intervalo: 1951-2025",
      step2: "Você chuta 1980, resposta é 'Mais baixo' → Novo intervalo: 1951-1979",
      step3: "Você chuta 1965, resposta é 'Correto!' → Você venceu! 🎉"
    }
  },
  tips: {
    title: "💡 Dicas Pro",
    tip1: "Observe estilos de roupas, arquitetura, carros e tecnologia na foto",
    tip2: "Comece com um palpite médio para rapidamente estreitar as possibilidades",
    tip3: "Preste atenção na qualidade da foto - fotos mais antigas tendem a ser preto e branco ou sépia"
  }
} as const