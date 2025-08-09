import { Button } from "@/components/Button"
import { Calendar, MapPin, Trophy, Users, Zap, Clock, Target } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()

  // Données mockées - à remplacer par tes appels API
  const matchsData = [
    {
      id: 1,
      homeTeam: "FC Popcorn",
      awayTeam: "AS Rivaux",
      date: "2025-07-15",
      dateFormatted: "15 Juil",
      time: "15h00",
      location: "Domicile",
      competition: "Championnat",
      competitionColor: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      homeTeam: "FC Popcorn",
      awayTeam: "FC Champions",
      date: "2025-07-22",
      dateFormatted: "22 Juil",
      time: "17h30",
      location: "Extérieur",
      competition: "Coupe",
      competitionColor: "bg-secondary/10 text-secondary"
    },
    {
      id: 3,
      homeTeam: "FC Popcorn",
      awayTeam: "Étoiles FC",
      date: "2025-07-29",
      dateFormatted: "29 Juil",
      time: "14h00",
      location: "Domicile",
      competition: "Amical",
      competitionColor: "bg-tertiary/10 text-tertiary"
    },
    {
      id: 4,
      homeTeam: "FC Popcorn",
      awayTeam: "United FC",
      date: "2025-08-05",
      dateFormatted: "5 Août",
      time: "16h00",
      location: "Extérieur",
      competition: "Championnat",
      competitionColor: "bg-primary/10 text-primary"
    }
  ]

  const actualitesData = [
    {
      id: 1,
      title: "Victoire en finale de coupe !",
      date: "2025-07-10",
      dateFormatted: "10 Juillet 2025",
      description: "Une victoire historique 3-1 face aux Aigles Dorés nous offre notre 15ème trophée. Félicitations à toute l'équipe ! Cette victoire marque un tournant dans l'histoire du club et récompense des mois de travail acharné.",
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/20"
    },
    {
      id: 2,
      title: "Nouveau recrutement !",
      date: "2025-07-05",
      dateFormatted: "5 Juillet 2025",
      description: "Nous accueillons 3 nouveaux joueurs talentueux qui renforceront notre équipe première. Bienvenue à eux ! Ces recrues apportent de nouvelles compétences et une fraîcheur qui sera bénéfique pour l'équipe.",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/20"
    },
    {
      id: 3,
      title: "Stage d'été réussi",
      date: "2025-07-01",
      dateFormatted: "1 Juillet 2025",
      description: "Notre stage d'été s'est parfaitement déroulé avec une excellente préparation physique et tactique. Les joueurs sont maintenant prêts pour la nouvelle saison qui approche à grands pas.",
      icon: Zap,
      color: "text-tertiary",
      bgColor: "bg-tertiary/20"
    },
    {
      id: 4,
      title: "Nouveaux équipements",
      date: "2025-06-25",
      dateFormatted: "25 Juin 2025",
      description: "Le club a investi dans de nouveaux équipements d'entraînement de dernière génération. Ces outils modernes permettront d'améliorer les performances de nos joueurs et d'optimiser leur préparation.",
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/20"
    }
  ]

  // Fonction pour récupérer les 3 prochains matchs
  const getNextMatches = () => {
    const today = new Date()
    return matchsData
      .filter(match => new Date(match.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  }

  // Fonction pour récupérer les 3 dernières actualités
  const getLatestNews = () => {
    return actualitesData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }

  // Fonction pour limiter le texte
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  const nextMatches = getNextMatches()
  const latestNews = getLatestNews()
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-background mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold text-background">
              FC Popcorn
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-background/90 max-w-3xl mx-auto mb-8">
            Le club de football qui unit passion, convivialité et excellence depuis 1985
          </p>
        </div>
      </section>

      {/* Statistiques rapides */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-muted-foreground">Ans d'histoire</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">15</div>
              <div className="text-muted-foreground">Trophées</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prochains matchs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Prochains Matchs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextMatches.map((match) => (
              <div 
                key={match.id}
                className="bg-muted border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/match/${match.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${match.competitionColor}`}>
                    {match.competition}
                  </span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {match.dateFormatted}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>
                  <div className="flex items-center justify-center text-muted-foreground text-sm mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    {match.time}
                    <MapPin className="w-4 h-4 ml-3 mr-1" />
                    {match.location}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/match/${match.id}`)
                    }}
                  >
                    Voir les détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Actualités du Club
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((actualite) => {
              const IconComponent = actualite.icon
              return (
                <article 
                  key={actualite.id}
                  className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-[400px] flex flex-col"
                  onClick={() => navigate(`/actualite/${actualite.id}`)}
                >
                  <div className={`h-48 ${actualite.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`w-16 h-16 ${actualite.color}`} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {actualite.dateFormatted}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {actualite.title}
                    </h3>
                    <p className="text-muted-foreground flex-1 leading-relaxed">
                      {truncateText(actualite.description, 120)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Prêt à rejoindre l'aventure FC Popcorn ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Que vous soyez joueur, supporter ou bénévole, il y a une place pour vous dans notre famille !
          </p>
          <Button variant="secondary">
            Nous contacter
          </Button>
        </div>
      </section>
    </div>
  )
}