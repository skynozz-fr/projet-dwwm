import { prisma } from "../config/database";
import { NewsCategory } from "@prisma/client";

export class NewsService {
  /**
   * Récupère toutes les actualités avec leurs auteurs
   */
  async getAllNews() {
    return await prisma.news.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Récupère une actualité par son ID
   */
  async getNewsById(id: string) {
    return await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Récupère les actualités par catégorie
   */
  async getNewsByCategory(category: NewsCategory) {
    return await prisma.news.findMany({
      where: { category },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Crée une nouvelle actualité
   */
  async createNews(data: {
    title: string;
    author_id: string;
    category: NewsCategory;
    excerpt: string;
    content: string;
  }) {
    return await prisma.news.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Met à jour une actualité
   */
  async updateNews(
    id: string,
    data: {
      title?: string;
      category?: NewsCategory;
      excerpt?: string;
      content?: string;
    }
  ) {
    return await prisma.news.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Supprime une actualité
   */
  async deleteNews(id: string) {
    return await prisma.news.delete({
      where: { id },
    });
  }

  /**
   * Vérifie si une actualité existe
   */
  async newsExists(id: string): Promise<boolean> {
    const count = await prisma.news.count({
      where: { id },
    });
    return count > 0;
  }
}

export const newsService = new NewsService();
