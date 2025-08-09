import { Button } from "@/components/Button"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, MapPin, Clock, ArrowLeft, Target, Shield } from "lucide-react"

export const MatchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Données mockées - à remplacer par tes appels API
  const matchData = {
    1: {
      homeTeam: "FC Popcorn",
      awayTeam: "AS Rivaux",
      date: "15 Juillet 2025",
      time: "15h00",
      venue: "Stade Municipal",
      location: "Domicile",
      competition: "Championnat",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Match crucial pour le maintien en tête du championnat. Nos adversaires sont redoutables mais nous sommes confiants dans nos capacités.",
      homeFormation: "4-3-3",
      awayFormation: "4-4-2",
      referee: "M. Dupont",
      weather: "Ensoleillé, 24°C",
    },
    2: {
      homeTeam: "FC Champions",
      awayTeam: "FC Popcorn",
      date: "22 Juillet 2025",
      time: "17h30",
      venue: "Stade des Champions",
      location: "Extérieur",
      competition: "Coupe",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Quart de finale de coupe face à une équipe de division supérieure. Un défi de taille qui nous motive énormément !",
      homeFormation: "4-2-3-1",
      awayFormation: "4-3-3",
      referee: "Mme Martin",
      weather: "Nuageux, 21°C"
    },
    3: {
      homeTeam: "FC Popcorn",
      awayTeam: "Étoiles FC",
      date: "29 Juillet 2025",
      time: "14h00",
      venue: "Stade Municipal",
      location: "Domicile",
      competition: "Amical",
      status: "À venir",
      homeScore: null,
      awayScore: null,
      description: "Match amical de préparation avant la reprise du championnat. L'occasion de tester de nouvelles tactiques.",
      homeFormation: "3-5-2",
      awayFormation: "4-3-3",
      referee: "M. Bernard",
      weather: "Ensoleillé, 26°C"
    }
  }

  const match = matchData[id as '1' | '2' | '3']

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Match non trouvé</h1>
          <Button onClick={() => navigate('/home')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "Championnat": return "bg-primary/10 text-primary"
      case "Coupe": return "bg-secondary/10 text-secondary"
      case "Amical": return "bg-tertiary/10 text-tertiary"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="mb-6 text-background hover:bg-background/20"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getCompetitionColor(match.competition)}`}>
              {match.competition}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
              {match.homeTeam} vs {match.awayTeam}
            </h1>
            <div className="flex items-center justify-center text-background/90 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              {match.date} - {match.time}
            </div>
          </div>
        </div>
      </div>

      {/* Score/Status */}
      <div className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background border border-border rounded-lg p-8 text-center">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">{match.homeTeam}</span>
                </div>
                <div className="text-sm text-muted-foreground">Formation: {match.homeFormation}</div>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                </div>
                <div className="text-lg font-medium text-muted-foreground">{match.status}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-secondary mr-2" />
                  <span className="text-2xl font-bold text-foreground">{match.awayTeam}</span>
                </div>
                <div className="text-sm text-muted-foreground">Formation: {match.awayFormation}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {match.venue} - {match.location}
            </div>
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Description */}
            <div className="bg-muted border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">À propos du match</h2>
              <p className="text-muted-foreground leading-relaxed">
                {match.description}
              </p>
            </div>

            {/* Détails */}
            <div className="space-y-6">
              <div className="bg-muted border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3" />
                    <span className="text-foreground">Coup d'envoi : {match.time}</span>
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arbitre :</span>
                    <span className="text-foreground">{match.referee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Météo :</span>
                    <span className="text-foreground">{match.weather}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compétition :</span>
                    <span className="text-foreground">{match.competition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Venez nous encourager !
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Votre soutien est précieux pour nos joueurs. Rejoignez-nous au stade !
          </p>
          <Button variant="secondary">
            Partager le match
          </Button>
        </div>
      </div>
    </div>
  )
}
