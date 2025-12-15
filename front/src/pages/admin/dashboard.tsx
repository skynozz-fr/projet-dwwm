import { useNavigate } from "react-router-dom"
import { FileText, Calendar, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

export const AdminDashboard = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: "Actualités",
      description: "Gérer les actualités",
      icon: FileText,
      link: "/admin/news",
    },
    {
      title: "Matchs",
      description: "Gérer les matchs",
      icon: Calendar,
      link: "/admin/matches",
    },
    {
      title: "Utilisateurs",
      description: "Gérer les utilisateurs",
      icon: Users,
      link: "/admin/users",
    }
  ]

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="p-5 md:p-7 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
              onClick={() => navigate(action.link)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg flex items-center justify-center
                    ${action.title === "Actualités" ? "bg-secondary text-secondary-foreground" : ""}
                    ${action.title === "Matchs" ? "bg-primary text-primary-foreground" : ""}
                    ${action.title === "Utilisateurs" ? "bg-accent text-accent-foreground" : ""}
                  `}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}