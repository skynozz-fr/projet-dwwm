import { useState, useMemo, useEffect, useDeferredValue } from "react"

import { useNavigate } from "react-router-dom"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { Pagination } from "@/components/Pagination"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"

import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { searchItems } from "@/lib/utils"
import { translateRole, roleFilterOptions } from "@/lib/user-helpers"
import { getAllUsers, patchUserRole, deleteUser } from "@/services/user.service"

import { Shield, Trash2 } from "lucide-react"
import type { User as UserType, Role as RoleType, UserRolePayload } from "@/types/user"

export const UsersAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const [roleAlertOpen, setRoleAlertOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user: currentUser, logout } = useAuth()
  const queryClient = useQueryClient()

  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: UserType
    newRole: RoleType
  } | null>(null)

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const { filterValue: selectedRole, setFilter: handleRoleChange } = 
    useUrlFilter({ paramName: "role" })

  // Data fetching with React Query
  const roleFilter: RoleType | undefined = selectedRole !== "all" ? (selectedRole as RoleType) : undefined
  const {
    data: users = [],
    isPending,
    isError,
    refetch,
  } = useQuery<UserType[]>({
    queryKey: ["users", roleFilter ?? "all"],
    queryFn: () => getAllUsers(roleFilter),
  })

  // Filtrage optimisé
  const filteredUsers = useMemo(() => {
    return searchItems(
      users,
      deferredSearch,
      ["firstname", "lastname", "email"]
    )
  }, [users, deferredSearch])

  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<UserType>({ data: filteredUsers, itemsPerPage: 10 })

  useEffect(() => { resetPagination() }, [deferredSearch, selectedRole]) // eslint-disable-line

  const requestRoleChange = (userId: string, newRole: RoleType) => {
    const user = users.find(u => u.id === userId)
    if (!user || user.role === newRole) return
    setPendingRoleChange({ user, newRole })
    setRoleAlertOpen(true)
  }

  // Mutation to change role
  const { mutate: changeRole, isPending: isRoleChanging } = useMutation<UserType, AxiosError<{ error?: string }>, { id: string; payload: UserRolePayload }>({
    mutationKey: ["users", "change-role"],
    mutationFn: ({ id, payload }: { id: string; payload: UserRolePayload }) => patchUserRole(id, payload),
    onSuccess: (updatedUser) => {
      toast.success(
        "Rôle modifié !",
        `${updatedUser.firstname} ${updatedUser.lastname} est maintenant ${translateRole(updatedUser.role)}.`
      )
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", updatedUser.id] })
      
      // Si l'utilisateur modifié est l'utilisateur connecté et qu'il n'est plus admin
      if (currentUser && updatedUser.id === currentUser.id && updatedUser.role !== "ADMIN") {
        toast.warning(
          "Déconnexion",
          "Vos droits administrateur ont été révoqués. Vous allez être déconnecté."
        )
        setTimeout(() => {
          logout()
          navigate("/login")
        }, 2000)
      }
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible de modifier le rôle."
      toast.error("Erreur", message)
    },
  })

  const confirmRoleChange = () => {
    if (pendingRoleChange) {
      changeRole({ id: pendingRoleChange.user.id, payload: { role: pendingRoleChange.newRole } })
    }
    setPendingRoleChange(null)
    setRoleAlertOpen(false)
  }

  const requestDelete = (userId: string) => {
    setDeleteTargetId(userId)
    setDeleteAlertOpen(true)
  }

  // Delete mutation
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation<void, AxiosError<{ error?: string }>, string>({
    mutationKey: ["users", "delete"],
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("Utilisateur supprimé !", "L'utilisateur a bien été supprimé.")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Impossible de supprimer l'utilisateur."
      toast.error("Erreur", message)
    },
  })

  const confirmDelete = () => {
    if (deleteTargetId) {
      // Vérifier si l'utilisateur essaie de se supprimer lui-même
      if (currentUser && deleteTargetId === currentUser.id) {
        toast.warning(
          "Déconnexion",
          "Vous venez de supprimer votre propre compte. Vous allez être déconnecté."
        )
        deleteMutate(deleteTargetId)
        setTimeout(() => {
          logout()
          navigate("/login")
        }, 2000)
      } else {
        deleteMutate(deleteTargetId)
      }
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  if (isPending) return <Loader message="Chargement des utilisateurs..." />

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement des utilisateurs. Veuillez réessayer."
        onRetry={() => refetch()}
        onGoBack={() => navigate('/admin')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-foreground">Utilisateurs</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-end rounded-lg border border-border bg-surface-2/35 p-3 mb-4">
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

      <div className="grid gap-4">
        {paginatedData.map((user) => (
          <Card key={user.id} className="p-4 md:p-5">
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

              <div className="flex gap-2 sm:ml-4">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); requestRoleChange(user.id, "ADMIN") }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    user.role === "ADMIN"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  disabled={isRoleChanging || isDeleting}
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
                  disabled={isRoleChanging || isDeleting}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); requestDelete(user.id) }}
                  className="p-2 rounded-lg transition-all bg-error text-error-foreground hover:bg-error"
                  disabled={isRoleChanging || isDeleting}
                  title="Supprimer l'utilisateur"
                >
                  <Trash2 className="w-4 h-4" />
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

      <Alert
        title="Supprimer cet utilisateur ?"
        description="Cette action est irréversible. La suppression ne peut pas être annulée."
        confirmText="Supprimer"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
