export default {
    title: 'Perfil',
    description: 'Ver tu perfil de jugador, estadísticas e historial',
    welcome: '¡Bienvenido a tu perfil!',
    navigationHint: 'Usa la navegación arriba para ver tus juegos de lobby e historial de desafíos diarios.',
    memberSince: 'Miembro desde',
    stats: {
        totalGames: 'Total de Juegos',
        lobbyGames: 'Juegos de Lobby',
        dailyChallenges: 'Desafíos Diarios',
        completedDailyGames: 'Desafíos Completados',
        won: 'ganados'
    },
    navigation: {
        overview: 'Resumen',
        lobbyHistory: 'Historial de Lobby',
        dailyHistory: 'Historial Diario'
    },
    lobbyHistory: {
        title: 'Historial de Juegos de Lobby',
        noGames: 'No hay juegos de lobby todavía',
        noGamesHint: '¡Únete a un lobby multijugador para empezar a jugar!',
        errorLoading: 'Error al cargar historial',
        columns: {
            lobbyName: 'Nombre del Lobby',
            status: 'Estado',
            score: 'Puntuación',
            players: 'Jugadores',
            played: 'Jugado'
        },
        status: {
            waiting: 'Esperando',
            playing: 'Jugando',
            finished: 'Finalizado'
        },
        points: 'pts'
    },
    dailyHistory: {
        title: 'Historial de Desafíos Diarios',
        noChallenges: 'No hay desafíos diarios jugados todavía',
        noChallengesHint: '¡Juega el desafío diario para empezar a construir tu historial!',
        errorLoading: 'Error al cargar historial',
        columns: {
            date: 'Fecha',
            description: 'Descripción',
            year: 'Año',
            attempts: 'Intentos',
            result: 'Resultado',
            played: 'Jugado'
        },
        noDescription: 'Sin descripción',
        wonOn: 'Ganado en',
        performance: {
            perfect: '¡Perfecto!',
            great: 'Genial',
            good: 'Bueno',
            complete: 'Completo',
            failed: 'Fallido',
            inProgress: 'En Progreso'
        }
    },
    pagination: {
        previous: 'Anterior',
        next: 'Siguiente',
        page: 'Página',
        of: 'de'
    }
} as const
