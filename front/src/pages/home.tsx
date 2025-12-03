import { useNavigate } from "react-router-dom"
import { AlertCircle, Calendar, Clock, MapPin, Target, Trophy, User, Edit3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { Button } from "@/components/Button"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/Loader"

import { formatDate, formatTime, getLatestItems, getUpcomingItems } from "@/lib/utils"
import { getCompetitionColor } from "@/lib/match-helpers"
import { getNewsColor, getNewsIcon, translateNewsCategory } from "@/lib/news-helpers"

import { getAllMatches } from "@/services/match.service"
import { getAllNews } from "@/services/news.service"

import type { Match as MatchType } from "@/types/match"
import type { News as NewsType } from "@/types/news"

export const Home = () => {
  const navigate = useNavigate()

  // Fetch matches and news in parallel with React Query
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

  const loading = isMatchesPending && isNewsPending
  const hadError = isMatchesError || isNewsError

  if (loading) return <Loader message="Chargement..." />

  return (
    <div>
      <section className="relative bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-background mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold">FC Popcorn</h1>
          </div>
          <p className="text-xl md:text-2xl text-background/90 max-w-3xl mx-auto mb-8">
            Le club de football qui unit passion, convivialité et excellence depuis 1985
          </p>
          {hadError && (
            <div className="max-w-2xl mx-auto mt-6 bg-background/10 backdrop-blur-sm border border-background/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-background flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-background mb-1">
                  Certaines données n'ont pas pu être chargées
                </p>
                <p className="text-xs text-background/80">
                  Nous rencontrons des difficultés à récupérer toutes les informations. Veuillez réessayer plus tard.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary">200+</div>
              <div className="text-muted-foreground">Licenciés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-tertiary">12</div>
              <div className="text-muted-foreground">Équipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success">40</div>
              <div className="text-muted-foreground">Ans d&#39;histoire</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">15</div>
              <div className="text-muted-foreground">Trophées</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-6">Prochains Matchs</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-primary mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Aucun match à venir</h3>
                <p className="text-muted-foreground text-lg">
                  Restez connecté, de nouveaux matchs seront bientôt annoncés ! ⚽
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <Card
                  key={match.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getCompetitionColor(
                        match.competition
                      )}`}
                    >
                      {match.competition}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(match.datetime)}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-foreground mb-2">{match.home_team}</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {match.home_score !== null && match.away_score !== null
                        ? `${match.home_score} - ${match.away_score}`
                        : "vs"}
                    </div>
                    <div className="text-lg font-semibold text-foreground">{match.away_team}</div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(match.datetime)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {match.location}
                    </div>
                  </div>

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
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-6">Actualités du Club</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Trophy className="w-16 h-16 text-secondary mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Aucune actualité pour le moment
                </h3>
                <p className="text-muted-foreground text-lg">
                  Revenez bientôt pour découvrir les dernières nouvelles du club ! 📰
                </p>
              </div>
            ) : (
              news.map((it) => {
                const Icon = getNewsIcon(it.category)
                const categoryColor = getNewsColor(it.category)
                const authorName = it.author ? `${it.author.firstname} ${it.author.lastname}` : "Auteur inconnu"

                return (
                  <Card
                    key={it.id}
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-primary flex flex-col h-full"
                    onClick={() => navigate(`/news/${it.id}`)}
                  >
                    <div className={`h-48 ${categoryColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-20 h-20" />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-3">
                        <span className={`py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                          {translateNewsCategory(it.category)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">{it.title}</h3>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(it.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {authorName}
                        </div>
                      </div>
                      {it.updated_by && it.updated_by_id !== it.author_id && (
                        <div className="flex items-center gap-1 text-xs text-info-foreground mb-2">
                          <Edit3 className="w-3 h-3" />
                          <span>Modifié par {it.updated_by.firstname} {it.updated_by.lastname}</span>
                        </div>
                      )}

                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{it.excerpt}</p>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/news/${it.id}`)
                        }}
                      >
                        Lire la suite
                      </Button>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Prêt à rejoindre l&#39;aventure FC Popcorn ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Que vous soyez joueur, supporter ou bénévole, il y a une place pour vous dans notre famille !
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => (window.location.href = "mailto:contact@fc-popcorn.fr")}
          >
            Nous contacter
          </Button>
        </div>
      </section>
    </div>
  )
}