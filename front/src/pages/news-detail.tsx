import { Button } from "@/components/Button"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, ArrowLeft, Trophy, Users, Zap, BookOpen } from "lucide-react"
import { copyToClipboardWithToast } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import { NotFound } from "./errors/NotFound"

export const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Données mockées - à remplacer par tes appels API
  const newsData = {
    1: {
      title: "Victoire en finale de coupe !",
      date: "10 Juillet 2025",
      author: "Équipe Communication",
      category: "Compétition",
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/20",
      excerpt: "Une victoire historique 3-1 face aux Aigles Dorés nous offre notre 15ème trophée. Félicitations à toute l'équipe !",
      content: `
        <p>Quelle soirée magique ! Nos joueurs ont livré une performance exceptionnelle lors de la finale de coupe face aux Aigles Dorés, s'imposant 3-1 dans un match haletant.</p>
        
        <h3>Le déroulement du match</h3>
        <p>Dès la 15ème minute, notre capitaine Marc Durand ouvrait le score d'une superbe frappe enroulée. Les Aigles Dorés égalisaient avant la pause, mais nos hommes revenaient des vestiaires avec des intentions offensives.</p>
        
        <p>En seconde période, Paul Martin redonnait l'avantage aux nôtres (58'), avant que Julien Petit ne scelle définitivement le sort de la rencontre (75').</p>
        
        <h3>Les réactions</h3>
        <p>"Je suis extrêmement fier de mes joueurs. Ils ont montré un caractère exceptionnel et ont su élever leur niveau de jeu au bon moment", déclarait notre entraîneur Michel Fournier après la rencontre.</p>
        
        <p>Cette victoire marque le 15ème trophée de l'histoire du club et vient récompenser des mois de travail acharné. Rendez-vous la semaine prochaine pour la présentation du trophée à nos supporters !</p>
      `,
      relatedArticles: [2, 3]
    },
    2: {
      title: "Nouveau recrutement !",
      date: "5 Juillet 2025",
      author: "Direction Sportive",
      category: "Transferts",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      excerpt: "Nous accueillons 3 nouveaux joueurs talentueux qui renforceront notre équipe première. Bienvenue à eux !",
      content: `
        <p>Le FC Popcorn est fier d'annoncer l'arrivée de trois nouveaux joueurs qui viennent renforcer notre effectif pour la saison à venir.</p>
        
        <h3>Les nouvelles recrues</h3>
        <p><strong>Thomas Bernard</strong> (22 ans) - Milieu offensif en provenance de l'ES Montagne. Ce joueur technique et créatif apportera de la profondeur à notre secteur offensif.</p>
        
        <p><strong>Alex Moreau</strong> (26 ans) - Défenseur central expérimenté venant de l'US Vallée. Sa solidité défensive et son leadership seront des atouts précieux.</p>
        
        <p><strong>Kevin Rousseau</strong> (20 ans) - Jeune gardien prometteur formé au centre de formation du FC Élite. Il vient concurrencer notre titulaire actuel.</p>
        
        <h3>Les objectifs</h3>
        <p>Ces recrutements s'inscrivent dans notre stratégie de renforcement de l'équipe première tout en maintenant notre philosophie de jeu axée sur la technique et l'esprit collectif.</p>
        
        <p>"Ces trois joueurs correspondent parfaitement à notre projet. Ils apportent chacun des qualités spécifiques qui nous manquaient", explique notre directeur sportif Pierre Lemaire.</p>
        
        <p>Nous leur souhaitons la bienvenue et sommes convaincus qu'ils sauront s'intégrer rapidement dans notre famille popcorn !</p>
      `,
      relatedArticles: [1, 3]
    },
    3: {
      title: "Stage d'été réussi",
      date: "1 Juillet 2025",
      author: "Staff Technique",
      category: "Préparation",
      icon: Zap,
      color: "text-tertiary",
      bgColor: "bg-tertiary/20",
      excerpt: "Notre stage d'été s'est parfaitement déroulé avec une excellente préparation physique et tactique.",
      content: `
        <p>Du 25 juin au 30 juin, nos joueurs ont participé à un stage intensif de préparation dans les montagnes, combinant entraînement physique, travail tactique et cohésion d'équipe.</p>
        
        <h3>Programme du stage</h3>
        <p>Chaque journée était structurée avec une séance matinale axée sur le physique, suivie d'un travail tactique l'après-midi. Les soirées étaient dédiées à la récupération et aux activités de cohésion.</p>
        
        <p>Les joueurs ont également participé à trois matchs amicaux contre des équipes locales, permettant de mettre en pratique les automatismes travaillés.</p>
        
        <h3>Bilan positif</h3>
        <p>Le staff technique se dit très satisfait de l'état d'esprit et de l'investissement des joueurs. "L'ambiance était excellente et le groupe est très soudé", confie l'entraîneur physique Jean Dubois.</p>
        
        <p>Les tests physiques réalisés en fin de stage montrent une progression notable de tous les joueurs, avec des pics de forme qui arrivent au bon moment.</p>
        
        <h3>Prochaines étapes</h3>
        <p>Les joueurs bénéficient maintenant d'une semaine de repos bien méritée avant de reprendre l'entraînement le 8 juillet en vue de la nouvelle saison.</p>
        
        <p>Le premier match officiel aura lieu le 15 juillet face à l'AS Rivaux. Nous sommes prêts !</p>
      `,
      relatedArticles: [1, 2]
    }
  }

  const news = newsData[id as '1' | '2' | '3']

  if (!news) {
    return <NotFound />
  }

  const IconComponent = news.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="mb-6 text-background hover:bg-background/20"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center bg-background/20 px-4 py-2 rounded-full text-sm font-medium text-background mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              {news.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
              {news.title}
            </h1>
            <div className="flex items-center justify-center text-background/90">
              <Calendar className="w-5 h-5 mr-2" />
              {news.date} - Par {news.author}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg flex items-center justify-center mb-8">
            <IconComponent className={`w-12 h-12 ${news.color}`} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-muted border border-border rounded-lg p-8">
          
          {/* Excerpt */}
          <div className="text-xl text-muted-foreground mb-8 p-4 bg-background rounded-lg border-l-4 border-primary">
            {news.excerpt}
          </div>

          {/* Article content */}
          <div 
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
            }}
          />

          <div className="mt-8 pt-8 border-t border-border">

            {/* Share buttons */}
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary"
                onClick={() => copyToClipboardWithToast(window.location.href, toast)}>
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Articles similaires
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {news.relatedArticles.map((relatedId) => {
              const relatedArticle = newsData[relatedId.toString() as '1' | '2' | '3']
              const RelatedIcon = relatedArticle.icon
              
              return (
                <div 
                  key={relatedId}
                  className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/news/${relatedId}`)}
                >
                  <div className={`w-12 h-12 ${relatedArticle.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <RelatedIcon className={`w-6 h-6 ${relatedArticle.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {relatedArticle.date}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
