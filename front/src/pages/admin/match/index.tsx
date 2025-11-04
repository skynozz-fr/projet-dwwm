import React, { useState, useMemo, useEffect, useCallback } from "react"
import { Calendar, MapPin, Globe, Trophy } from "lucide-react"
import { usePagination } from "@/hooks/usePagination"
import { Pagination } from "@/components/Pagination"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { Match } from "@/types/match"
import { Alert } from "@/components/ui/alert"
import { useToast } from "@/hooks/useToast"
import { filterItems, formatDate } from "@/lib/utils"
import { getAllMatches, deleteMatch } from "@/services/match.service"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"
import { competitionFilterOptions, translateMatchStatus, translateCompetition, getStatusColor } from "@/lib/match-helpers"

export const MatchsAdmin = () => {
  const [matchs, setMatchs] = useState<Match[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  // URL filter
  const selectedCompetition = searchParams.get("competition") || "all"

  // Alerts state
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  // Changer la compétition via l'URL
  const handleCompetitionChange = useCallback((competition: string) => {
    const next = new URLSearchParams(searchParams)
    if (competition === "all") {
      next.delete("competition")
    } else {
      next.set("competition", competition)
    }
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  // Fetch
  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const competition =
        selectedCompetition !== "all" ? (selectedCompetition as Match["competition"]) : undefined
      const data = await getAllMatches(competition)
      setMatchs(data)
    } catch (err) {
      console.error("Erreur lors du chargement des matchs:", err)
      setError("Impossible de charger les matchs")
    } finally {
      setLoading(false)
    }
  }, [selectedCompetition])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  // Filtrage optimisé avec useMemo
  const filteredMatchs = useMemo(() => {
    return filterItems(
      matchs, 
      searchTerm, 
      ["home_team", "away_team", "venue", "location"]
    )
  }, [matchs, searchTerm])

  // Pagination (10 items/page)
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<Match>({ data: filteredMatchs, itemsPerPage: 10 })

  // Reset pagination quand recherche/filtre change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { resetPagination() }, [searchTerm, selectedCompetition])

  const requestDelete = (id: number) => {
    setDeleteTargetId(id)
    setDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        await deleteMatch(deleteTargetId)
        setMatchs(prev => prev.filter(m => m.id !== deleteTargetId))
        toast.success("Match supprimé !", "Le match a bien été supprimé.")
      } catch (err) {
        console.error("Erreur lors de la suppression:", err)
        toast.error("Erreur", "Impossible de supprimer le match.")
      }
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  // Loading / Error
  if (loading) {
    return <Loader message="Chargement des matchs..." />
  }

  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message={error}
        onRetry={fetchMatches}
        onGoBack={() => navigate('/admin')}
      />
    )
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
          label=""
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        <Select
          label=""
          options={competitionFilterOptions}
          value={selectedCompetition}
          onChange={handleCompetitionChange}
          className="md:max-w-xs"
        />
      </div>

      {/* Liste des matchs */}
      <div className="grid gap-6">
        {paginatedData.map((match) => (
          <Card 
            key={match.id} 
            className="p-5 md:p-7 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
            onClick={() => navigate(`/admin/match/edit/${match.id}`)}
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* En-tête avec titre et badge */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">
                    {match.home_team} <span className="text-muted-foreground font-normal">vs</span> {match.away_team}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${getStatusColor(translateMatchStatus(match.status))}`}>
                    {translateMatchStatus(match.status)}
                  </span>
                </div>

                {/* Score si match terminé */}
                {match.status === "COMPLETED" && match.home_score !== null && match.away_score !== null && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
                    <span className="text-sm font-medium text-muted-foreground">Score:</span>
                    <span className="text-xl font-bold text-foreground">
                      {match.home_score} - {match.away_score}
                    </span>
                  </div>
                )}

                {/* Informations du match */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{formatDate(match.date)} à {match.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{translateCompetition(match.competition)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{match.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{match.location}</span>
                  </div>
                </div>

                {/* Description */}
                {match.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 pt-1 border-t border-border/50">
                    {match.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:flex-col md:w-auto">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/admin/match/edit/${match.id}`)
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    requestDelete(match.id)
                  }}
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