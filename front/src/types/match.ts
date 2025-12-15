export type MatchCompetition = "FRIENDLY" | "LEAGUE" | "CUP" | "TOURNAMENT" | "OTHER"
export type MatchStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "POSTPONED" | "CANCELLED"

export type MatchPayload = {
  home_team: string
  away_team: string
  is_home: boolean
  datetime: string
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
  id: string
  home_team: string
  away_team: string
  is_home: boolean
  datetime: string
  venue: string
  location: string
  competition: MatchCompetition
  status: MatchStatus
  home_score?: number | null
  away_score?: number | null
  description?: string
  referee?: string
  weather?: string
  author_id?: string | null
  updated_by_id?: string | null
  created_at: string
  updated_at?: string
}