import { api } from "@/lib/api"
import type { Match, MatchCompetition, MatchPayload } from "@/types/match"

export const getAllMatches = async (competition?: MatchCompetition): Promise<Match[]> => {
  const url = competition ? `/match/competition/${competition}` : "/match"
  const { data } = await api.get<Match[]>(url)
  return data
}

export const getMatchById = async (id: number): Promise<Match> => {
  const { data } = await api.get<Match>(`/match/${id}`)
  return data
}

export const createMatch = async (payload: MatchPayload): Promise<Match> => {
  const { data } = await api.post<Match>("/match", payload)
  return data
}

export const updateMatch = async (
  id: number,
  payload: Partial<MatchPayload>
): Promise<Match> => {
  const { data } = await api.patch<Match>(`/match/${id}`, payload)
  return data
}

export const deleteMatch = async (id: number): Promise<void> => {
  await api.delete(`/match/${id}`)
}
