import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { FileText, Calendar, Users, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleNavigate = (section: string) => {
    navigate(`/admin/${section}`)
    setSidebarOpen(false) // Fermer la sidebar sur mobile après navigation
  }

  const sidebarTabs = [
    {
      title: "Actualités",
      icon: FileText,
      action: "news",
      color: "text-secondary",
    },
    {
      title: "Matchs",
      icon: Calendar,
      action: "matches",
      color: "text-tertiary",
    },
    {
      title: "Utilisateurs",
      icon: Users,
      action: "users",
      color: "text-accent",
    }
  ]

  const isActive = (action: string) => {
    return location.pathname.startsWith(`/admin/${action}`)
  }

  return (
    <div className="flex">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background backdrop-blur-xl border-r border-border flex flex-col shadow-xl lg:shadow-none lg:h-[100dvh]
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-all duration-300 ease-out
      `}>
        {/* Header de la sidebar */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              <Link 
                to="/admin"
                onClick={() => setSidebarOpen(false)}
              >
                Administration
              </Link>
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarTabs.map((tab, index) => {
              const Icon = tab.icon
              const active = isActive(tab.action)
              return (
                <button
                  key={index}
                  onClick={() => handleNavigate(tab.action)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group relative cursor-pointer
                    ${active 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary' 
                      : 'hover:bg-ghost text-foreground hover:shadow-md'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110' : 'group-hover:scale-105'
                  } ${active ? '' : tab.color}`} />
                  <span className="font-medium">
                    {tab.title}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="bg-muted/20 border-b border-border px-4 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Bouton menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-xl hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {location.pathname === "/admin" 
                  ? "Tableau de bord"
                  : location.pathname.includes("actualites") 
                    ? "Gestion des actualités"
                    : location.pathname.includes("matchs")
                      ? "Gestion des matchs"
                      : location.pathname.includes("users")
                        ? "Gestion des utilisateurs"
                        : "Administration"
                }
              </h1>
              <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                {location.pathname === "/admin" 
                  ? "Vue d'ensemble de votre administration"
                  : location.pathname.includes("actualites") 
                    ? "Créer, modifier et gérer les actualités"
                    : location.pathname.includes("matchs")
                      ? "Planifier et gérer les matchs"
                      : location.pathname.includes("users")
                        ? "Administrer les comptes utilisateurs"
                        : "Interface d'administration"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
