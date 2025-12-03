import React, { useMemo, useState, useDeferredValue } from "react"

import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Calendar, Globe, MapPin, Trophy } from "lucide-react"

import { Button } from "@/components/Button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/Input"
import { Pagination } from "@/components/Pagination"
import { Select } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"

import { useToast } from "@/hooks/useToast"
import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"

import { searchItems, formatDateTime } from "@/lib/utils"
import { competitionFilterOptions, getStatusColor, translateCompetition, translateMatchStatus } from "@/lib/match-helpers"

import { deleteMatch, getAllMatches } from "@/services/match.service"

import type { Match as MatchType } from "@/types/match"

export const MatchsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { filterValue: selectedCompetition, setFilter: handleCompetitionChange } = 
    useUrlFilter({ paramName: "competition" })

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [addAlertOpen, setAddAlertOpen] = useState(false)

  const competition =
    selectedCompetition !== "all" ? (selectedCompetition as MatchType["competition"]) : undefined

  const { 
    data: matchs = [], 
    isPending, 
    isError, 
    refetch 
  } = useQuery<MatchType[]>({
    queryKey: ["matches", competition ?? "all"],
    queryFn: () => getAllMatches(competition),
  })

  const filteredMatchs = useMemo(() => {
    return searchItems(
      matchs, 
      deferredSearch, 
      ["home_team", "away_team", "venue", "location"]
    )
  }, [matchs, deferredSearch])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination<MatchType>({ data: filteredMatchs, itemsPerPage: 10 })

  React.useEffect(() => { resetPagination() }, [deferredSearch, selectedCompetition]) // eslint-disable-line

  const requestDelete = (id: string) => {
    setDeleteTargetId(id)
    setDeleteAlertOpen(true)
  }

  // Delete mutation
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationKey: ["matches", "delete"],
    mutationFn: (id: string) => deleteMatch(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["matches"] })
      toast.success("Match supprimé !", "Le match a bien été supprimé.")
    },
    onError: () => {
      toast.error("Erreur", "Impossible de supprimer le match.")
    },
  })

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteMutate(deleteTargetId)
    }
    setDeleteTargetId(null)
    setDeleteAlertOpen(false)
  }

  if (isPending) {
    return <Loader message="Chargement des matchs..." />
  }

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger les matchs"
        onRetry={() => refetch()}
        onGoBack={() => navigate('/admin')}
      />
    )
  }

  return (
    <div className="space-y-8 px-2 md:px-6 py-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-foreground">Matchs</h2>
        <Button className="w-full sm:w-auto" onClick={() => setAddAlertOpen(true)}>
          Nouveau match
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-end bg-muted/40 rounded-lg px-4 py-4 border border-border mb-4">
        <Input
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        <Select
          options={competitionFilterOptions}
          value={selectedCompetition}
          onChange={handleCompetitionChange}
          className="md:max-w-xs"
        />
      </div>

      <div className="grid gap-6">
        {paginatedData.map((match) => (
          <Card 
            key={match.id} 
            className="p-5 md:p-7 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
            onClick={() => navigate(`/admin/match/edit/${match.id}`)}
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">
                    {match.home_team} <span className="text-muted-foreground font-normal">vs</span> {match.away_team}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${getStatusColor(translateMatchStatus(match.status))}`}>
                    {translateMatchStatus(match.status)}
                  </span>
                </div>

                {match.status === "COMPLETED" && match.home_score !== null && match.away_score !== null && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
                    <span className="text-sm font-medium text-muted-foreground">Score:</span>
                    <span className="text-xl font-bold text-foreground">
                      {match.home_score} - {match.away_score}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{formatDateTime(match.datetime)}</span>
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

                {match.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 pt-1 border-t border-border/50">
                    {match.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2 md:flex-col md:w-auto">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/admin/match/edit/${match.id}`)
                  }}
                  disabled={isDeleting}
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
                  disabled={isDeleting}
                >
                  Supprimer
                </Button>
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
            itemName="matchs"
          />
        </div>
      )}

      {filteredMatchs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-lg">
          Aucun match trouvé
        </div>
      )}

      <Alert
        title="Supprimer ce match ?"
        description="Cette action est irréversible. La suppression ne peut pas être annulée."
        confirmText="Supprimer"
        cancelText="Annuler"
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        onConfirm={confirmDelete}
      />

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