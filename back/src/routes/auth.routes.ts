import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post("/register", (req, res, next) =>
  authController.register(req, res, next)
);

/**
 * @route   POST /auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post("/login", (req, res, next) =>
  authController.login(req, res, next)
);

/**
 * @route   GET /me
 * @desc    Récupère le profil de l'utilisateur connecté
 * @access  Private
 */
router.get("/me", authGuard, (req, res, next) =>
  authController.getProfile(req, res, next)
);

export default router;
