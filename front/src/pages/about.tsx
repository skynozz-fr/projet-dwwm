import { useNavigate } from "react-router-dom"
import { Calendar, CheckCircle, MapPin, Star, Target } from "lucide-react"

import { Button } from "@/components/Button"
import { useAuth } from "@/hooks/useAuth"
import {
  aboutHistory,
  aboutValues,
  aboutStaff,
  aboutFacilityMain,
  aboutFacilityEquip,
} from "@/lib/about-helpers"

export const About = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isLogged = !!user

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
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
            Découvrez l'histoire, les valeurs et l'engagement qui font de notre club une famille
            unie par la passion du football.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">{aboutHistory.title}</h2>

              {aboutHistory.paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground text-lg mb-6">
                  {p}
                </p>
              ))}

              <div className="bg-primary/10 border border-primary border-l-4 border-l-primary p-4 rounded dark:bg-primary/5 dark:border-primary/30">
                <p className="text-foreground font-semibold italic">
                  “{aboutHistory.quote}”
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center dark:bg-primary/5 dark:border-primary/30">
              <div className="text-6xl mb-4 text-primary">
                <Target className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {aboutHistory.yearsLabel}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-center">
                {aboutHistory.stats.map((s) => (
                  <div key={s.label}>
                    <div className={`text-3xl font-bold ${s.tone}`}>{s.value}</div>
                    <div className="text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {aboutValues.map(({ title, icon: Icon, toneBox, iconTone, text }) => (
              <div key={title} className="text-center group">
                <div
                  className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-colors ${toneBox} group-hover:opacity-90`}
                >
                  <Icon className={`w-8 h-8 ${iconTone}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
                <p className="text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">Notre Staff</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {aboutStaff.map(({ name, role, icon: Icon, toneBox, iconTone, bio }) => (
              <div
                key={name}
                className="bg-muted border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow dark:bg-muted/50 dark:border-border/50"
              >
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${toneBox}`}
                >
                  <Icon className={`w-10 h-10 ${iconTone}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
                <p className="text-secondary font-medium mb-2">{role}</p>
                <p className="text-muted-foreground text-sm">{bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-10">Nos Installations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted border border-border rounded-lg p-6 dark:bg-muted/50 dark:border-border/50">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-bold text-foreground">Terrain Principal</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                {aboutFacilityMain.map((f) => (
                  <li key={f} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted border border-border rounded-lg p-6 dark:bg-muted/50 dark:border-border/50">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-secondary mr-3" />
                <h3 className="text-xl font-bold text-foreground">Équipements</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                {aboutFacilityEquip.map((f) => (
                  <li key={f} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 dark:from-primary/5 dark:to-secondary/5 dark:border-primary/30">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-foreground">Rejoignez notre famille !</h2>
          </div>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Que vous soyez joueur débutant ou confirmé, supporter passionné ou bénévole motivé, il
            y a une place pour vous dans notre club. Venez partager votre passion du football avec
            nous !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/register")}
              disabled={isLogged}
            >
              Nous rejoindre
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = "mailto:contact@fc-popcorn.fr")}
            >
              Nous contacter
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}