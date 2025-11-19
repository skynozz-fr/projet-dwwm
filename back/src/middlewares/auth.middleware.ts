import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; role: "USER" | "ADMIN" };
}

/**
 * Middleware pour protéger les routes qui nécessitent une authentification
 */
export const authGuard = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = verifyToken(token) as any;
    req.user = { 
      id: decoded.id, 
      email: decoded.email, 
      role: decoded.role 
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

/**
 * Middleware pour vérifier que l'utilisateur est un admin
 */
export const adminGuard = (req: AuthedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Accès refusé: admin requis" });
  }
  
  next();
};
