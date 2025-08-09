import { useState, useEffect } from "react"
import { toastStore } from "@/lib/toast-store"
import type { ToastState } from "@/lib/toast-store"

// Hook pour utiliser les toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])
  
  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts)
    return unsubscribe
  }, [])
  
  const toast = {
    success: (title: string, message?: string, duration?: number) => 
      toastStore.addToast({ type: "success", title, message, duration }),
    error: (title: string, message?: string, duration?: number) => 
      toastStore.addToast({ type: "error", title, message, duration }),
    warning: (title: string, message?: string, duration?: number) => 
      toastStore.addToast({ type: "warning", title, message, duration }),
    info: (title: string, message?: string, duration?: number) => 
      toastStore.addToast({ type: "info", title, message, duration })
  }
  
  return { toast, toasts }
}
