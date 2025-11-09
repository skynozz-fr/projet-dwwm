export type MatchCompetition = "FRIENDLY" | "LEAGUE" | "CUP" | "TOURNAMENT" | "OTHER"
export type MatchStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "POSTPONED" | "CANCELLED"

export type MatchPayload = {
  home_team: string
  away_team: string
  is_home: boolean
  date: string
  time: string
  venue: string
  location: string
  competition: MatchCompetition
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  description: string | null
  referee: string | null
  weather: string | null
}

export type Match = {
  id: number
  home_team: string
  away_team: string
  is_home: boolean
  date: string
  time: string
  venue: string
  location: string
  competition: MatchCompetition
  status: MatchStatus
  home_score?: number | null
  away_score?: number | null
  description?: string
  referee?: string
  weather?: string
  created_at: string
  updated_at?: string
}