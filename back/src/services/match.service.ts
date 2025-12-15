import { prisma } from "../config/database"
import { MatchCompetition, MatchStatus } from "@prisma/client"

export class MatchService {
  /**
   * Récupère tous les matchs
   */
  async getAllMatches() {
    return await prisma.match.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        updated_by: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        datetime: "desc",
      },
    })
  }

  /**
   * Récupère un match par son ID
   */
  async getMatchById(id: string) {
    return await prisma.match.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        updated_by: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * Récupère les matchs par compétition
   */
  async getMatchesByCompetition(competition: MatchCompetition) {
    return await prisma.match.findMany({
      where: { competition },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        updated_by: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        datetime: "desc",
      },
    })
  }

  /**
   * Crée un nouveau match
   */
  async createMatch(data: {
    home_team: string
    away_team: string
    is_home: boolean
    datetime: string
    venue: string
    location: string
    competition: MatchCompetition
    status?: MatchStatus
    home_score?: number | null
    away_score?: number | null
    description?: string | null
    referee?: string | null
    weather?: string | null
    author_id: string
  }) {
    return await prisma.match.create({
      data: {
        home_team: data.home_team,
        away_team: data.away_team,
        is_home: data.is_home,
        datetime: new Date(data.datetime),
        venue: data.venue,
        location: data.location,
        competition: data.competition,
        status: data.status || "SCHEDULED",
        home_score: data.home_score,
        away_score: data.away_score,
        description: data.description,
        referee: data.referee,
        weather: data.weather,
        author_id: data.author_id,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * Met à jour un match
   */
  async updateMatch(
    id: string,
    data: {
      home_team?: string
      away_team?: string
      is_home?: boolean
      datetime?: string
      venue?: string
      location?: string
      competition?: MatchCompetition
      status?: MatchStatus
      home_score?: number | null
      away_score?: number | null
      description?: string | null
      referee?: string | null
      weather?: string | null
      updated_by_id: string
    }
  ) {
    // Si le statut change et n'est plus COMPLETED, remettre les scores à null
    const updateData: any = { ...data }
    if (data.status && data.status !== "COMPLETED") {
      updateData.home_score = null
      updateData.away_score = null
    }

    // Convertir datetime string en Date si présent
    if (data.datetime) {
      updateData.datetime = new Date(data.datetime)
    }

    updateData.updated_by_id = data.updated_by_id

    return await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        updated_by: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    })
  }

  /**
   * Supprime un match
   */
  async deleteMatch(id: string) {
    return await prisma.match.delete({
      where: { id },
    })
  }

  /**
   * Vérifie si un match existe
   */
  async matchExists(id: string): Promise<boolean> {
    const count = await prisma.match.count({
      where: { id },
    })
    return count > 0
  }
}

export const matchService = new MatchService()

