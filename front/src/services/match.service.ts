import { api } from "@/lib/api"
import type { Match, MatchCompetition, MatchStatus } from "@/types/match"

export const getAllMatches = async (competition?: MatchCompetition): Promise<Match[]> => {
  const url = competition ? `/match/competition/${competition}` : "/match"
  const { data } = await api.get<Match[]>(url)
  return data
}

export const getMatchById = async (id: number): Promise<Match> => {
  const { data } = await api.get<Match>(`/match/${id}`)
  return data
}

export const createMatch = async (payload: {
  home_team: string
  away_team: string
  is_home: boolean
  date: string
  time: string
  venue: string
  location: string
  competition: MatchCompetition
  status?: MatchStatus
  home_score?: number | null
  away_score?: number | null
  description?: string | null
  referee?: string | null
  weather?: string | null
}): Promise<Match> => {
  const { data } = await api.post<Match>("/match", payload)
  return data
}

export const updateMatch = async (
  id: number,
  payload: {
    home_team?: string
    away_team?: string
    is_home?: boolean
    date?: string
    time?: string
    venue?: string
    location?: string
    competition?: MatchCompetition
    status?: MatchStatus
    home_score?: number | null
    away_score?: number | null
    description?: string | null
    referee?: string | null
    weather?: string | null
  }
): Promise<Match> => {
  const { data } = await api.patch<Match>(`/match/${id}`, payload)
  return data
}

export const deleteMatch = async (id: number): Promise<void> => {
  await api.delete(`/match/${id}`)
}
