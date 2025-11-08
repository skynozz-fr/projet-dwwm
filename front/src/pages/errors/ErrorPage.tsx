import { Button } from "@/components/Button"
import { Card } from "@/components/ui/card"
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"

type ErrorPageProps = {
  title?: string
  message?: string
  onRetry?: () => void
  onGoBack?: () => void
  showRetry?: boolean
  showGoBack?: boolean
}

export const ErrorPage = ({
  title = "Une erreur est survenue",
  message = "Impossible de charger les données. Veuillez réessayer plus tard.",
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = true,
}: ErrorPageProps) => {
  return (
  <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 border border-border shadow-lg text-center">
        <div className="mb-6">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          )}
          {showGoBack && onGoBack && (
            <Button onClick={onGoBack} variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}