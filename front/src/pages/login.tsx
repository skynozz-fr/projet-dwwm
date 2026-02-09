import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { LogIn, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RequiredInput } from "@/components/ui/required-input"
import { SimplePasswordInput } from "@/components/ui/simple-password-input"

import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

import type { LoginPayload } from "@/types/auth"

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
      toast.success("Connexion reussie", "Bienvenue !")
      navigate("/")
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Une erreur est survenue"
      toast.error("Erreur de connexion", message)
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
            <h1 className="mt-4 text-h1">Esprit club. Energie collective.</h1>
            <p className="mt-4 max-w-md text-muted-foreground">Suivez les matchs, consultez les actualites et rejoignez la communaute du club.</p>
          </div>
          <p className="relative z-10 text-sm text-muted-foreground">"Chaque entrainement est une promesse de progres."</p>
        </Card>

        <Card variant="elevated" className="mx-auto flex w-full max-w-xl flex-col justify-center p-6 md:p-10">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary"><LogIn className="h-7 w-7" /></div>
            <h2 className="text-h2">Connexion</h2>
            <p className="mt-1 text-sm text-muted-foreground">Connectez-vous a votre compte</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!isFormValid || isPending) return
              mutate({ email, password })
            }}
            className="space-y-4"
          >
            <RequiredInput label="Adresse email" type="email" placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} />
            <SimplePasswordInput label="Mot de passe" placeholder="Votre mot de passe" value={password} onChange={setPassword} required />

            <Button type="submit" className="mt-2 w-full" disabled={isPending || !isFormValid}>
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <User className="h-4 w-4" />
              Continuer en tant qu'invite
            </Link>
          </div>

          <div className="my-6 border-t border-border" />

          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ? <Link to="/register" className="font-semibold text-primary hover:underline">Creer un compte</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
