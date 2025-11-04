import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthedRequest } from "../middlewares/auth.middleware";

export class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstname, lastname, email, password, role } = req.body;

      // Validation des champs requis
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
          error: "firstname, lastname, email, password requis",
        });
      }

      const result = await authService.register({
        firstname,
        lastname,
        email,
        password,
        role,
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({ error: "Email déjà utilisé" });
      }
      next(error);
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validation des champs requis
      if (!email || !password) {
        return res.status(400).json({ error: "email et password requis" });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "Email ou mot de passe invalide" });
      }
      next(error);
    }
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const user = await authService.getProfile(req.user.id);
      res.json(user);
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();
