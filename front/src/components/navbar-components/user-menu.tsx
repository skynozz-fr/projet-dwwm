import {
  LogOutIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../Button"

export default function UserMenu() {
  const navigate = useNavigate()
  
  // TODO: Remplacez par votre logique d'authentification réelle
  const isLoggedIn = false // ou useAuth(), useUser(), etc.
  const user = {
    name: "Keith Kennedy",
    email: "k.kennedy@originui.com",
    avatar: "./avatar.jpg"
  }

  const handleLogout = () => {
    // Ici vous pouvez ajouter votre logique de déconnexion
    // Par exemple : localStorage.removeItem('token')
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  // Si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
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

  // Si l'utilisateur est connecté
  return (
    <div className="relative">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.avatar} alt="Profile image" />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-background backdrop-blur-sm" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-error hover:bg-error hover:text-error-foreground focus:bg-error focus:text-error-foreground transition-colors"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
