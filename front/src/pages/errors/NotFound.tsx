import { Card } from "@/components/ui/card"
import { Button } from "@/components/Button"
import { useNavigate } from "react-router-dom"

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 border border-border shadow-lg text-center">
        <div className="mb-6">
          <img src="/favicon.svg" alt="Logo" className="mx-auto h-12 w-12 mb-2 opacity-80" />
          <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page introuvable</h2>
          <p className="text-muted-foreground mb-4">Oups ! La page que vous cherchez n'existe pas ou a été déplacée.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
      </Card>
    </div>
  )
}