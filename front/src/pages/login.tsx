import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { LogIn, User, Mail } from "lucide-react"

import { Button } from "@/components/Button"
import { RequiredInput } from "@/components/ui/required-input"
import { SimplePasswordInput } from "@/components/ui/simple-password-input"

import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

import type { LoginPayload } from "@/context/AuthContext"

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const { mutate, isPending } = useMutation<void, AxiosError<{ error?: string }>, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      toast.success("Connexion réussie", "Bienvenue !")
      navigate("/")
    },
    onError: (error) => {
      const status = error.response?.status
      const apiMessage = error.response?.data?.error
      const message = apiMessage || (status === 401 ? "Email ou mot de passe incorrect" : "Impossible de se connecter")
      toast.error("Erreur de connexion", message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isPending) return
    
    mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
          <p className="text-muted-foreground">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <RequiredInput
              label="Adresse email"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              aria-label="Adresse email"
            />

            <SimplePasswordInput
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChange={setPassword}
              required
              aria-label="Mot de passe"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !isFormValid}>
            {isPending ? (
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

        <div className="text-center">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            <User className="w-4 h-4" />
            Continuer en tant qu'invité
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="hover:text-primary font-medium underline underline-offset-4">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}