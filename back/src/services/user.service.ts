import { Role } from "@prisma/client";
import { prisma } from "../config/database";

export class UserService {
  /**
   * Récupère tous les utilisateurs
   */
  async getAllUsers() {
    return await prisma.user.findMany({ 
      orderBy: { id: "asc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: number) {
    return await prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  }

  /**
   * Récupère les users par rôle
   */
  async getUsersByRole(role: Role) {
    return await prisma.user.findMany({ 
      where: { role },
      orderBy: { id: "asc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  }


  /**
   * Récupère un utilisateur par email (avec mot de passe pour l'authentification)
   */
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN";
  }) {
    return await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: data.role || "USER",
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  }

  /**
   * Met à jour le rôle d'un utilisateur
   */
  async updateUserRole(id: number, role: Role) {
    return await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: number) {
    return await prisma.user.delete({ where: { id } });
  }

  /**
   * Vérifie si un email existe déjà
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    return !!user;
  }
}

export const userService = new UserService();
