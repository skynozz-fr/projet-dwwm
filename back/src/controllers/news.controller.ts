import { Request, Response, NextFunction } from "express";
import { newsService } from "../services/news.service";
import { AuthedRequest } from "../middlewares/auth.middleware";
import { NewsCategory } from "@prisma/client";

export class NewsController {
  /**
   * Récupère toutes les actualités
   */
  async getAllNews(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAllNews();
      res.json(news);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère une actualité par son ID
   */
  async getNewsById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const news = await newsService.getNewsById(id);

      if (!news) {
        return res.status(404).json({ error: "Actualité introuvable" });
      }

      res.json(news);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère les actualités par catégorie
   */
  async getNewsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.params.category.toUpperCase() as NewsCategory;

      if (!["TRANSFER", "MATCH", "OTHER"].includes(category)) {
        return res.status(400).json({ error: "Catégorie invalide" });
      }

      const news = await newsService.getNewsByCategory(category);
      res.json(news);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crée une nouvelle actualité
   */
  async createNews(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const { title, category, excerpt, content } = req.body;

      // Validation des champs requis
      if (!title || !excerpt || !content) {
        return res.status(400).json({
          error: "title, excerpt, content requis",
        });
      }

      // Validation de la catégorie
      if (!category || !["TRANSFER", "MATCH", "OTHER"].includes(category.toUpperCase())) {
        return res.status(400).json({ error: "Catégorie invalide" });
      }

      const news = await newsService.createNews({
        title,
        author_id: req.user.id,
        category: category.toUpperCase() as NewsCategory,
        excerpt,
        content,
      });

      res.status(201).json(news);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour une actualité
   */
  async updateNews(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const id = req.params.id;

      const exists = await newsService.newsExists(id);
      if (!exists) {
        return res.status(404).json({ error: "Actualité introuvable" });
      }

      const { title, category, excerpt, content } = req.body;

      // Validation de la catégorie si fournie
      if (category && !["TRANSFER", "MATCH", "OTHER"].includes(category.toUpperCase())) {
        return res.status(400).json({ error: "Catégorie invalide" });
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (category) updateData.category = category.toUpperCase() as NewsCategory;
      if (excerpt) updateData.excerpt = excerpt;
      if (content) updateData.content = content;
      updateData.updated_by_id = req.user.id;

      const news = await newsService.updateNews(id, updateData);

      res.json(news);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime une actualité
   */
  async deleteNews(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const id = req.params.id;

      const exists = await newsService.newsExists(id);
      if (!exists) {
        return res.status(404).json({ error: "Actualité introuvable" });
      }

      await newsService.deleteNews(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const newsController = new NewsController();
