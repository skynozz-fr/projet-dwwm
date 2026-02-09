import { useNavigate } from "react-router-dom"
import { Calendar, CheckCircle, MapPin, Star, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { aboutFacilityEquip, aboutFacilityMain, aboutHistory, aboutStaff, aboutValues } from "@/lib/about-helpers"

export const About = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isLogged = !!user

  return (
    <div>
      <section className="page-hero section-shell p-8 md:p-10">
        <div className="relative z-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-caption text-white">
            <Target className="h-4 w-4" />
            Club de football
          </div>
          <h1 className="text-h1 text-white">A propos du club</h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-white/85">Decouvrez l'histoire, les valeurs et l'engagement qui font notre identite.</p>
        </div>
      </section>

      <section className="section-shell grid items-start gap-6 md:grid-cols-2">
        <Card variant="elevated" className="p-6 md:p-8">
          <h2 className="text-h2 text-foreground">{aboutHistory.title}</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            {aboutHistory.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-5 rounded-lg border-l-4 border-primary bg-primary/10 px-4 py-3 text-foreground">"{aboutHistory.quote}"</blockquote>
        </Card>

        <Card variant="glass" className="p-6 text-center md:p-8">
          <Target className="mx-auto h-14 w-14 text-primary" />
          <h3 className="mt-3 text-h3">{aboutHistory.yearsLabel}</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {aboutHistory.stats.map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-surface p-3">
                <p className={`text-2xl font-display ${s.tone}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section-shell">
        <h2 className="mb-5 text-center text-h2">Nos Valeurs</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {aboutValues.map(({ title, icon: Icon, toneBox, iconTone, text }) => (
            <Card key={title} variant="interactive" className="p-6 text-center">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${toneBox}`}>
                <Icon className={`h-7 w-7 ${iconTone}`} />
              </div>
              <h3 className="text-h3">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <h2 className="mb-5 text-center text-h2">Notre Staff</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {aboutStaff.map(({ name, role, icon: Icon, toneBox, iconTone, bio }) => (
            <Card key={name} variant="interactive" className="p-6 text-center">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${toneBox}`}>
                <Icon className={`h-9 w-9 ${iconTone}`} />
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-sm text-secondary">{role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{bio}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-5 md:grid-cols-2">
        <Card variant="elevated" className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-h3">Terrain principal</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {aboutFacilityMain.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-secondary" />
            <h3 className="text-h3">Equipements</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {aboutFacilityEquip.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="section-shell">
        <Card variant="glass" className="bg-grid-soft p-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-primary"><Calendar className="h-6 w-6" /><span className="text-h3">Rejoignez notre famille</span></div>
          <p className="mx-auto max-w-2xl text-muted-foreground">Il y a une place pour vous au FC Popcorn, sur le terrain comme en tribunes.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate("/register")} disabled={isLogged}>Nous rejoindre</Button>
            <Button size="lg" variant="secondary" onClick={() => (window.location.href = "mailto:contact@fc-popcorn.fr")}>Nous contacter</Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
