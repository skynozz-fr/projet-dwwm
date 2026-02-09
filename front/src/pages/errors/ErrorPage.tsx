import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

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
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <Card variant="elevated" className="w-full max-w-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-7 w-7 text-error" />
        </div>
        <h2 className="mb-2 text-h3 text-foreground">{title}</h2>
        <p className="mb-7 text-muted-foreground">{message}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {showRetry && onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          {showGoBack && onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
