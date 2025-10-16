export default {
    title: 'Profilo',
    description: 'Visualizza il tuo profilo giocatore, statistiche e cronologia',
    welcome: 'Benvenuto nel tuo profilo!',
    navigationHint: 'Usa la navigazione sopra per visualizzare i tuoi giochi lobby e la cronologia delle sfide quotidiane.',
    memberSince: 'Membro da',
    stats: {
        totalGames: 'Giochi Totali',
        lobbyGames: 'Giochi Lobby',
        dailyChallenges: 'Sfide Quotidiane',
        completedDailyGames: 'Sfide Completate',
        won: 'vinte'
    },
    navigation: {
        overview: 'Panoramica',
        lobbyHistory: 'Cronologia Lobby',
        dailyHistory: 'Cronologia Quotidiana'
    },
    lobbyHistory: {
        title: 'Cronologia Giochi Lobby',
        noGames: 'Nessun gioco lobby ancora',
        noGamesHint: 'Unisciti a una lobby multiplayer per iniziare a giocare!',
        errorLoading: 'Errore nel caricamento della cronologia',
        columns: {
            lobbyName: 'Nome Lobby',
            status: 'Stato',
            score: 'Punteggio',
            players: 'Giocatori',
            played: 'Giocato'
        },
        status: {
            waiting: 'In attesa',
            playing: 'In corso',
            finished: 'Terminato'
        },
        points: 'pt'
    },
    dailyHistory: {
        title: 'Cronologia Sfide Quotidiane',
        noChallenges: 'Nessuna sfida quotidiana giocata ancora',
        noChallengesHint: 'Gioca la sfida quotidiana per iniziare a costruire la tua cronologia!',
        errorLoading: 'Errore nel caricamento della cronologia',
        columns: {
            date: 'Data',
            description: 'Descrizione',
            year: 'Anno',
            attempts: 'Tentativi',
            result: 'Risultato',
            played: 'Giocato'
        },
        noDescription: 'Nessuna descrizione',
        wonOn: 'Vinto al',
        performance: {
            perfect: 'Perfetto!',
            great: 'Ottimo',
            good: 'Buono',
            complete: 'Completo',
            failed: 'Fallito',
            inProgress: 'In corso'
        }
    },
    pagination: {
        previous: 'Precedente',
        next: 'Successivo',
        page: 'Pagina',
        of: 'di'
    }
} as const
