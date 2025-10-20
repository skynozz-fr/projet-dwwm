import React, { useState } from "react"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { Match } from "@/types/match"
import { Alert } from "@/components/ui/alert"
import { useToast } from "@/hooks/useToast"
import { filterItems } from "@/lib/utils"

// Données de test
const mockMatchs: Match[] = [
  {
    id: 1,
    homeTeam: "FC Local",
    awayTeam: "AS Visiteur",
    date: "2025-09-15",
    time: "15:00",
    venue: "Stade Municipal",
    location: "Ville, France",
    competition: "Championnat",
    status: "À venir",
    homeScore: null,
    awayScore: null,
    description: "Match important du championnat",
    homeFormation: "4-4-2",
    awayFormation: "4-3-3",
    referee: "M. Arbitre",
    weather: "Ensoleillé"
  },
  {
    id: 2,
    homeTeam: "FC Local",
    awayTeam: "FC Concurrent",
    date: "2025-08-30",
    time: "20:00",
    venue: "Stade Municipal",
    location: "Ville, France",
    competition: "Coupe",
    status: "Terminé",
    homeScore: 2,
    awayScore: 1,
    description: "Victoire en coupe",
    homeFormation: "4-3-3",
    awayFormation: "3-5-2",
    referee: "M. Referee",
    weather: "Pluvieux"
  },
  {
    id: 3,
    homeTeam: "Équipe Adverse",
    awayTeam: "FC Local",
    date: "2025-09-08",
    time: "17:00",
    venue: "Stade Extérieur",
    location: "Autre Ville, France",
    competition: "Championnat",
    status: "Annulé",
    homeScore: null,
    awayScore: null,
    description: "Déplacement difficile",
    homeFormation: "4-4-2",
    awayFormation: "4-4-2",
    referee: "Mme. Arbitre",
    weather: "Variable"
  }
]

export const MatchsAdmin = () => {
  const [matchs, setMatchs] = useState<Match[]>(mockMatchs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const navigate = useNavigate()
  const { toast } = useToast()

  // Alerts state
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  const statuses = ["all", "À venir", "Terminé", "Annulé"]


  const filteredMatchs = filterItems(
    matchs,
    searchTerm,
    ["homeTeam", "awayTeam", "competition"],
    { field: "status", value: selectedStatus }
  )

  // Pagination (10 items per page)
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredMatchs, itemsPerPage: 10 })

  // Reset pagination when filters/search change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { resetPagination() }, [searchTerm, selectedStatus])

  const requestDelete = (id: number) => {
    setDeleteTargetId(id)
    setDeleteAlertOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setMatchs(prev => prev.filter(m => m.id !== deleteTargetId))
      toast.success("Match supprimé !", "Le match a bien été supprimé.")
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "À venir": return "bg-blue-100 text-blue-800"
      case "Terminé": return "bg-green-100 text-green-800"
      case "Annulé": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      {/* Header + bouton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-foreground">Matchs</h2>
        <Button className="w-full sm:w-auto" onClick={() => setAddAlertOpen(true)}>
          Nouveau match
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end bg-muted/40 rounded-lg px-4 py-4 border border-border mb-4">
        <Input
          label="Rechercher"
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-xs"
        />
        <Select
          label="Statut"
          options={statuses.map(status => ({ 
            value: status, 
            label: status === "all" ? "Tous les statuts" : status 
          }))}
          value={selectedStatus}
          onChange={setSelectedStatus}
          className="max-w-xs"
        />
      </div>

      {/* Liste des matchs */}
      <div className="grid gap-6">
        {paginatedData.map((match) => (
          <Card key={match.id} className="p-5 md:p-7 border border-border bg-background/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground truncate max-w-xs md:max-w-md">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(match.status)}`}>
                    {match.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Heure</p>
                    <p className="font-medium">
                      {new Date(match.date).toLocaleDateString('fr-FR')} à {match.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-medium">{match.venue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compétition</p>
                    <p className="font-medium">{match.competition}</p>
                  </div>
                  {match.status === "Terminé" && (
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-medium text-lg">
                        {match.homeScore} - {match.awayScore}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{match.description}</p>
              </div>
              <div className="flex gap-2 md:ml-4 shrink-0">
                <Button variant="secondary" size="sm">
                  <Link to={`/admin/match/edit/${match.id}`}>
                    Modifier
                  </Link>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => requestDelete(match.id)}
                >
                  Supprimer
                </Button>
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
            itemName="matchs"
          />
        </div>
      )}

      {filteredMatchs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-lg">
          Aucun match trouvé
        </div>
      )}

      {/* Delete confirmation */}
      <Alert
        title="Supprimer ce match ?"
        description="Cette action est irréversible. La suppression ne peut pas être annulée."
        confirmText="Supprimer"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={confirmDelete}
      />

      {/* Add confirmation */}
      <Alert
        title="Créer un nouveau match ?"
        description="Vous allez être redirigé vers le formulaire de création."
        confirmText="Continuer"
        cancelText="Annuler"
        open={addAlertOpen}
        onOpenChange={setAddAlertOpen}
        onConfirm={() => navigate("/admin/match/create")}
      />
    </div>
  )
}