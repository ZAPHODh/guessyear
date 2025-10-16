export default {
    title: 'Profile',
    description: 'View your gaming profile, stats, and history',
    welcome: 'Welcome to your profile!',
    navigationHint: 'Use the navigation above to view your lobby games and daily challenge history.',
    memberSince: 'Member since',
    stats: {
        totalGames: 'Total Games',
        lobbyGames: 'Lobby Games',
        dailyChallenges: 'Daily Challenges',
        completedDailyGames: 'Completed Daily Games',
        won: 'won'
    },
    navigation: {
        overview: 'Overview',
        lobbyHistory: 'Lobby History',
        dailyHistory: 'Daily History'
    },
    lobbyHistory: {
        title: 'Lobby Game History',
        noGames: 'No lobby games yet',
        noGamesHint: 'Join a multiplayer lobby to start playing!',
        errorLoading: 'Error loading history',
        columns: {
            lobbyName: 'Lobby Name',
            status: 'Status',
            score: 'Score',
            players: 'Players',
            played: 'Played'
        },
        status: {
            waiting: 'Waiting',
            playing: 'Playing',
            finished: 'Finished'
        },
        points: 'pts'
    },
    dailyHistory: {
        title: 'Daily Challenge History',
        noChallenges: 'No daily challenges played yet',
        noChallengesHint: 'Play the daily challenge to start building your history!',
        errorLoading: 'Error loading history',
        columns: {
            date: 'Date',
            description: 'Description',
            year: 'Year',
            attempts: 'Attempts',
            result: 'Result',
            played: 'Played'
        },
        noDescription: 'No description',
        wonOn: 'Won on',
        performance: {
            perfect: 'Perfect!',
            great: 'Great',
            good: 'Good',
            complete: 'Complete',
            failed: 'Failed',
            inProgress: 'In Progress'
        }
    },
    pagination: {
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of'
    }
} as const
