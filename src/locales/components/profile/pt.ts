export default {
    title: 'Perfil',
    description: 'Veja seu perfil de jogador, estatísticas e histórico',
    welcome: 'Bem-vindo ao seu perfil!',
    navigationHint: 'Use a navegação acima para ver seus jogos de lobby e histórico de desafios diários.',
    memberSince: 'Membro desde',
    stats: {
        totalGames: 'Total de Jogos',
        lobbyGames: 'Jogos de Lobby',
        dailyChallenges: 'Desafios Diários',
        completedDailyGames: 'Desafios Completos',
        won: 'vencidos'
    },
    navigation: {
        overview: 'Visão Geral',
        lobbyHistory: 'Histórico de Lobby',
        dailyHistory: 'Histórico Diário'
    },
    lobbyHistory: {
        title: 'Histórico de Jogos de Lobby',
        noGames: 'Nenhum jogo de lobby ainda',
        noGamesHint: 'Entre em um lobby multiplayer para começar a jogar!',
        errorLoading: 'Erro ao carregar histórico',
        columns: {
            lobbyName: 'Nome do Lobby',
            status: 'Status',
            score: 'Pontuação',
            players: 'Jogadores',
            played: 'Jogado'
        },
        status: {
            waiting: 'Aguardando',
            playing: 'Jogando',
            finished: 'Finalizado'
        },
        points: 'pts'
    },
    dailyHistory: {
        title: 'Histórico de Desafios Diários',
        noChallenges: 'Nenhum desafio diário jogado ainda',
        noChallengesHint: 'Jogue o desafio diário para começar a construir seu histórico!',
        errorLoading: 'Erro ao carregar histórico',
        columns: {
            date: 'Data',
            description: 'Descrição',
            year: 'Ano',
            attempts: 'Tentativas',
            result: 'Resultado',
            played: 'Jogado'
        },
        noDescription: 'Sem descrição',
        wonOn: 'Venceu na',
        performance: {
            perfect: 'Perfeito!',
            great: 'Ótimo',
            good: 'Bom',
            complete: 'Completo',
            failed: 'Falhou',
            inProgress: 'Em Progresso'
        }
    },
    pagination: {
        previous: 'Anterior',
        next: 'Próximo',
        page: 'Página',
        of: 'de'
    }
} as const
