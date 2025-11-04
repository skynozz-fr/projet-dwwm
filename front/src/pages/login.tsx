import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn, User, Mail } from "lucide-react"
import { RequiredInput } from "@/components/ui/required-input"
import { SimplePasswordInput } from "@/components/ui/simple-password-input"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/Button"
import { useAuth } from "@/hooks/useAuth"

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Vérifier si le formulaire est valide (email et mot de passe non vides)
  const isFormValid = email.trim() !== "" && password.trim() !== ""

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie", "Bienvenue !");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string }; status?: number } };
      const msg =
        error?.response?.data?.error ||
        (error?.response?.status === 401
          ? "Email ou mot de passe incorrect"
          : "Impossible de se connecter");
      toast.error("Erreur de connexion", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Connexion
          </h1>
          <p className="text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <RequiredInput
              label="Adresse email"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
            
            <SimplePasswordInput
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChange={setPassword}
              required={true}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 mr-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        {/* Lien invité */}
        <div className="text-center">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            <User className="w-4 h-4" />
            Continuer en tant qu'invité
          </Link>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        {/* Liens supplémentaires */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link 
            to="/register"
            className="hover:text-primary font-medium underline underline-offset-4"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
