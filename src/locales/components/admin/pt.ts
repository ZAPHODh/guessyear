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
      noImage: "Nenhuma imagem definida para hoje",
      setRandom: "Definir Imagem Aleatória",
      chooseSpecific: "Escolher Imagem Específica",
      year: "Ano: {year}",
      gamesPlayed: "Jogos jogados: {count}"
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
      past: "Passado",
      year: "Ano: {year}",
      games: "Jogos: {count}",
      setToday: "Definir como Hoje"
    },
    unscheduled: {
      title: "Imagens Não Agendadas ({count})",
      subtitle: "Imagens ainda não agendadas para nenhuma data",
      noImages: "Nenhuma imagem não agendada",
      year: "Ano: {year}",
      setToday: "Definir como Hoje"
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
  actions: {
    edit: "Editar",
    delete: "Deletar",
    schedule: "Agendar",
    confirmDelete: "Tem certeza de que deseja deletar esta imagem?"
  }
} as const