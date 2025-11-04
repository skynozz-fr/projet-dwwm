import { useState, useMemo, useEffect, useCallback } from "react"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { useToast } from "@/hooks/useToast"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { filterItems } from "@/lib/utils"
import { getAllUsers, patchUserRole } from "@/services/user.service"
import { translateRole, roleFilterOptions } from "@/lib/user-helpers"
import type { User, Role } from "@/types/user"
import { Shield } from "lucide-react"

export const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [roleAlertOpen, setRoleAlertOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: User
    newRole: Role
  } | null>(null)

  // Récupérer le rôle depuis l’URL
  const selectedRole = searchParams.get("role") || "all"

  // Fonction pour changer le rôle et mettre à jour l’URL
  const handleRoleChange = useCallback((role: string) => {
    const next = new URLSearchParams(searchParams)
    if (role === "all") next.delete("role")
    else next.set("role", role)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // Fetch
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const role = selectedRole !== "all" ? selectedRole as Role : undefined
      const data = await getAllUsers(role)
      setUsers(data)
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err)
      setError("Impossible de charger les utilisateurs")
    } finally {
      setLoading(false)
    }
  }, [selectedRole])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Filtrage optimisé
  const filteredUsers = useMemo(() => {
    return filterItems(
      users,
      searchTerm,
      ["firstname", "lastname", "email"]
    )
  }, [users, searchTerm])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<User>({ data: filteredUsers, itemsPerPage: 10 })

  useEffect(() => { resetPagination() }, [searchTerm, selectedRole]) // eslint-disable-line

  const requestRoleChange = (userId: number, newRole: Role) => {
    const user = users.find(u => u.id === userId)
    if (!user || user.role === newRole) return
    setPendingRoleChange({ user, newRole })
    setRoleAlertOpen(true)
  }

  const confirmRoleChange = async () => {
    if (pendingRoleChange) {
      const { user, newRole } = pendingRoleChange
      try {
        await patchUserRole(user.id, newRole)
        setUsers(prev => prev.map(u =>
          u.id === user.id ? { ...u, role: newRole } : u
        ))
        toast.success(
          "Rôle modifié !",
          `${user.firstname} ${user.lastname} est maintenant ${translateRole(newRole)}.`
        )
      } catch (err) {
        console.error("Erreur lors du changement de rôle:", err)
        toast.error("Erreur", "Impossible de modifier le rôle.")
      }
    }
    setPendingRoleChange(null)
    setRoleAlertOpen(false)
  }

  // UI States
  if (loading) return <Loader message="Chargement des utilisateurs..." />

  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement des utilisateurs. Veuillez réessayer."
        onRetry={fetchUsers}
        onGoBack={() => navigate('/admin')}
      />
    )
  }

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-foreground">Utilisateurs</h2>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end bg-muted/40 rounded-lg px-4 py-4 border border-border mb-4">
        <Input
          label=""
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        <Select
          label=""
          options={roleFilterOptions}
          value={selectedRole}
          onChange={handleRoleChange}
          className="md:max-w-xs"
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{users.length}</div>
          <div className="text-sm text-muted-foreground">Total utilisateurs</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === "ADMIN").length}
          </div>
          <div className="text-sm text-muted-foreground">Administrateurs</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {users.filter(u => u.role === "USER").length}
          </div>
          <div className="text-sm text-muted-foreground">Utilisateurs</div>
        </Card>
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {paginatedData.map((user) => (
          <Card key={user.id} className="p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  user.role === "ADMIN" ? "bg-primary" : "bg-secondary"
                }`}>
                  {user.firstname[0]}{user.lastname[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {user.firstname} {user.lastname}
                    {user.role === "ADMIN" && <Shield className="w-4 h-4 text-primary" />}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Action role */}
              <div className="flex gap-2 sm:ml-4">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); requestRoleChange(user.id, "ADMIN") }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    user.role === "ADMIN"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); requestRoleChange(user.id, "USER") }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    user.role === "USER"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                  }`}
                >
                  User
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

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

      {/* Pop-up Confirmation */}
      <Alert
        title="Changer le rôle de l'utilisateur ?"
        description={
          pendingRoleChange
            ? `Passer ${pendingRoleChange.user.firstname} ${pendingRoleChange.user.lastname} en ${translateRole(pendingRoleChange.newRole)} ?`
            : undefined
        }
        confirmText="Changer"
        cancelText="Annuler"
        open={roleAlertOpen}
        onOpenChange={setRoleAlertOpen}
        onConfirm={confirmRoleChange}
      />
    </div>
  )
}
