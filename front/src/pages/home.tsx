import { useNavigate } from "react-router-dom"
import { AlertCircle, Calendar, Clock, Edit3, MapPin, Target, Trophy, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/Loader"

import { formatDate, formatTime, getLatestItems, getUpcomingItems } from "@/lib/utils"
import { getCompetitionColor, translateCompetition } from "@/lib/match-helpers"
import { getNewsColor, getNewsIcon, translateNewsCategory } from "@/lib/news-helpers"

import { getAllMatches } from "@/services/match.service"
import { getAllNews } from "@/services/news.service"

import type { Match as MatchType } from "@/types/match"
import type { News as NewsType } from "@/types/news"

export const Home = () => {
  const navigate = useNavigate()

  const {
    data: matches = [],
    isPending: isMatchesPending,
    isError: isMatchesError,
  } = useQuery<MatchType[], AxiosError<{ error?: string }>>({
    queryKey: ["matches", "all"],
    queryFn: () => getAllMatches(),
    select: (data) => getUpcomingItems(data),
  })

  const {
    data: news = [],
    isPending: isNewsPending,
    isError: isNewsError,
  } = useQuery<NewsType[], AxiosError<{ error?: string }>>({
    queryKey: ["news", "all"],
    queryFn: () => getAllNews(),
    select: (data) => getLatestItems(data),
  })

  if (isMatchesPending && isNewsPending) return <Loader message="Chargement..." />

  const hadError = isMatchesError || isNewsError

  return (
    <main>
      <section className="page-hero section-shell p-8 md:p-12">
        <div className="relative z-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-caption text-white">
            <Target className="h-4 w-4" />
            Club de football
          </div>
          <h1 className="text-h1 text-white">FC Popcorn</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/85 md:text-xl">
            Le club qui unit passion, convivialite et excellence depuis 1985.
          </p>

          {hadError && (
            <div className="mx-auto mt-7 flex max-w-2xl items-start gap-3 rounded-lg border border-white/25 bg-white/10 p-4 text-left backdrop-blur">
              <AlertCircle className="mt-0.5 h-5 w-5 text-white" />
              <div>
                <p className="text-sm font-semibold text-white">Certaines donnees n'ont pas pu etre chargees</p>
                <p className="text-xs text-white/85">Veuillez reessayer dans quelques instants.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {[
          ["200+", "Licencies", "text-secondary"],
          ["12", "Equipes", "text-accent"],
          ["40", "Ans d'histoire", "text-success"],
          ["15", "Trophees", "text-primary"],
        ].map(([value, label, tone]) => (
          <Card key={label} variant="glass" className="p-5 text-center">
            <p className={`text-3xl font-display ${tone}`}>{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </Card>
        ))}
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-h2 text-foreground">Prochains Matchs</h2>
          <Button variant="outline" onClick={() => navigate("/matches")}>Voir tout</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matches.length === 0 ? (
            <Card variant="glass" className="col-span-full p-10 text-center">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-primary" />
              <h3 className="text-h3 text-foreground">Aucun match a venir</h3>
              <p className="mt-2 text-muted-foreground">De nouveaux matchs seront bientot annonces.</p>
            </Card>
          ) : (
            matches.map((match) => (
                <Card key={match.id} variant="interactive" className="cursor-pointer p-5" onClick={() => navigate(`/match/${match.id}`)}>
                  <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCompetitionColor(match.competition)}`}>
                    {translateCompetition(match.competition)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(match.datetime)}</span>
                  </span>
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
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{formatTime(match.datetime)}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>{match.location}</span>
                    </p>
                  </div>
                </Card>
            ))
          )}
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-h2 text-foreground">Actualites du Club</h2>
          <Button variant="outline" onClick={() => navigate("/news")}>Voir tout</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.length === 0 ? (
            <Card variant="glass" className="col-span-full p-10 text-center">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-primary" />
              <h3 className="text-h3 text-foreground">Aucune actualite disponible</h3>
              <p className="mt-2 text-muted-foreground">Revenez bientot pour les dernieres nouvelles.</p>
            </Card>
          ) : (
            news.map((it) => {
              const Icon = getNewsIcon(it.category)
              const categoryColor = getNewsColor(it.category)
              const authorName = it.author ? `${it.author.firstname} ${it.author.lastname}` : "Auteur inconnu"

              return (
                <Card key={it.id} variant="interactive" className="flex h-full cursor-pointer flex-col overflow-hidden" onClick={() => navigate(`/news/${it.id}`)}>
                  <div className={`flex h-40 items-center justify-center ${categoryColor}`}>
                    <Icon className="h-14 w-14" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColor}`}>
                      {translateNewsCategory(it.category)}
                    </span>

                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-foreground">{it.title}</h3>

                    <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(it.created_at)}</span>
                      <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{authorName}</span>
                    </div>

                    {it.updated_by && it.updated_by_id !== it.author_id && (
                      <p className="mb-2 inline-flex items-center gap-1 text-xs text-info"><Edit3 className="h-3 w-3" />Modifie par {it.updated_by.firstname} {it.updated_by.lastname}</p>
                    )}

                    <p className="line-clamp-3 flex-1 border-t border-border/60 pt-3 text-sm text-muted-foreground">{it.excerpt}</p>

                    <Button variant="secondary" className="mt-1 w-full" onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/news/${it.id}`)
                    }}>
                      Lire la suite
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </section>
    </main>
  )
}
