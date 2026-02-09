import { LogOutIcon, Trash2, UserIcon, UserPlusIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { deleteUser } from "@/services/user.service"
import { useMutation } from "@tanstack/react-query"

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationKey: ["users", "delete-account"],
    mutationFn: () => deleteUser(user!.id),
    onSuccess: () => {
      toast.success("Compte supprimé !", "Votre compte a été supprimé avec succès.")
      setTimeout(() => {
        logout()
        navigate("/")
      }, 2000)
    },
    onError: () => {
      toast.error("Erreur", "Impossible de supprimer votre compte.")
    },
  })

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/login")}> 
          <UserIcon size={16} />
          Connexion
        </Button>
        <Button size="sm" onClick={() => navigate("/register")}> 
          <UserPlusIcon size={16} />
          S'inscrire
        </Button>
      </div>
    )
  }

  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase()
  const fullName = `${user.firstname} ${user.lastname}`

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto rounded-full p-0">
            <Avatar>
              <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 border-border bg-surface" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">{fullName}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteAlertOpen(true)}
            className="cursor-pointer text-error focus:bg-error/10 focus:text-error"
            disabled={isDeleting}
          >
            <Trash2 size={16} className="opacity-70" aria-hidden="true" />
            <span>Supprimer mon compte</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              logout()
              navigate("/login")
            }}
            className="cursor-pointer text-error focus:bg-error/10 focus:text-error"
          >
            <LogOutIcon size={16} className="opacity-70" aria-hidden="true" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Alert
        title="Supprimer votre compte ?"
        description="Cette action est irréversible. Toutes vos données seront définitivement supprimées."
        confirmText="Supprimer mon compte"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={() => deleteAccount()}
      />
    </div>
  )
}
