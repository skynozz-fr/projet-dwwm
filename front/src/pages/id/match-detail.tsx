import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, Home, MapPin, Plane } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

  const { data: match, isPending, isError, refetch } = useQuery<MatchType>({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id as string),
    enabled: !!id,
  })

  if (!id) return <ErrorPage title="Erreur de chargement" message="Identifiant de match invalide" onGoBack={() => navigate("/matches")} />
  if (isPending) return <Loader message="Chargement du match..." />
  if (isError) return <ErrorPage title="Erreur de chargement" message="Impossible de charger le match" onRetry={() => refetch()} onGoBack={() => navigate("/matches")} />
  if (!match) return <NotFound />

  const competitionStyle = getCompetitionColor(match.competition)

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10 text-center">
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/10" onClick={() => navigate("/matches")}>
            <ArrowLeft className="h-4 w-4" />Retour aux matchs
          </Button>
          <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${competitionStyle}`}>{translateCompetition(match.competition)}</span>
          <h1 className="mt-4 text-h1 text-white">{match.home_team} vs {match.away_team}</h1>
          <p className="mt-2 inline-flex items-center gap-2 text-white/85"><Calendar className="h-4 w-4" />{formatDateTime(match.datetime)}</p>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="elevated" className="p-8 text-center">
          <div className="mb-5 grid items-center gap-4 md:grid-cols-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xl font-semibold"><Home className="h-5 w-5 text-primary" />{match.home_team}</p>
            </div>
            <div>
              <p className="text-5xl font-display text-primary">{match.home_score ?? "-"} : {match.away_score ?? "-"}</p>
              <p className="text-sm text-muted-foreground">{translateMatchStatus(match.status)}</p>
            </div>
            <div>
              <p className="inline-flex items-center gap-2 text-xl font-semibold"><Plane className="h-5 w-5 text-secondary" />{match.away_team}</p>
            </div>
          </div>
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{match.venue} - {match.location}</p>
        </Card>
      </section>

      <section className="section-shell grid gap-5 md:grid-cols-2">
        <Card variant="elevated" className="p-6">
          <h2 className="mb-3 text-h3">A propos du match</h2>
          <p className="text-muted-foreground">{match.description || "Aucune description disponible pour ce match."}</p>
        </Card>

        <div className="space-y-5">
          <Card variant="elevated" className="p-6">
            <h3 className="mb-3 text-h3">Informations pratiques</h3>
            <p className="mb-2 inline-flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" />Coup d'envoi: {formatTime(match.datetime)}</p>
            <p className="inline-flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{match.venue}</p>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="mb-3 text-h3">Details</h3>
            <div className="space-y-2 text-sm">
              {match.referee && <p className="flex justify-between gap-3"><span className="text-muted-foreground">Arbitre:</span><span>{match.referee}</span></p>}
              {match.weather && <p className="flex justify-between gap-3"><span className="text-muted-foreground">Meteo:</span><span>{match.weather}</span></p>}
              <p className="flex justify-between gap-3"><span className="text-muted-foreground">Competition:</span><span>{translateCompetition(match.competition)}</span></p>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="p-8 text-center">
          <h2 className="text-h2">Venez nous encourager</h2>
          <p className="mt-3 text-muted-foreground">Votre soutien est precieux pour nos joueurs. Rejoignez-nous au stade.</p>
          <Button className="mt-5" variant="secondary" onClick={() => copyToClipboardWithToast(window.location.href, toast)}>Partager le match</Button>
        </Card>
      </section>
    </div>
  )
}
