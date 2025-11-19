import {
  LogOutIcon,
  UserIcon,
  UserPlusIcon,
  Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert } from "@/components/ui/alert"
import { Button } from "../Button"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { deleteUser } from "@/services/user.service"
import { useMutation } from "@tanstack/react-query"

export default function UserMenu() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const requestDeleteAccount = () => {
    setDeleteAlertOpen(true)
  }

  // Delete account mutation
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

  const confirmDelete = () => {
    deleteAccount()
    setDeleteAlertOpen(false)
  }

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogin}
        >
          <UserIcon size={16} className="mr-2" />
          Connexion
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleRegister}
        >
          <UserPlusIcon size={16} className="mr-2" />
          S'inscrire
        </Button>
      </div>
    )
  }

  const initials = `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase()
  const fullName = `${user.firstname} ${user.lastname}`

  return (
    <div className="relative">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 text-default">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-background backdrop-blur-sm" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {fullName}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={requestDeleteAccount}
          className="cursor-pointer text-error hover:bg-error hover:text-error-foreground focus:bg-error focus:text-error-foreground transition-colors"
          disabled={isDeleting}
        >
          <Trash2 size={16} className="opacity-60" aria-hidden="true" />
          <span>Supprimer mon compte</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-error hover:bg-error hover:text-error-foreground focus:bg-error focus:text-error-foreground transition-colors"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
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
      onConfirm={confirmDelete}
    />
    </div>
  )
}
