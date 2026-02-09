import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Calendar, FileText, Menu, Users, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarTabs = [
    { title: "Actualites", icon: FileText, action: "news" },
    { title: "Matchs", icon: Calendar, action: "matches" },
    { title: "Utilisateurs", icon: Users, action: "users" },
  ]

  const isActive = (action: string) => location.pathname.startsWith(`/admin/${action}`)

  const getHeading = () => {
    if (location.pathname === "/admin") return "Tableau de bord"
    if (location.pathname.includes("news")) return "Gestion des actualites"
    if (location.pathname.includes("matches") || location.pathname.includes("match")) return "Gestion des matchs"
    if (location.pathname.includes("users")) return "Gestion des utilisateurs"
    return "Administration"
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[260px_1fr]">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border bg-surface p-3 shadow-xl transition-transform lg:static lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2">
          <Link to="/admin" onClick={() => setSidebarOpen(false)} className="font-display text-2xl text-foreground">Admin</Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></Button>
        </div>

        <nav className="space-y-1">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon
            const active = isActive(tab.action)
            return (
              <button
                key={tab.action}
                onClick={() => {
                  navigate(`/admin/${tab.action}`)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface-2"}`}
              >
                <Icon className="h-4 w-4" />
                {tab.title}
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <header className="border-b border-border bg-surface/80 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-4 w-4" /></Button>
            <div>
              <h1 className="text-h3 text-foreground">{getHeading()}</h1>
              <p className="text-xs text-muted-foreground">Interface de gestion compacte et orientee actions</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
