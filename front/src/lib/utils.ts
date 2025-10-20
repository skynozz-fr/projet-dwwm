import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export async function copyToClipboardWithToast(
  text: string,
  toast: { success: (title: string, description?: string) => void; error: (title: string, description?: string) => void },
  successMessage = 'Lien copié !',
  errorMessage = "Impossible de copier le lien"
) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage, 'Le lien a été copié dans le presse-papiers')
  } catch {
    toast.error('Erreur', errorMessage)
  }
}

// Récupère les prochains items (futurs) triés par date
export function getUpcomingItems<T extends { date: string }>(items: T[], limit = 3) {
  const today = new Date()
  return items
    .filter(item => new Date(item.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
}

// Récupère les derniers items (plus récents) triés par date
export function getLatestItems<T extends { date: string }>(items: T[], limit = 3) {
  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

// Filtre générique pour les listes avec recherche textuelle et filtrage par catégorie
export function filterItems<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  categoryFilter?: {
    field: keyof T
    value: string
    allValue?: string
  }
): T[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  return items.filter(item => {
    // Vérifier la recherche textuelle sur les champs spécifiés
    const passesTextFilter = searchFields.some(field => 
      String(item[field]).toLowerCase().includes(normalizedSearchTerm)
    )
    
    // Vérifier le filtre de catégorie si présent
    const passesFieldFilter = !categoryFilter || 
      categoryFilter.value === (categoryFilter.allValue || "all") || 
      item[categoryFilter.field] === categoryFilter.value
    
    return passesTextFilter && passesFieldFilter
  })
}