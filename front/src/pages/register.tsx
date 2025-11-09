import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { ArrowLeft, CheckIcon, Mail, User, UserPlus, XIcon } from "lucide-react"

import { Button } from "@/components/Button"
import { RequiredInput } from "@/components/ui/required-input"
import { PasswordStrengthInput } from "@/components/ui/password-strength-input"

import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

import type { RegisterPayload } from "@/types/auth"

export const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    isPasswordValid &&
    password === confirmPassword

  const { mutate, isPending } = useMutation<void, AxiosError<{ error?: string }>, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      toast.success("Inscription réussie", "Bienvenue !")
      navigate("/")
    },
    onError: (error) => {
      const status = error.response?.status
      const apiMessage = error.response?.data?.error
      const message = apiMessage || (status === 409 ? "Email déjà utilisé" : "Une erreur est survenue")
      toast.error("Erreur d'inscription", message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isPending) return

    mutate({ firstname: firstName, lastname: lastName, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
          <p className="text-muted-foreground">Rejoignez-nous dès aujourd'hui</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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

            <RequiredInput
              label="Adresse email"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />

            <PasswordStrengthInput
              label="Mot de passe"
              placeholder="Créez un mot de passe fort"
              value={password}
              onChange={setPassword}
              showStrength={true}
              onValidationChange={setIsPasswordValid}
            />

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
            disabled={isPending || !isFormValid}
          >
            {isPending ? (
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
    </div>
  )
}