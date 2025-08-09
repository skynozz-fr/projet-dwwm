import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import type { ToastState } from "@/lib/toast-store"
import { toastStore } from "@/lib/toast-store"

// Composant Toast individuel
const Toast = ({ toast }: { toast: ToastState }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  
  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])
  
  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      toastStore.removeToast(toast.id)
      toast.onClose?.()
    }, 300)
  }
  
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" style={{ color: 'var(--success)' }} />
      case "error":
        return <XCircle className="w-5 h-5 text-error" style={{ color: 'var(--error)' }} />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" style={{ color: 'var(--warning)' }} />
      case "info":
        return <Info className="w-5 h-5 text-info" style={{ color: 'var(--info)' }} />
    }
  }
  
  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-4 border-success"
      case "error":
        return "border-l-4 border-error"
      case "warning":
        return "border-l-4 border-warning"
      case "info":
        return "border-l-4 border-info"
    }
  }
  
  return (
    <div
      className={`
        ${getBorderColor()}
        bg-background border border-border rounded-lg shadow-lg p-4 mb-3 min-w-80 max-w-md
        transition-all duration-300 ease-out transform
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-muted-foreground mt-1">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Composant conteneur pour tous les toasts
export const ToastContainer = () => {
  const { toasts } = useToast()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
