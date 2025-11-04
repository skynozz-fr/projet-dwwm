import type { Match } from "@/types/match"

export const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

export const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

/**
 * Retourne le premier jour du mois (0 = Lundi, 6 = Dimanche)
 */
export const getFirstDayOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
}

/**
 * Retourne le nombre de jours dans le mois
 */
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/**
 * Retourne le nombre de jours dans le mois précédent
 */
export const getDaysInPrevMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
}

/**
 * Retourne les matchs pour une date donnée
 */
export const getMatchesForDate = (date: Date, matches: Match[]): Match[] => {
  const dateStr = date.toISOString().split('T')[0]
  return matches.filter(match => match.date.split('T')[0] === dateStr)
}

/**
 * Retourne la classe CSS pour le fond selon la compétition
 */
export const getCompetitionBgColor = (competition: string): string => {
  switch (competition) {
    case "LEAGUE":
      return "bg-primary text-primary-foreground"
    case "CUP":
      return "bg-secondary text-secondary-foreground"
    case "FRIENDLY":
      return "bg-tertiary text-tertiary-foreground"
    case "TOURNAMENT":
      return "bg-accent text-accent-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

/**
 * Retourne la classe CSS pour le point coloré selon la compétition
 */
export const getCompetitionDotColor = (competition: string): string => {
  switch (competition) {
    case "LEAGUE":
      return "bg-primary"
    case "CUP":
      return "bg-secondary"
    case "FRIENDLY":
      return "bg-tertiary"
    case "TOURNAMENT":
      return "bg-accent"
    default:
      return "bg-muted"
  }
}
