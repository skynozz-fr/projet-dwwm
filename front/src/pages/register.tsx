import React, { useState } from "react"
import { Link } from "react-router-dom"
import { UserPlus, User, ArrowLeft, CheckIcon, XIcon, Mail } from "lucide-react"
import { RequiredInput } from "@/components/ui/required-input"
import { PasswordStrengthInput } from "@/components/ui/password-strength-input"
import { useToast } from "@/hooks/useToast"
import { ToastContainer } from "@/components/ui/toast"
import { Button } from "@/components/Button"

export const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const { toast } = useToast()

  // Vérifier si le formulaire est valide
  const isFormValid = 
    firstName.trim() !== "" && 
    lastName.trim() !== "" && 
    email.trim() !== "" && 
    isPasswordValid && 
    password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Vérifier si les mots de passe correspondent
      if (password !== confirmPassword) {
        toast.error("Erreur", "Les mots de passe ne correspondent pas")
        return
      }

      // Simulation d'une requête d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulation d'une vérification d'inscription
      // Remplacez cette logique par votre vraie API d'inscription
      if (email === "existing@example.com") {
        toast.error("Erreur d'inscription", "Cette adresse email est déjà utilisée")
      } else {
        toast.success("Inscription réussie", "Bienvenue ! Votre compte a été créé avec succès.")
        // Rediriger vers la page de connexion ou tableau de bord
        // navigate("/login")
      }
    } catch {
      toast.error("Erreur d'inscription", "Une erreur s'est produite lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Lien retour */}
        <div className="flex items-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Créer un compte
          </h1>
          <p className="text-muted-foreground">
            Rejoignez-nous dès aujourd'hui
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Nom et prénom */}
            <div className="grid grid-cols-2 gap-4">
              <RequiredInput
                label="Prénom"
                type="text"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
              <RequiredInput
                label="Nom"
                type="text"
                placeholder="Votre nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                icon={<User className="h-4 w-4" />}
              />
            </div>

            {/* Email */}
            <RequiredInput
              label="Adresse email"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
            
            {/* Mot de passe avec indicateur de force */}
            <PasswordStrengthInput
              label="Mot de passe"
              placeholder="Créez un mot de passe fort"
              value={password}
              onChange={setPassword}
              showStrength={true}
              onValidationChange={setIsPasswordValid}
            />

            {/* Confirmation du mot de passe */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirmer le mot de passe <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`flex h-9 w-full rounded border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    confirmPassword && password !== confirmPassword 
                      ? "border-error" 
                      : confirmPassword && password === confirmPassword 
                      ? "border-success" 
                      : ""
                  }`}
                  required
                />
                {confirmPassword && (
                  <div className="mt-1 text-xs">
                    {password === confirmPassword ? (
                      <span className="text-success flex items-center gap-1">
                        <CheckIcon size={16} />
                        Les mots de passe correspondent
                      </span>
                    ) : (
                      <span className="text-error flex items-center gap-1">
                        <XIcon size={16} />
                        Les mots de passe ne correspondent pas
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                Création du compte...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="hover:text-secondary font-medium underline underline-offset-4"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
