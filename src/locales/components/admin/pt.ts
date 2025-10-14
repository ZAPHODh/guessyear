export default {
  dashboard: {
    title: "Painel do Administrador",
    subtitle: "Gerencie imagens diárias e conteúdo do jogo",
    stats: {
      totalImages: "Total de Imagens",
      scheduled: "Agendadas", 
      unscheduled: "Não Agendadas",
      gamesPlayed: "Jogos Jogados"
    },
    todayImage: {
      title: "Imagem de Hoje",
      subtitle: "Imagem atual para {date}",
      noImage: "Nenhuma imagem agendada para hoje",
      setRandom: "Definir Imagem Aleatória",
      chooseSpecific: "Escolher Imagem Específica",
      year: "Ano: {year}",
      gamesPlayed: "Jogos jogados: {count}"
    },
    queue: {
      title: "Fila de Imagens",
      subtitle: "Próximas imagens agendadas",
      noQueue: "Nenhuma imagem na fila",
      today: "Hoje",
      tomorrow: "Amanhã",
      comingDays: "Próximos dias"
    },
    quickActions: {
      title: "Ações Rápidas",
      uploadNew: "Enviar Nova Imagem",
      scheduleImages: "Agendar Imagens"
    },
    recentImages: {
      title: "Imagens Recentes",
      noScheduled: "Nenhuma imagem agendada",
      year: "Ano {year}"
    }
  },
  images: {
    title: "Gerenciamento de Imagens", 
    subtitle: "Envie, agende e gerencie imagens diárias",
    upload: {
      title: "Enviar Nova Imagem",
      subtitle: "Adicionar uma nova imagem à coleção",
      button: "Enviar Nova Imagem"
    },
    scheduled: {
      title: "Imagens Agendadas ({count})",
      subtitle: "Imagens agendadas para datas específicas",
      noImages: "Nenhuma imagem agendada",
      today: "Hoje",
      tomorrow: "Amanhã",
      past: "Passado",
      year: "Ano: {year}",
      games: "Jogos: {count}",
      queueNext: "Próximo na Fila",
      queueTomorrow: "Agendar p/ Amanhã"
    },
    unscheduled: {
      title: "Imagens Não Agendadas ({count})",
      subtitle: "Imagens ainda não agendadas para nenhuma data",
      noImages: "Nenhuma imagem não agendada",
      year: "Ano: {year}",
      queueNext: "Próximo na Fila",
      queueTomorrow: "Agendar p/ Amanhã"
    },
    all: {
      title: "Todas as Imagens ({count})",
      subtitle: "Visão completa de todas as imagens do sistema",
      noImages: "Nenhuma imagem encontrada",
      unscheduled: "Não Agendada",
      future: "Agendada",
      notScheduled: "Não Agendada"
    },
    bulk: {
      title: "Agendar Imagens Aleatórias em Massa",
      subtitle: "Agendar automaticamente imagens aleatórias para vários dias",
      startDate: "Data de Início",
      days: "Número de Dias",
      button: "Agendar em Massa ({count} disponíveis)",
      success: "Agendadas {count} imagens"
    },
    tabs: {
      upload: "Enviar",
      all: "Todas as Imagens",
      scheduled: "Agendadas", 
      unscheduled: "Não Agendadas",
      bulk: "Ações em Massa"
    }
  },
  forms: {
    upload: {
      title: "Enviar Nova Imagem",
      subtitle: "Adicionar uma nova imagem à coleção diária",
      cloudinaryUrl: {
        label: "URL do Cloudinary",
        placeholder: "https://res.cloudinary.com/...",
        description: "A URL da imagem da sua conta Cloudinary",
        error: "Por favor, insira uma URL válida"
      },
      year: {
        label: "Ano",
        description: "O ano em que esta foto foi tirada",
        minError: "O ano deve ser após 1800",
        maxError: "O ano não pode estar no futuro"
      },
      description: {
        label: "Descrição (Opcional)",
        placeholder: "Breve descrição da imagem...",
        description: "Uma breve descrição do conteúdo da imagem"
      },
      tip: {
        label: "Dica (Opcional)",
        placeholder: "Dica útil para adivinhar o ano...",
        description: "Uma dica para ajudar os jogadores a acertar o ano"
      },
      button: "Enviar Imagem",
      success: "Imagem enviada com sucesso",
      error: "Falha ao enviar imagem"
    },
    edit: {
      title: "Editar Imagem",
      subtitle: "Atualizar detalhes da imagem e agendamento", 
      date: {
        label: "Data Agendada",
        description: "A data em que esta imagem deve ser apresentada",
        error: "Formato de data inválido"
      },
      description: {
        label: "Descrição (Opcional)",
        placeholder: "Breve descrição da imagem...",
        description: "Uma breve descrição do conteúdo da imagem"
      },
      tip: {
        label: "Dica (Opcional)",
        placeholder: "Dica útil para adivinhar o ano...",
        description: "Uma dica para ajudar os jogadores a acertar o ano"
      },
      saveButton: "Salvar Alterações",
      deleteButton: "Deletar Imagem",
      deleteTitle: "Deletar Imagem",
      deleteDescription: "Tem certeza de que deseja deletar esta imagem? Esta ação não pode ser desfeita.",
      cancel: "Cancelar",
      delete: "Deletar",
      updateSuccess: "Imagem atualizada com sucesso",
      updateError: "Falha ao atualizar imagem",
      deleteSuccess: "Imagem deletada com sucesso", 
      deleteError: "Falha ao deletar imagem",
      deleteBlocked: "Não é possível deletar imagem com progresso de jogo existente",
      year: "Ano: {year}",
      gamesPlayed: "Jogos jogados: {count}"
    }
  },
  multiLanguage: {
    languages: {
      english: "English",
      portuguese: "Português", 
      french: "Français",
      spanish: "Español",
      german: "Deutsch",
      italian: "Italiano"
    },
    languagesCount: "idiomas"
  },
  actions: {
    edit: "Editar",
    delete: "Deletar",
    schedule: "Agendar",
    confirmDelete: "Tem certeza de que deseja deletar esta imagem?"
  },
  lobbies: {
    title: "Gerenciamento de Lobbies",
    subtitle: "Gerencie lobbies multiplayer e visualize pontuações dos jogadores",
    loading: "Carregando lobbies...",
    noLobbies: "Nenhum lobby ativo",
    noFinishedLobbies: "Nenhum lobby finalizado",
    tabs: {
      active: "Ativos",
      finished: "Finalizados",
      cleanup: "Limpeza"
    },
    active: {
      title: "Lobbies Ativos",
      subtitle: "Lobbies atualmente ativos e aguardando"
    },
    finished: {
      title: "Lobbies Finalizados",
      subtitle: "Lobbies de jogos concluídos"
    },
    table: {
      name: "Nome",
      host: "Host",
      status: "Status",
      mode: "Modo",
      players: "Jogadores",
      rounds: "Rodadas",
      created: "Criado",
      finished: "Finalizado",
      winner: "Vencedor",
      actions: "Ações"
    },
    status: {
      waiting: "Aguardando",
      playing: "Jogando",
      finished: "Finalizado"
    },
    gameMode: {
      classic: "Clássico",
      elimination: "Eliminação",
      marathon: "Maratona"
    },
    cleanup: {
      title: "Ações de Limpeza",
      subtitle: "Deletar lobbies em massa",
      deleteFinished: "Deletar Todos os Lobbies Finalizados",
      deleteFinishedDesc: "Remover todos os lobbies que foram concluídos",
      deleteFinishedButton: "Deletar Todos Finalizados",
      deleteOld: "Deletar Lobbies Antigos",
      deleteOldDesc: "Remover lobbies com mais dias que o especificado",
      days: "Dias de idade",
      deleteOldButton: "Deletar Lobbies Antigos"
    },
    details: {
      subtitle: "Detalhes e estatísticas do lobby",
      host: "Host",
      status: "Status",
      mode: "Modo de Jogo",
      rounds: "Rodadas",
      leaderboard: "Placar",
      rank: "Posição",
      player: "Jogador",
      score: "Pontuação",
      eliminated: "Eliminado",
      ready: "Pronto",
      round: "Rodada",
      correctYear: "Ano Correto",
      guesses: "Palpites",
      chat: "Mensagens do Chat"
    },
    confirmDeleteFinished: "Tem certeza de que deseja deletar todos os lobbies finalizados?",
    confirmDeleteOld: "Tem certeza de que deseja deletar lobbies com mais de {days} dias?",
    deleteSuccess: "{count} lobbies deletados com sucesso"
  }
} as const