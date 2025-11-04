import type { Role } from "@/types/user"

/**
 * Traduit un rôle en français
 */
export const translateRole = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "Administrateur"
    case "USER":
      return "Utilisateur"
    default:
      return role
  }
}

/**
 * Options de rôles pour les formulaires (sans "all")
 */
export const roleOptions = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "USER", label: "Utilisateur" },
]

/**
 * Options de rôles pour les filtres (avec "all")
 */
export const roleFilterOptions = [
  { value: "all", label: "Tous les rôles" },
  ...roleOptions,
]
