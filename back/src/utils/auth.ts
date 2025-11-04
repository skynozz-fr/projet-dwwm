import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const JWT_EXPIRES = (process.env.JWT_EXPIRES || "7d") as string;

/**
 * Hash un mot de passe avec bcrypt
 */
export const hashPassword = (raw: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(raw, salt);
};

/**
 * Compare un mot de passe brut avec un hash
 */
export const comparePassword = (raw: string, hash: string): boolean => {
  return bcrypt.compareSync(raw, hash);
};

/**
 * Génère un token JWT
 */
export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as SignOptions);
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
