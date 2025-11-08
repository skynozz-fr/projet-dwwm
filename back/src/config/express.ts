import express, { Application } from "express";
import cors from "cors";
import { errorHandler, notFoundHandler } from "../middlewares/errorHandler";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import newsRoutes from "../routes/news.routes";
import matchRoutes from "../routes/match.routes";

/**
 * Configure l'application Express avec tous les middlewares et routes
 */
export const configureApp = (app: Application): void => {
  // Middlewares de base
  app.use(cors({ 
    origin: process.env.FRONT_URL || "http://localhost:5173",
    credentials: true 
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes d'authentification
  app.use("/auth", authRoutes);

  // Routes User
  app.use("/user", userRoutes);
  
  // Routes News
  app.use("/news", newsRoutes);

  // Routes Matches
  app.use("/match", matchRoutes);

  // Gestion des erreurs
  app.use(notFoundHandler);
  app.use(errorHandler);
};
