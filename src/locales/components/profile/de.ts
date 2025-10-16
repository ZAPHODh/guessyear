export default {
    title: 'Profil',
    description: 'Sehen Sie Ihr Spielerprofil, Statistiken und Verlauf',
    welcome: 'Willkommen in Ihrem Profil!',
    navigationHint: 'Verwenden Sie die Navigation oben, um Ihre Lobby-Spiele und den Verlauf der täglichen Herausforderungen anzuzeigen.',
    memberSince: 'Mitglied seit',
    stats: {
        totalGames: 'Gesamtspiele',
        lobbyGames: 'Lobby-Spiele',
        dailyChallenges: 'Tägliche Herausforderungen',
        completedDailyGames: 'Abgeschlossene Herausforderungen',
        won: 'gewonnen'
    },
    navigation: {
        overview: 'Übersicht',
        lobbyHistory: 'Lobby-Verlauf',
        dailyHistory: 'Täglicher Verlauf'
    },
    lobbyHistory: {
        title: 'Lobby-Spielverlauf',
        noGames: 'Noch keine Lobby-Spiele',
        noGamesHint: 'Treten Sie einer Multiplayer-Lobby bei, um zu spielen!',
        errorLoading: 'Fehler beim Laden des Verlaufs',
        columns: {
            lobbyName: 'Lobby-Name',
            status: 'Status',
            score: 'Punktzahl',
            players: 'Spieler',
            played: 'Gespielt'
        },
        status: {
            waiting: 'Wartet',
            playing: 'Spielt',
            finished: 'Beendet'
        },
        points: 'Pkt'
    },
    dailyHistory: {
        title: 'Verlauf der täglichen Herausforderungen',
        noChallenges: 'Noch keine täglichen Herausforderungen gespielt',
        noChallengesHint: 'Spielen Sie die tägliche Herausforderung, um Ihren Verlauf aufzubauen!',
        errorLoading: 'Fehler beim Laden des Verlaufs',
        columns: {
            date: 'Datum',
            description: 'Beschreibung',
            year: 'Jahr',
            attempts: 'Versuche',
            result: 'Ergebnis',
            played: 'Gespielt'
        },
        noDescription: 'Keine Beschreibung',
        wonOn: 'Gewonnen bei',
        performance: {
            perfect: 'Perfekt!',
            great: 'Großartig',
            good: 'Gut',
            complete: 'Vollständig',
            failed: 'Fehlgeschlagen',
            inProgress: 'In Bearbeitung'
        }
    },
    pagination: {
        previous: 'Zurück',
        next: 'Weiter',
        page: 'Seite',
        of: 'von'
    }
} as const
