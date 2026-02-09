import { useState, type JSX } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Home, Info, Plane } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "@/pages/errors/ErrorPage"

import { getAllMatches } from "@/services/match.service"
import { dayNames, getCompetitionBgColor, getCompetitionDotColor, getDaysInMonth, getDaysInPrevMonth, getFirstDayOfMonth, getMatchesForDate, monthNames } from "@/lib/calendar-helpers"
import { formatTime } from "@/lib/utils"
import { translateCompetition } from "@/lib/match-helpers"
import type { Match as MatchType } from "@/types/match"

export const Calendar = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())

  const { data: matches = [], isPending, isError, refetch } = useQuery<MatchType[]>({
    queryKey: ["matches", "all"],
    queryFn: () => getAllMatches(),
  })

  const navigateMonth = (direction: "prev" | "next") => {
    const next = new Date(currentDate)
    next.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(next)
  }

  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate)
    const daysInMonth = getDaysInMonth(currentDate)
    const daysInPrevMonth = getDaysInPrevMonth(currentDate)
    const today = new Date()
    const cells: JSX.Element[] = []

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      cells.push(
        <div key={`prev-${day}`} className="min-h-[80px] border border-border bg-surface-2/40 p-1.5 text-xs text-muted-foreground md:min-h-[100px]">
          {day}
        </div>
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayMatches = getMatchesForDate(date, matches)
      const isToday = date.toDateString() === today.toDateString()

      cells.push(
        <div key={day} className={`min-h-[80px] border p-1.5 md:min-h-[100px] ${isToday ? "border-primary bg-primary/10" : "border-border bg-surface"}`}>
          <div className={`mb-1 text-xs font-semibold md:text-sm ${isToday ? "text-primary" : "text-foreground"}`}>{day}</div>

          <div className="flex flex-wrap gap-0.5 md:hidden">
            {dayMatches.map((match) => {
              const opponent = match.is_home ? match.away_team : match.home_team
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => navigate(`/match/${match.id}`)}
                  className={`h-2.5 w-2.5 rounded-full ${getCompetitionDotColor(match.competition)} transition-transform hover:scale-125`}
                  title={`${match.is_home ? "Domicile" : "Exterieur"} vs ${opponent} - ${formatTime(match.datetime)} - ${translateCompetition(match.competition)}`}
                />
              )
            })}
          </div>

          <div className="hidden flex-col gap-1 md:flex">
            {dayMatches.map((match) => {
              const opponent = match.is_home ? match.away_team : match.home_team
              return (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => navigate(`/match/${match.id}`)}
                  className={`w-full rounded-md px-1.5 py-1.5 text-xs shadow-sm transition hover:scale-[1.03] ${getCompetitionBgColor(match.competition)}`}
                  title={`${match.is_home ? "Domicile" : "Exterieur"} vs ${opponent} - ${formatTime(match.datetime)}`}
                >
                  <span className="mb-1 inline-flex items-center justify-center gap-1 font-semibold">
                    {opponent}
                    {match.is_home ? <Home className="h-3 w-3" /> : <Plane className="h-3 w-3" />}
                  </span>
                  <span className="block text-[11px]">{formatTime(match.datetime)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    const totalCells = Math.ceil(cells.length / 7) * 7
    const remaining = totalCells - cells.length
    for (let day = 1; day <= remaining; day++) {
      cells.push(
        <div key={`next-${day}`} className="min-h-[80px] border border-border bg-surface-2/40 p-1.5 text-xs text-muted-foreground md:min-h-[100px]">
          {day}
        </div>
      )
    }

    return cells
  }

  if (isPending) return <Loader message="Chargement du calendrier..." />
  if (isError) {
    return <ErrorPage title="Erreur de chargement" message="Impossible de charger les matchs" onRetry={() => refetch()} onGoBack={() => navigate("/home")} />
  }

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10 text-center">
          <h1 className="inline-flex items-center gap-2 text-h1 text-white"><CalendarIcon className="h-8 w-8" />Calendrier des Matchs</h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-white/85">Visualisez tous les matchs en un coup d'oeil.</p>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="p-4">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => navigateMonth("prev")}><ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Precedent</span></Button>
            <div className="text-center">
              <h2 className="text-h3">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>Aujourd'hui</Button>
            </div>
            <Button variant="outline" onClick={() => navigateMonth("next")}><span className="hidden sm:inline">Suivant</span><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </Card>
      </section>

      <section className="section-shell">
        <Card variant="elevated" className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-surface-2/60">
            {dayNames.map((day) => (
              <div key={day} className="border-r border-border p-2 text-center text-xs font-semibold last:border-r-0 md:p-3 md:text-sm">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </Card>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="p-5">
          <h3 className="mb-3 text-h3">Legende</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" />Championnat</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-secondary" />Coupe</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-tertiary" />Amical</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" />Tournoi</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-primary bg-primary/15" />Aujourd'hui</span>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground md:hidden"><Info className="h-4 w-4" />Touchez un point colore pour ouvrir le match.</p>
        </Card>
      </section>
    </div>
  )
}
