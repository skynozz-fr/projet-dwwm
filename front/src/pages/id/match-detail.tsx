import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, Home, MapPin, Plane } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/Button"
import { Loader } from "@/components/Loader"
import { ErrorPage } from "../errors/ErrorPage"
import { NotFound } from "../errors/NotFound"

import { copyToClipboardWithToast, formatDateTime, formatTime } from "@/lib/utils"
import { getCompetitionColor, translateCompetition, translateMatchStatus } from "@/lib/match-helpers"
import { getMatchById } from "@/services/match.service"
import { useToast } from "@/hooks/useToast"

import type { Match as MatchType } from "@/types/match"

export const MatchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    data: match,
    isPending,
    isError,
    refetch,
  } = useQuery<MatchType>({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id as string),
    enabled: !!id,
  })

  if (!id) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Identifiant de match invalide"
        onGoBack={() => navigate("/matches")}
      />
    )
  }

  if (isPending) return <Loader message="Chargement du match..." />

  if (isError) {
    return (
      <ErrorPage
        title="Erreur de chargement"
        message="Impossible de charger le match"
        onRetry={() => refetch()}
        onGoBack={() => navigate("/matches")}
      />
    )
  }

  if (!match) return <NotFound />

  const iconColor = getCompetitionColor(match.competition)
  const translatedCategory = translateCompetition(match.competition)
  const translatedStatus = translateMatchStatus(match.status)

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 text-background hover:bg-background/20"
            onClick={() => navigate("/matches")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux matchs
          </Button>

          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${iconColor}`}>
              {translatedCategory}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
              {match.home_team} vs {match.away_team}
            </h1>
            <div className="flex items-center justify-center text-background/90 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              {formatDateTime(match.datetime)}
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-background border border-border rounded-lg p-8 text-center">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Home className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">{match.home_team}</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {match.home_score ?? "-"} : {match.away_score ?? "-"}
                </div>
                <div className="text-lg font-medium text-muted-foreground">{translatedStatus}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Plane className="w-6 h-6 text-secondary mr-2" />
                  <span className="text-2xl font-bold text-foreground">{match.away_team}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {match.venue} - {match.location}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">À propos du match</h2>
              {match.description ? (
                <p className="text-muted-foreground leading-relaxed">{match.description}</p>
              ) : (
                <p className="text-muted-foreground italic">Aucune description disponible pour ce match.</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-muted border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3" />
                    <span className="text-foreground">Coup d'envoi : {formatTime(match.datetime)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary mr-3" />
                    <span className="text-foreground">{match.venue}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Détails du match</h3>
                <div className="space-y-3">
                  {match.referee && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arbitre :</span>
                      <span className="text-foreground">{match.referee}</span>
                    </div>
                  )}
                  {match.weather && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Météo :</span>
                      <span className="text-foreground">{match.weather}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compétition :</span>
                    <span className="text-foreground">{translateCompetition(match.competition)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Venez nous encourager !</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Votre soutien est précieux pour nos joueurs. Rejoignez-nous au stade !
          </p>
          <Button
            variant="secondary"
            onClick={() => copyToClipboardWithToast(window.location.href, toast)}
          >
            Partager le match
          </Button>
        </div>
      </div>
    </div>
  )
}