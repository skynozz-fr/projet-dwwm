import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export class UserController {
  /**
   * Liste tous les utilisateurs
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un utilisateur par ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }

      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour le rôle d'un utilisateur
   */
  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { role } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }

      const allowedRoles = ["USER", "ADMIN"] as const;
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Rôle invalide" });
      }

      const user = await userService.updateUserRole(id, role);
      res.json(user);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }
      next(error);
    }
  }

  /**
   * Récupère les users par rôle
   */

  async getUsersByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.params.role.toUpperCase();
      
      const allowedRoles = ["USER", "ADMIN"] as const;
      if (!allowedRoles.includes(role as any)) {
        return res.status(400).json({ error: "Rôle invalide" });
      }
      
      const users = await userService.getUsersByRole(role as any);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Utilisateur introuvable" });
      }
      next(error);
    }
  }
}

export const userController = new UserController();
