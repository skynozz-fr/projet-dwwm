import { userService } from "./user.service";
import { hashPassword, comparePassword, signToken } from "../lib/auth";

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN";
  }) {
    // Vérifier si l'email existe déjà
    const emailExists = await userService.emailExists(data.email);
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Créer l'utilisateur avec le mot de passe hashé
    const user = await userService.createUser({
      ...data,
      password: hashPassword(data.password),
      role: data.role === "ADMIN" ? "ADMIN" : "USER",
    });

    // Générer le token JWT
    const token = signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    return { user, token };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string) {
    // Récupérer l'utilisateur avec le mot de passe
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Vérifier le mot de passe
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Générer le token JWT
    const token = signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  /**
   * Récupère le profil de l'utilisateur authentifié
   */
  async getProfile(userId: string) {
    const user = await userService.getUserById(userId);
    
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    
    return user;
  }
}

export const authService = new AuthService();
