import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authGuard, adminGuard } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route   GET /api/user
 * @desc    Récupère tous les utilisateurs
 * @access  Admin
 */
router.get("/", authGuard, adminGuard, (req, res, next) =>
  userController.getAllUsers(req, res, next)
);

/**
 * @route   GET /api/user/:id
 * @desc    Récupère un utilisateur par ID
 * @access  Admin
 */
router.get("/:id", authGuard, adminGuard, (req, res, next) =>
  userController.getUserById(req, res, next)
);

/**
 * @route   GET /api/user/role/:role
 * @desc    Récupère les utilisateurs par rôle
 * @access  Admin
 */
router.get("/role/:role", authGuard, adminGuard, (req, res, next) =>
  userController.getUsersByRole(req, res, next)
);

/**
 * @route   PATCH /api/user/:id/role
 * @desc    Met à jour le rôle d'un utilisateur
 * @access  Admin
 */
router.patch("/:id/role", authGuard, adminGuard, (req, res, next) =>
  userController.updateUserRole(req, res, next)
);

/**
 * @route   DELETE /api/user/:id
 * @desc    Supprime un utilisateur
 * @access  Admin
 */
router.delete("/:id", authGuard, adminGuard, (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
