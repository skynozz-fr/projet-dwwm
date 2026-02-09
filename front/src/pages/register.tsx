import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { ArrowLeft, CheckIcon, Mail, User, UserPlus, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PasswordStrengthInput } from "@/components/ui/password-strength-input"
import { RequiredInput } from "@/components/ui/required-input"

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

  const isFormValid = firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && isPasswordValid && password === confirmPassword

  const { mutate, isPending } = useMutation<void, AxiosError<{ error?: string }>, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      toast.success("Inscription reussie", "Bienvenue !")
      navigate("/")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Une erreur est survenue"
      toast.error("Erreur d'inscription", message)
    },
  })

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl gap-6 md:grid-cols-2">
        <Card variant="glass" className="relative hidden overflow-hidden p-10 md:flex md:flex-col md:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-glow-gold" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-glow-blue" />
          <div className="relative z-10">
            <p className="text-caption text-primary">FC Popcorn</p>
            <h1 className="mt-4 text-h1">Entrez dans l'aventure.</h1>
            <p className="mt-4 max-w-md text-muted-foreground">Creez votre compte pour acceder a l'experience complete du club.</p>
          </div>
          <p className="relative z-10 text-sm text-muted-foreground">"La force d'une equipe commence par ses membres."</p>
        </Card>

        <Card variant="elevated" className="mx-auto w-full max-w-xl p-6 md:p-10">
          <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />Retour a la connexion
          </Link>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20 text-secondary"><UserPlus className="h-7 w-7" /></div>
            <h2 className="text-h2">Creer un compte</h2>
            <p className="mt-1 text-sm text-muted-foreground">Rejoignez le FC Popcorn</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!isFormValid || isPending) return
              mutate({ firstname: firstName, lastname: lastName, email, password })
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RequiredInput label="Prenom" placeholder="Votre prenom" value={firstName} onChange={(e) => setFirstName(e.target.value)} icon={<User className="h-4 w-4" />} />
              <RequiredInput label="Nom" placeholder="Votre nom" value={lastName} onChange={(e) => setLastName(e.target.value)} icon={<User className="h-4 w-4" />} />
            </div>

            <RequiredInput label="Adresse email" type="email" placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} />

            <PasswordStrengthInput label="Mot de passe" placeholder="Creez un mot de passe fort" value={password} onChange={setPassword} showStrength={true} onValidationChange={setIsPasswordValid} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirmer le mot de passe <span className="text-error">*</span></label>
              <input
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-10 w-full rounded-md border bg-surface px-3 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 ${
                  confirmPassword && password !== confirmPassword
                    ? "border-error"
                    : confirmPassword && password === confirmPassword
                    ? "border-success"
                    : "border-input"
                }`}
                required
              />
              {confirmPassword && (
                <p className={`inline-flex items-center gap-1 text-xs ${password === confirmPassword ? "text-success" : "text-error"}`}>
                  {password === confirmPassword ? <CheckIcon size={14} /> : <XIcon size={14} />}
                  {password === confirmPassword ? "Les mots de passe correspondent" : "Les mots de passe ne correspondent pas"}
                </p>
              )}
            </div>

            <Button type="submit" variant="secondary" className="w-full" disabled={isPending || !isFormValid}>
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary-foreground/40 border-t-secondary-foreground" />
                  Creation du compte...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Creer mon compte
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Deja un compte ? <Link to="/login" className="font-semibold text-secondary hover:underline">Se connecter</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
