import { useState, useMemo, useEffect, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, MapPin, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/Pagination"
import { Loader } from "@/components/Loader"
import { usePagination } from "@/hooks/usePagination"
import { filterItems, formatDate } from "@/lib/utils"
import { competitionFilterOptions, getCompetitionColor, translateCompetition, translateMatchStatus } from "@/lib/match-helpers"
import { getAllMatches } from "@/services/match.service"
import { ErrorPage } from "./errors/ErrorPage"
import type { Match } from "@/types/match"

export const Matches = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer la compétition depuis l'URL
  const competitionFilter = searchParams.get("competition") || "all"

  // Fonction pour changer la compétition et mettre à jour l'URL
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
        competitionFilter !== "all" ? (competitionFilter as Match["competition"]) : undefined
      const data = await getAllMatches(competition)
      setAllMatches(data)
    } catch (err) {
      console.error("Erreur lors du chargement des matchs:", err)
      setError("Impossible de charger les matchs")
    } finally {
      setLoading(false)
    }
  }, [competitionFilter])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  // Filtrage des matchs
  const filteredMatches = useMemo(() => {
    // On ne filtre plus par "competition" côté client, seulement recherche texte
    return filterItems(
      allMatches,
      searchTerm,
      ['home_team', 'away_team', 'venue', 'competition', 'location']
    )
  }, [searchTerm, allMatches])

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedMatches,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredMatches, itemsPerPage: 6 })

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, competitionFilter])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])  

  // État de chargement
  if (loading) {
    return <Loader message="Chargement des matchs..." />
  }

  // État d'erreur
  if (error) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Une erreur est survenue lors du chargement des matchs. Veuillez réessayer."
        onRetry={fetchMatches}
        onGoBack={() => navigate('/home')}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Tous les Matchs
          </h1>
          <p className="text-xl text-background/90">
            Découvrez tous les matchs du FC Popcorn
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            {/* Barre de recherche */}
            <Input
              label=""
              placeholder="Rechercher un match, une équipe, un lieu..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />

            {/* Filtre par compétition */}
            <Select
              label=""
              options={competitionFilterOptions}
              value={competitionFilter}
              onChange={handleCompetitionChange}
              className="md:max-w-xs"
            />
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''} trouvé{filteredMatches.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des matchs */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {paginatedMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Trophy className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Aucun match trouvé
              </h3>
              <p className="text-muted-foreground text-center">
                Essayez de modifier vos critères de recherche ou de filtrage
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedMatches.map((match) => (
                  <Card
                    key={match.id}
                    className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                    onClick={() => navigate(`/match/${match.id}`)}
                  >
                    {/* En-tête */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompetitionColor(match.competition)}`}>
                        {translateCompetition(match.competition)}
                      </span>
                      <span className="text-sm text-muted-foreground">{translateMatchStatus(match.status)}</span>
                    </div>

                    {/* Équipes */}
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-foreground mb-2">
                        {match.home_team}
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {match.home_score !== null && match.away_score !== null
                          ? `${match.home_score} - ${match.away_score}`
                          : "vs"}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {match.away_team}
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(match.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {match.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {match.venue} - {match.location}
                      </div>
                    </div>

                    {/* Bouton */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/match/${match.id}`)
                        }}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={6}
                totalItems={totalItems}
                onPageChange={goToPage}
                itemName="matchs"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
