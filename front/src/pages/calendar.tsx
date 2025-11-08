import { useState, type JSX } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Home,
  Plane,
  Info,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"

import { getAllMatches } from "@/services/match.service"

import {
  monthNames,
  dayNames,
  getFirstDayOfMonth,
  getDaysInMonth,
  getDaysInPrevMonth,
  getMatchesForDate,
  getCompetitionBgColor,
  getCompetitionDotColor,
} from "@/lib/calendar-helpers"
import { translateCompetition } from "@/lib/match-helpers"

import type { Match as MatchType } from "@/types/match"

export const Calendar = () => {
  const navigate = useNavigate()

  const [currentDate, setCurrentDate] = useState(new Date())

  const {
    data: matches = [],
    isPending,
    isError,
    refetch,
  } = useQuery<MatchType[]>({
    queryKey: ["matches", "all"],
    queryFn: () => getAllMatches(),
  })

  // Navigation dans le mois
  const navigateMonth = (direction: "prev" | "next") => {
    const next = new Date(currentDate)
    next.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(next)
  }

  const goToToday = () => setCurrentDate(new Date())

  // Construit la grille du calendrier avec:
  // - les derniers jours du mois précédent pour compléter la première ligne
  // - les jours du mois en cours (mobile: points / desktop: “cartes”)
  // - les premiers jours du mois suivant pour compléter la dernière ligne
  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate)
    const daysInMonth = getDaysInMonth(currentDate)
    const daysInPrevMonth = getDaysInPrevMonth(currentDate)
    const today = new Date()
    const cells: JSX.Element[] = []

    // Jours du mois précédent (padding début)
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      cells.push(
        <div
          key={`prev-${day}`}
          className="min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 text-muted-foreground bg-muted/20 border border-border"
        >
          <div className="text-xs md:text-sm">{day}</div>
        </div>
      )
    }

    // Jours du mois courant
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayMatches = getMatchesForDate(date, matches)
      const isToday = date.toDateString() === today.toDateString()

      cells.push(
        <div
          key={day}
          className={`min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 border border-border hover:bg-muted/30 transition-colors ${
            isToday ? "bg-primary/10 border-primary" : "bg-background"
          }`}
        >
          <div
            className={`text-xs md:text-sm font-medium mb-1 ${
              isToday ? "text-primary font-bold" : "text-foreground"
            }`}
          >
            {day}
          </div>

          {/* Mobile: points colorés */}
          <div className="flex flex-wrap gap-0.5 md:hidden">
            {dayMatches.map((match) => {
              const opponent = match.is_home ? match.away_team : match.home_team
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => navigate(`/match/${match.id}`)}
                  className={`w-2 h-2 rounded-full ${getCompetitionDotColor(
                    match.competition
                  )} hover:scale-150 transition-transform`}
                  title={`${match.is_home ? "Domicile" : "Extérieur"} vs ${opponent} - ${
                    match.time
                  } - ${translateCompetition(match.competition)}`}
                />
              )
            })}
          </div>

          {/* Desktop: “cartes” compactes */}
          <div className="hidden md:flex flex-col gap-1">
            {dayMatches.map((match) => {
              const opponent = match.is_home ? match.away_team : match.home_team
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => navigate(`/match/${match.id}`)}
                  className={`w-full flex flex-col items-center px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ${getCompetitionBgColor(
                    match.competition
                  )} shadow-sm hover:scale-[1.03] cursor-pointer`}
                  style={{ minHeight: 38 }}
                  title={`${match.is_home ? "Domicile" : "Extérieur"} vs ${opponent} - ${
                    match.time
                  }`}
                >
                  <span className="text-xs font-bold text-foreground mb-1 truncate flex items-center gap-2 w-full justify-center">
                    {opponent}
                    {match.is_home ? (
                      <Home className="w-3 h-3 text-foreground" />
                    ) : (
                      <Plane className="w-3 h-3 text-foreground" />
                    )}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getCompetitionBgColor(
                      match.competition
                    )}`}
                  >
                    {match.time}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    // Jours du mois suivant (padding fin)
    const totalCells = Math.ceil(cells.length / 7) * 7
    const remaining = totalCells - cells.length
    for (let day = 1; day <= remaining; day++) {
      cells.push(
        <div
          key={`next-${day}`}
          className="min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 text-muted-foreground bg-muted/20 border border-border"
        >
          <div className="text-xs md:text-sm">{day}</div>
        </div>
      )
    }

    return cells
  }

  if (isPending) return <Loader message="Chargement du calendrier..." />
  
  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger les matchs"
        onRetry={() => refetch()}
        onGoBack={() => navigate("/home")}
      />
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <CalendarIcon className="w-8 h-8 text-background mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-background">Calendrier des Matchs</h1>
          </div>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Découvrez tous les matchs du FC Popcorn directement dans le calendrier
          </p>
        </div>
      </div>

      <div className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => navigateMonth("prev")}
              className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Précédent</span>
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <CalendarIcon className="w-4 h-4" />
                Aujourd'hui
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigateMonth("next")}
              className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 bg-muted border-b border-border">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="p-2 md:p-4 text-center text-xs md:text-base font-semibold text-foreground border-r border-border last:border-r-0"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">{renderCalendarDays()}</div>
          </Card>
        </div>
      </div>

      <div className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-background border border-border rounded-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              Légende
            </h3>
            <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full md:rounded mr-2" />
                <span className="text-foreground">Championnat</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-secondary rounded-full md:rounded mr-2" />
                <span className="text-foreground">Coupe</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-tertiary rounded-full md:rounded mr-2" />
                <span className="text-foreground">Amical</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full md:rounded mr-2" />
                <span className="text-foreground">Tournoi</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-primary/10 border-2 border-primary rounded mr-2" />
                <span className="text-foreground">Aujourd'hui</span>
              </div>
            </div>
            <p className="mt-3 text-xs md:text-sm text-muted-foreground md:hidden flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Cliquez sur les points colorés pour voir les détails des matchs</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}