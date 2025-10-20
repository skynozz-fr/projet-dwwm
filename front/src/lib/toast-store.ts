export type ToastProps = {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export type ToastState = ToastProps & {
  id: string
  visible: boolean
}

let toastId = 0

// Store global pour les toasts
export const toastStore = {
  toasts: [] as ToastState[],
  listeners: [] as ((toasts: ToastState[]) => void)[],
  
  addToast: (toast: ToastProps) => {
    const id = `toast-${++toastId}-${Date.now()}`
    const newToast: ToastState = {
      ...toast,
      id,
      visible: true,
      duration: toast.duration || 3000
    }
    
    toastStore.toasts = [...toastStore.toasts, newToast] // Crée un nouveau tableau
    toastStore.notify()
    
    // Auto-remove après la durée spécifiée
    setTimeout(() => {
      toastStore.removeToast(id)
    }, newToast.duration)
    
    return id
  },
  
  removeToast: (id: string) => {
    toastStore.toasts = toastStore.toasts.filter(t => t.id !== id)
    toastStore.notify()
  },
  
  notify: () => {
    toastStore.listeners.forEach(listener => listener(toastStore.toasts))
  },
  
  subscribe: (listener: (toasts: ToastState[]) => void) => {
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
  }
}
