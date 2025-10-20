import React, { useState } from "react"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"

import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { useToast } from "@/hooks/useToast"
import { filterItems } from "@/lib/utils"
import type { User } from "@/types/user"

// Données de test
const mockUsers: User[] = [
  {
    id: 1,
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: "Administrateur"
  },
  {
    id: 2,
    nom: "Marie Martin",
    email: "marie.martin@email.com",
    role: "Utilisateur"
  },
  {
    id: 3,
    nom: "Pierre Dubois",
    email: "pierre.dubois@email.com",
    role: "Utilisateur"
  },
  {
    id: 4,
    nom: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    role: "Utilisateur"
  },
  {
    id: 5,
    nom: "Marc Leroy",
    email: "marc.leroy@email.com",
    role: "Administrateur"
  }
]

export const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [roleAlertOpen, setRoleAlertOpen] = useState(false)
  const { toast } = useToast()
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: number
    newRole: "Administrateur" | "Utilisateur"
  } | null>(null)

  const roles = ["all", "Administrateur", "Utilisateur"]


  const filteredUsers = filterItems(
    users,
    searchTerm,
    ["nom", "email"],
    { field: "role", value: selectedRole }
  )

  // Pagination (10 items per page)
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<User>({ data: filteredUsers, itemsPerPage: 10 })

  // Reset pagination when filters/search change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { resetPagination() }, [searchTerm, selectedRole])



  const requestRoleChange = (userId: number, newRole: "Administrateur" | "Utilisateur") => {
    const current = users.find(u => u.id === userId)
    if (!current || current.role === newRole) return
    setPendingRoleChange({ userId, newRole })
    setRoleAlertOpen(true)
  }

  const confirmRoleChange = () => {
    if (pendingRoleChange) {
      setUsers(prev => prev.map(user => 
        user.id === pendingRoleChange.userId ? { ...user, role: pendingRoleChange.newRole } : user
      ))
      const changedUser = users.find(u => u.id === pendingRoleChange.userId)
      toast.success(
        "Rôle modifié !",
        changedUser
          ? `${changedUser.nom} est maintenant ${pendingRoleChange.newRole}.`
          : "Le rôle a été modifié."
      )
    }
    setPendingRoleChange(null)
    setRoleAlertOpen(false)
  }



  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-foreground">Utilisateurs</h2>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end bg-muted/40 rounded-lg px-4 py-4 border border-border mb-4">
        <Input
          label="Rechercher"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-xs"
        />
        <Select
          label="Rôle"
          options={roles.map(role => ({ 
            value: role, 
            label: role === "all" ? "Tous les rôles" : role 
          }))}
          value={selectedRole}
          onChange={setSelectedRole}
          className="max-w-xs"
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{users.length}</div>
          <div className="text-sm text-muted-foreground">Total utilisateurs</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === "Administrateur").length}
          </div>
          <div className="text-sm text-muted-foreground">Administrateurs</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {users.filter(u => u.role === "Utilisateur").length}
          </div>
          <div className="text-sm text-muted-foreground">Utilisateurs</div>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid gap-6">
        {paginatedData.map((user) => (
          <Card key={user.id} className="p-5 md:p-7 border border-border bg-background/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground font-medium">
                      {user.nom.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{user.nom}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:ml-4 shrink-0">
                <div className="flex gap-2">
                  {/* Boutons radio stylisés pour le rôle */}
                  <button
                    type="button"
                    onClick={() => requestRoleChange(user.id, "Administrateur")}
                    className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40
                      ${user.role === "Administrateur"
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-background text-foreground border-border hover:bg-primary/10"}
                    `}
                  >
                    Administrateur
                  </button>
                  <button
                    type="button"
                    onClick={() => requestRoleChange(user.id, "Utilisateur")}
                    className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40
                      ${user.role === "Utilisateur"
                        ? "bg-secondary text-secondary-foreground border-secondary shadow"
                        : "bg-background text-foreground border-border hover:bg-secondary/10"}
                    `}
                  >
                    Utilisateur
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={10}
            totalItems={totalItems}
            onPageChange={goToPage}
            itemName="utilisateurs"
          />
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-lg">
          Aucun utilisateur trouvé
        </div>
      )}

      {/* Confirm role change */}
      <Alert
        title="Changer le rôle de l'utilisateur ?"
        description={pendingRoleChange ? `Passer ${users.find(u => u.id === pendingRoleChange.userId)?.nom} en ${pendingRoleChange.newRole} ?` : undefined}
        confirmText="Changer"
        cancelText="Annuler"
        open={roleAlertOpen}
        onOpenChange={setRoleAlertOpen}
        onConfirm={confirmRoleChange}
      />
    </div>
  )
}