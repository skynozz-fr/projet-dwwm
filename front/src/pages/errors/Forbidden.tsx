import { Card } from "@/components/ui/card"
import { Button } from "@/components/Button"
import { useNavigate } from "react-router-dom"

export const Forbidden = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
			<Card className="max-w-md w-full p-8 border border-border shadow-lg text-center">
				<div className="mb-6">
					<img src="/favicon.svg" alt="Logo" className="mx-auto h-12 w-12 mb-2 opacity-80" />
					<h1 className="text-4xl font-bold text-primary mb-2">403</h1>
					<h2 className="text-xl font-semibold text-foreground mb-2">Accès refusé</h2>
					<p className="text-muted-foreground mb-4">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
				</div>
				<Button variant="primary" onClick={() => navigate("/")}>
					Retour à l'accueil
				</Button>
			</Card>
		</div>
	)
}
