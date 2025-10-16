export default {
    title: 'Profil',
    description: 'Voir votre profil de joueur, statistiques et historique',
    welcome: 'Bienvenue sur votre profil!',
    navigationHint: 'Utilisez la navigation ci-dessus pour voir vos jeux de lobby et l\'historique des défis quotidiens.',
    memberSince: 'Membre depuis',
    stats: {
        totalGames: 'Total de Jeux',
        lobbyGames: 'Jeux de Lobby',
        dailyChallenges: 'Défis Quotidiens',
        completedDailyGames: 'Défis Complétés',
        won: 'gagnés'
    },
    navigation: {
        overview: 'Aperçu',
        lobbyHistory: 'Historique du Lobby',
        dailyHistory: 'Historique Quotidien'
    },
    lobbyHistory: {
        title: 'Historique des Jeux de Lobby',
        noGames: 'Pas encore de jeux de lobby',
        noGamesHint: 'Rejoignez un lobby multijoueur pour commencer à jouer!',
        errorLoading: 'Erreur lors du chargement de l\'historique',
        columns: {
            lobbyName: 'Nom du Lobby',
            status: 'Statut',
            score: 'Score',
            players: 'Joueurs',
            played: 'Joué'
        },
        status: {
            waiting: 'En attente',
            playing: 'En cours',
            finished: 'Terminé'
        },
        points: 'pts'
    },
    dailyHistory: {
        title: 'Historique des Défis Quotidiens',
        noChallenges: 'Aucun défi quotidien joué encore',
        noChallengesHint: 'Jouez le défi quotidien pour commencer à construire votre historique!',
        errorLoading: 'Erreur lors du chargement de l\'historique',
        columns: {
            date: 'Date',
            description: 'Description',
            year: 'Année',
            attempts: 'Tentatives',
            result: 'Résultat',
            played: 'Joué'
        },
        noDescription: 'Pas de description',
        wonOn: 'Gagné à',
        performance: {
            perfect: 'Parfait!',
            great: 'Super',
            good: 'Bien',
            complete: 'Complet',
            failed: 'Échoué',
            inProgress: 'En cours'
        }
    },
    pagination: {
        previous: 'Précédent',
        next: 'Suivant',
        page: 'Page',
        of: 'de'
    }
} as const
