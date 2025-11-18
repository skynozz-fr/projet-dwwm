import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

export const copyToClipboardWithToast = async (
  text: string,
  toast: { success: (title: string, description?: string) => void; error: (title: string, description?: string) => void },
  successMessage = 'Lien copié !',
  errorMessage = "Impossible de copier le lien"
) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage, 'Le lien a été copié avec succès.')
  } catch {
    toast.error('Erreur', errorMessage)
  }
}

// Récupère les prochains items (futurs) triés par date (inclut la journée actuelle)
export const getUpcomingItems = <T extends { date: string }>(items: T[], limit = 3) => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  return items
    .filter(item => {
      const d = new Date(item.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime() >= startOfToday.getTime()
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
}

// Récupère les derniers items (plus récents) triés par date
export const getLatestItems = <T extends { created_at: string }>(items: T[], limit = 3) => {
  return items
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

// Recherche textuelle sur plusieurs champs d'un objet
export const searchItems = <T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  
  if (!normalizedSearch) return items

  return items.filter(item => 
    searchFields.some(field => 
      String(item[field]).toLowerCase().includes(normalizedSearch)
    )
  )
}