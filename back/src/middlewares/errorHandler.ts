import { Request, Response, NextFunction } from "express";

/**
 * Middleware de gestion centralisée des erreurs
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Erreur:", error);

  // Erreur Prisma - enregistrement non trouvé
  if (error.code === "P2025") {
    return res.status(404).json({
      error: "Ressource introuvable",
      details: error.meta?.cause || error.message,
    });
  }

  // Erreur Prisma - contrainte unique violée
  if (error.code === "P2002") {
    return res.status(409).json({
      error: "Conflit: ressource déjà existante",
      details: error.meta?.target || "Contrainte d'unicité violée",
    });
  }

  // Erreur de validation
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Erreur de validation",
      details: error.message,
    });
  }

  // Erreur JWT
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expiré",
    });
  }

  // Erreur par défaut
  res.status(error.statusCode || 500).json({
    error: error.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
    method: req.method,
  });
};
