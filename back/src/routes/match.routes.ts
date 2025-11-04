import { Router } from "express"
import { matchController } from "../controllers/match.controller"
import { authGuard, adminGuard } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @route   GET /match
 * @desc    Récupère tous les matchs
 * @access  Public
 */
router.get("/", (req, res, next) =>
  matchController.getAllMatches(req, res, next)
)

/**
 * @route   GET /match/:id
 * @desc    Récupère un match par son ID
 * @access  Public
 */
router.get("/:id", (req, res, next) =>
  matchController.getMatchById(req, res, next)
)

/**
 * @route   GET /match/competition/:competition
 * @desc    Récupère les matchs par compétition
 * @access  Public
 */
router.get("/competition/:competition", (req, res, next) =>
  matchController.getMatchesByCompetition(req, res, next)
)

/**
 * @route   POST /match
 * @desc    Crée un nouveau match
 * @access  Private (Admin uniquement)
 */
router.post("/", authGuard, adminGuard, (req, res, next) =>
  matchController.createMatch(req, res, next)
)

/**
 * @route   PATCH /match/:id
 * @desc    Met à jour un match
 * @access  Private (Admin uniquement)
 */
router.patch("/:id", authGuard, adminGuard, (req, res, next) =>
  matchController.updateMatch(req, res, next)
)

/**
 * @route   DELETE /match/:id
 * @desc    Supprime un match
 * @access  Private (Admin uniquement)
 */
router.delete("/:id", authGuard, adminGuard, (req, res, next) =>
  matchController.deleteMatch(req, res, next)
)

export default router
