import { 
  Users, 
  Trophy, 
  Heart, 
  User, 
  Target, 
  Zap, 
  CheckCircle, 
  MapPin, 
  Calendar,
  Star,
  Shield
} from 'lucide-react'
import { Button } from '@/components/Button'

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-background mr-2" />
            <span className="text-background font-medium text-sm uppercase tracking-wider">
              Club de Football
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-background mb-4">
            À propos du club
          </h1>
          
          <p className="text-xl md:text-2xl text-background/90 max-w-3xl mx-auto">
            Découvrez l'histoire, les valeurs et l'engagement qui font de notre club une famille unie par la passion du football.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Histoire du Club */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Notre Histoire
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Fondé en 1985, notre club de football s'est rapidement imposé comme un acteur majeur du football local. 
                Né de la passion d'un groupe d'amis passionnés, nous avons gravi les échelons grâce à notre détermination 
                et notre esprit d'équipe.
              </p>
              <p className="text-muted-foreground text-lg mb-6">
                Aujourd'hui, nous comptons plus de 200 licenciés, des benjamins aux seniors, et nous continuons à 
                promouvoir les valeurs du sport : respect, fair-play, solidarité et dépassement de soi.
              </p>
              <div className="bg-primary/10 border border-primary border-l-4 border-l-primary p-4 rounded dark:bg-primary/5 dark:border-primary/30">
                <p className="text-foreground font-semibold italic">
                  "Le football unit, inspire et révèle le meilleur de chacun"
                </p>
              </div>
            </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center dark:bg-primary/5 dark:border-primary/30">
                <div className="text-6xl mb-4 text-primary">
                  <Target className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">40 ans d'histoire</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-secondary">200+</div>
                    <div className="text-muted-foreground">Licenciés</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-tertiary">12</div>
                    <div className="text-muted-foreground">Équipes</div>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-primary/10 border border-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors dark:bg-primary/5 dark:border-primary/30">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Respect</h3>
              <p className="text-muted-foreground">
                Respect de l'adversaire, des coéquipiers, des arbitres et de toutes les personnes qui gravitent autour du football.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-secondary/10 border border-secondary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors dark:bg-secondary/5 dark:border-secondary/30">
                <Trophy className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                Recherche constante de l'amélioration personnelle et collective, sur et en dehors du terrain.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-tertiary/10 border border-tertiary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary/20 transition-colors dark:bg-tertiary/5 dark:border-tertiary/30">
                <Heart className="w-8 h-8 text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Passion</h3>
              <p className="text-muted-foreground">
                L'amour du football et du jeu collectif guide chacune de nos actions et décisions.
              </p>
            </div>
          </div>
        </section>

        {/* Staff */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">
            Notre Staff
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-muted border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow dark:bg-muted/50 dark:border-border/50">
              <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary/5 dark:border-primary/30">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Jean Dupont</h3>
              <p className="text-secondary font-medium mb-2">Président</p>
              <p className="text-muted-foreground text-sm">
                Passionné de football depuis 30 ans, Jean dirige le club avec vision et détermination.
              </p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow dark:bg-muted/50 dark:border-border/50">
              <div className="w-24 h-24 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-secondary/5 dark:border-secondary/30">
                <Zap className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Marie Martin</h3>
              <p className="text-secondary font-medium mb-2">Entraîneuse principale</p>
              <p className="text-muted-foreground text-sm">
                Ancienne joueuse professionnelle, Marie apporte son expertise technique et tactique.
              </p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow dark:bg-muted/50 dark:border-border/50">
              <div className="w-24 h-24 bg-tertiary/10 border border-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-tertiary/5 dark:border-tertiary/30">
                <Shield className="w-10 h-10 text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Pierre Dubois</h3>
              <p className="text-secondary font-medium mb-2">Préparateur physique</p>
              <p className="text-muted-foreground text-sm">
                Spécialiste en préparation physique, Pierre optimise les performances de nos joueurs.
              </p>
            </div>
          </div>
        </section>

        {/* Installations */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">
            Nos Installations
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted border border-border rounded-lg p-6 dark:bg-muted/50 dark:border-border/50">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">Terrain Principal</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Pelouse naturelle entretenue</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Éclairage LED dernière génération</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Tribunes de 500 places</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Système d'arrosage automatique</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted border border-border rounded-lg p-6 dark:bg-muted/50 dark:border-border/50">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-secondary mr-3" />
                <h3 className="text-xl font-bold text-foreground">Équipements</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Vestiaires modernes et spacieux</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Salle de musculation équipée</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Terrain d'entraînement synthétique</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                  <span>Buvette et espace convivial</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 dark:from-primary/5 dark:to-secondary/5 dark:border-primary/30">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-foreground">
              Rejoignez notre famille !
            </h2>
          </div>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Que vous soyez joueur débutant ou confirmé, supporter passionné ou bénévole motivé, 
            il y a une place pour vous dans notre club. Venez partager votre passion du football avec nous !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
            >
              Nous rejoindre
            </Button>
            <Button 
              variant="secondary"
              size="lg"
            >
              Nous contacter
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
