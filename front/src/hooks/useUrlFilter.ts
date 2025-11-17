import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

type UseUrlFilterOptions = {
  paramName: string        // "competition", "category", "role", etc.
  defaultValue?: string    // "all" par défaut
}

export const useUrlFilter = ({ 
  paramName, 
  defaultValue = "all" 
}: UseUrlFilterOptions) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Valeur actuelle du filtre
  const filterValue = searchParams.get(paramName) || defaultValue
  
  // Fonction pour changer le filtre
  const setFilter = useCallback((value: string) => {
    const next = new URLSearchParams(searchParams)
    
    if (value === defaultValue) {
      next.delete(paramName)  // Retire du query si valeur par défaut
    } else {
      next.set(paramName, value)
    }
    
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams, paramName, defaultValue])
  
  return {
    filterValue,
    setFilter,
  }
}