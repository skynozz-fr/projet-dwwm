import { useNavigate } from "react-router-dom"
import { Calendar, FileText, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

export const AdminDashboard = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: "Actualites", description: "Creer et publier des nouvelles", icon: FileText, link: "/admin/news" },
    { title: "Matchs", description: "Planifier et modifier les rencontres", icon: Calendar, link: "/admin/matches" },
    { title: "Utilisateurs", description: "Gerer les roles et les comptes", icon: Users, link: "/admin/users" },
  ]

  return (
    <div className="space-y-5">
      <h2 className="text-h3">Actions rapides</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} variant="interactive" className="cursor-pointer p-5" onClick={() => navigate(action.link)}>
            <div className="mb-3 inline-flex rounded-md bg-primary/15 p-2 text-primary"><action.icon className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold">{action.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
