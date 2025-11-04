import { Request, Response, NextFunction } from "express"
import { matchService } from "../services/match.service"
import { AuthedRequest } from "../middlewares/auth.middleware"
import { MatchCompetition, StatusCategory } from "@prisma/client"

export class MatchController {
  /**
   * Récupère tous les matchs
   */
  async getAllMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await matchService.getAllMatches()
      res.json(matches)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Récupère un match par son ID
   */
  async getMatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" })
      }

      const match = await matchService.getMatchById(id)

      if (!match) {
        return res.status(404).json({ error: "Match introuvable" })
      }

      res.json(match)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Récupère les matchs par compétition
   */
  async getMatchesByCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const competition = req.params.competition.toUpperCase() as MatchCompetition

      if (!["FRIENDLY", "LEAGUE", "CUP", "TOURNAMENT", "OTHER"].includes(competition)) {
        return res.status(400).json({ error: "Compétition invalide" })
      }

      const matches = await matchService.getMatchesByCompetition(competition)
      res.json(matches)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Crée un nouveau match
   */
  async createMatch(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" })
      }

      const {
        home_team,
        away_team,
        is_home,
        date,
        time,
        venue,
        location,
        competition,
        status,
        home_score,
        away_score,
        description,
        referee,
        weather
      } = req.body

      // Validation des champs requis
      if (!home_team || !away_team || is_home === undefined || !date || !time || !venue || !location || !competition) {
        return res.status(400).json({
          error: "home_team, away_team, is_home, date, time, venue, location, competition requis"
        })
      }

      // Validation de la compétition
      if (!["FRIENDLY", "LEAGUE", "CUP", "TOURNAMENT", "OTHER"].includes(competition.toUpperCase())) {
        return res.status(400).json({ error: "Compétition invalide" })
      }

      // Validation du statut si fourni
      if (status && !["SCHEDULED", "ONGOING", "COMPLETED", "POSTPONED", "CANCELLED"].includes(status.toUpperCase())) {
        return res.status(400).json({ error: "Statut invalide" })
      }

      const match = await matchService.createMatch({
        home_team,
        away_team,
        is_home,
        date: new Date(date),
        time,
        venue,
        location,
        competition: competition.toUpperCase() as MatchCompetition,
        status: status?.toUpperCase() as StatusCategory,
        home_score: home_score !== undefined ? parseInt(home_score) : null,
        away_score: away_score !== undefined ? parseInt(away_score) : null,
        description,
        referee,
        weather
      })

      res.status(201).json(match)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Met à jour un match
   */
  async updateMatch(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" })
      }

      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" })
      }

      const exists = await matchService.matchExists(id)
      if (!exists) {
        return res.status(404).json({ error: "Match introuvable" })
      }

      const {
        home_team,
        away_team,
        is_home,
        date,
        time,
        venue,
        location,
        competition,
        status,
        home_score,
        away_score,
        description,
        referee,
        weather
      } = req.body

      // Validation de la compétition si fournie
      if (competition && !["FRIENDLY", "LEAGUE", "CUP", "TOURNAMENT", "OTHER"].includes(competition.toUpperCase())) {
        return res.status(400).json({ error: "Compétition invalide" })
      }

      // Validation du statut si fourni
      if (status && !["SCHEDULED", "ONGOING", "COMPLETED", "POSTPONED", "CANCELLED"].includes(status.toUpperCase())) {
        return res.status(400).json({ error: "Statut invalide" })
      }

      const updateData: any = {}
      if (home_team) updateData.home_team = home_team
      if (away_team) updateData.away_team = away_team
      if (is_home !== undefined) updateData.is_home = is_home
      if (date) updateData.date = new Date(date)
      if (time) updateData.time = time
      if (venue) updateData.venue = venue
      if (location) updateData.location = location
      if (competition) updateData.competition = competition.toUpperCase() as MatchCompetition
      if (status) updateData.status = status.toUpperCase() as StatusCategory
      if (home_score !== undefined) updateData.home_score = home_score !== null ? parseInt(home_score) : null
      if (away_score !== undefined) updateData.away_score = away_score !== null ? parseInt(away_score) : null
      if (description !== undefined) updateData.description = description
      if (referee !== undefined) updateData.referee = referee
      if (weather !== undefined) updateData.weather = weather

      const match = await matchService.updateMatch(id, updateData)

      res.json(match)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Supprime un match
   */
  async deleteMatch(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" })
      }

      const id = parseInt(req.params.id)

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" })
      }

      const exists = await matchService.matchExists(id)
      if (!exists) {
        return res.status(404).json({ error: "Match introuvable" })
      }

      await matchService.deleteMatch(id)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export const matchController = new MatchController();
