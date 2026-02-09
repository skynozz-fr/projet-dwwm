import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Trophy } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/Pagination"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "./errors/ErrorPage"

import { usePagination } from "@/hooks/usePagination"
import { useUrlFilter } from "@/hooks/useUrlFilter"
import { searchItems, formatDate, formatTime } from "@/lib/utils"
import { competitionFilterOptions, getCompetitionColor, translateCompetition, translateMatchStatus } from "@/lib/match-helpers"
import { getAllMatches } from "@/services/match.service"

import type { Match as MatchType } from "@/types/match"

export const Matches = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearch = useDeferredValue(searchTerm)
  const { filterValue: competitionFilter, setFilter: setCompetitionFilter } = useUrlFilter({ paramName: "competition" })

  const competition = competitionFilter !== "all" ? (competitionFilter as MatchType["competition"]) : undefined

  const { data: allMatches = [], isPending, isError, refetch } = useQuery<MatchType[]>({
    queryKey: ["matches", competition ?? "all"],
    queryFn: () => getAllMatches(competition),
  })

  const filteredMatches = useMemo(() => searchItems(allMatches, deferredSearch, ["home_team", "away_team", "venue", "competition", "location"]), [deferredSearch, allMatches])

  const { currentPage, totalPages, paginatedData: paginatedMatches, totalItems, goToPage, resetPagination } = usePagination({ data: filteredMatches, itemsPerPage: 6 })

  useEffect(() => {
    resetPagination()
  }, [deferredSearch, competitionFilter, resetPagination])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  if (isPending) return <Loader message="Chargement des matchs..." />
  if (isError) {
    return <ErrorPage title="Erreur de chargement" message="Impossible de charger les matchs" onRetry={() => refetch()} onGoBack={() => navigate("/home")} />
  }

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10 text-center">
          <h1 className="text-h1 text-white">Tous les Matchs</h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-white/85">Suivez l'ensemble des rencontres du FC Popcorn.</p>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <Input placeholder="Rechercher une equipe, un lieu..." value={searchTerm} onChange={setSearchTerm} className="flex-1" />
            <Select options={competitionFilterOptions} value={competitionFilter} onChange={setCompetitionFilter} className="md:max-w-xs" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{filteredMatches.length} match{filteredMatches.length > 1 ? "s" : ""} trouve{filteredMatches.length > 1 ? "s" : ""}</p>
        </Card>
      </section>

      <section className="section-shell">
        {paginatedMatches.length === 0 ? (
          <Card variant="glass" className="py-16 text-center">
            <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h3 className="text-h3">Aucun match trouve</h3>
            <p className="mt-2 text-muted-foreground">Essayez de modifier vos filtres.</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {paginatedMatches.map((match) => (
                <Card key={match.id} variant="interactive" className="cursor-pointer p-5" onClick={() => navigate(`/match/${match.id}`)}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCompetitionColor(match.competition)}`}>
                      {translateCompetition(match.competition)}
                    </span>
                    <span className="text-xs text-muted-foreground">{translateMatchStatus(match.status)}</span>
                  </div>

                  <div className="mb-4 text-center">
                    <p className="text-base font-semibold">{match.home_team}</p>
                    <p className="my-2 text-2xl font-display text-primary">
                      {match.home_score !== null && match.away_score !== null ? `${match.home_score} - ${match.away_score}` : "VS"}
                    </p>
                    <p className="text-base font-semibold">{match.away_team}</p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{formatDate(match.datetime)}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{formatTime(match.datetime)}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{match.venue} - {match.location}</span>
                    </p>
                  </div>

                  <Button variant="secondary" className="mt-5 w-full" onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/match/${match.id}`)
                  }}>
                    Voir les details
                  </Button>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} itemsPerPage={6} totalItems={totalItems} onPageChange={goToPage} itemName="matchs" />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
