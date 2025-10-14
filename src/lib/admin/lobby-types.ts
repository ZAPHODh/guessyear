export interface LobbyPlayer {
  id: string
  username: string
  score: number
  isReady: boolean
  isEliminated: boolean
  user: {
    id: string
    name: string | null
    email: string | null
  } | null
}

export interface Lobby {
  id: string
  name: string
  description: string | null
  isOpen: boolean
  maxPlayers: number
  rounds: number
  roundTimer: number
  betweenRoundsTimer: number
  gameMode: string
  status: string
  currentRound: number
  hintsEnabled: boolean
  targetScore: number | null
  inviteCode: string | null
  createdAt: Date
  updatedAt: Date
  host: {
    id: string
    name: string | null
    email: string | null
  }
  players: LobbyPlayer[]
  _count: {
    players: number
    gameRounds: number
    chatMessages: number
  }
}

export interface DetailedLobby extends Lobby {
  gameRounds: Array<{
    id: string
    roundNumber: number
    status: string
    startedAt: Date | null
    endedAt: Date | null
    image: {
      id: string
      year: number
      cloudinaryUrl: string
    }
    guesses: Array<{
      id: string
      year: number
      points: number
      speedBonus: number
      accuracy: number
      player: {
        username: string
      }
    }>
  }>
  chatMessages: Array<{
    id: string
    username: string
    message: string
    type: string
    createdAt: Date
  }>
}
