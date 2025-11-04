import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { authGuard, adminGuard } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route   GET /news
 * @desc    Récupère toutes les actualités
 * @access  Public
 */
router.get("/", (req, res, next) =>
  newsController.getAllNews(req, res, next)
);

/**
 * @route   GET /news/:id
 * @desc    Récupère une actualité par son ID
 * @access  Public
 */
router.get("/:id", (req, res, next) =>
  newsController.getNewsById(req, res, next)
);

/**
 * @route   GET /news/category/:category
 * @desc    Récupère les actualités par catégorie
 * @access  Public
 */
router.get("/category/:category", (req, res, next) =>
  newsController.getNewsByCategory(req, res, next)
);

/**
 * @route   POST /news
 * @desc    Crée une nouvelle actualité
 * @access  Private (Admin uniquement)
 */
router.post("/", authGuard, adminGuard, (req, res, next) =>
  newsController.createNews(req, res, next)
);

/**
 * @route   PATCH /news/:id
 * @desc    Met à jour une actualité
 * @access  Private (Admin uniquement)
 */
router.patch("/:id", authGuard, adminGuard, (req, res, next) =>
  newsController.updateNews(req, res, next)
);

/**
 * @route   DELETE /news/:id
 * @desc    Supprime une actualité
 * @access  Private (Admin uniquement)
 */
router.delete("/:id", authGuard, adminGuard, (req, res, next) =>
  newsController.deleteNews(req, res, next)
);

export default router;
