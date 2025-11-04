/**
 * Retourne les classes de couleur pour une compétition
 */
export const getCompetitionColor = (competition: string) => {
  switch (competition) {
    case "LEAGUE":
      return "text-primary"
    case "CUP":
      return "text-secondary"
    case "FRIENDLY":
      return "text-primary"
    case "TOURNAMENT":
      return "text-accent"
    case "OTHER":
      return "text-muted-foreground"
    default:
      return "text-muted-foreground"
  }
}

/**
 * Traduit une compétition en français
 */
export const translateCompetition = (competition: string) => {
  switch (competition) {
    case "LEAGUE":
      return "Championnat"
    case "CUP":
      return "Coupe"
    case "FRIENDLY":
      return "Amical"
    case "TOURNAMENT":
      return "Tournoi"
    case "OTHER":
      return "Autre"
    default:
      return competition
  }
}

/**
 * Traduit un statut de match en français
 */
export const translateMatchStatus = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return "À venir"
    case "ONGOING":
      return "En cours"
    case "COMPLETED":
      return "Terminé"
    case "POSTPONED":
      return "Reporté"
    case "CANCELLED":
      return "Annulé"
    default:
      return status
  }
}

/**
 * Retourne les classes de couleur pour un statut de match
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case "À venir":
      return "text-info"
    case "En cours":
      return "text-warning"
    case "Terminé":
      return "text-success"
    case "Reporté":
      return "text-accent"
    case "Annulé":
      return "text-error"
    default:
      return "text-muted"
  }
}

/**
 * Options de compétitions pour Select
 */
export const competitionOptions = [
  { value: "LEAGUE", label: "Championnat" },
  { value: "CUP", label: "Coupe" },
  { value: "FRIENDLY", label: "Amical" },
  { value: "TOURNAMENT", label: "Tournoi" },
  { value: "OTHER", label: "Autre" },
]

/**
 * Options de compétitions pour les filtres (avec "all")
 */
export const competitionFilterOptions = [
  { value: "all", label: "Toutes les compétitions" },
  ...competitionOptions,
]

/**
 * Options de statuts pour Select
 */
export const statusOptions = [
  { value: "SCHEDULED", label: "À venir" },
  { value: "ONGOING", label: "En cours" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "POSTPONED", label: "Reporté" },
  { value: "CANCELLED", label: "Annulé" },
]

/**
 * Options météo pour Select
 */
export const weatherOptions = [
  { value: "", label: "Non renseigné" },
  { value: "Ensoleillé", label: "Ensoleillé" },
  { value: "Nuageux", label: "Nuageux" },
  { value: "Pluvieux", label: "Pluvieux" },
  { value: "Orageux", label: "Orageux" },
  { value: "Neigeux", label: "Neigeux" },
]