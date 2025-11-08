import {
  Heart,
  Shield,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react"

export const aboutHistory = {
  title: "Notre Histoire",
  paragraphs: [
    "Fondé en 1985, notre club de football s'est rapidement imposé comme un acteur majeur du football local. Né de la passion d'un groupe d'amis passionnés, nous avons gravi les échelons grâce à notre détermination et notre esprit d'équipe.",
    "Aujourd'hui, nous comptons plus de 200 licenciés, des benjamins aux seniors, et nous continuons à promouvoir les valeurs du sport : respect, fair-play, solidarité et dépassement de soi.",
  ],
  quote: "Le football unit, inspire et révèle le meilleur de chacun",
  yearsLabel: "40 ans d'histoire",
  stats: [
    { value: "200+", label: "Licenciés", tone: "text-secondary" },
    { value: "12", label: "Équipes", tone: "text-tertiary" },
  ],
}


export const aboutValues = [
  {
    title: "Respect",
    icon: Users,
    toneBox: "bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/30",
    iconTone: "text-primary",
    text: "Respect de l'adversaire, des coéquipiers, des arbitres et de toutes les personnes qui gravitent autour du football.",
  },
  {
    title: "Excellence",
    icon: Trophy,
    toneBox: "bg-secondary/10 border border-secondary/20 dark:bg-secondary/5 dark:border-secondary/30",
    iconTone: "text-secondary",
    text: "Recherche constante de l'amélioration personnelle et collective, sur et en dehors du terrain.",
  },
  {
    title: "Passion",
    icon: Heart,
    toneBox: "bg-tertiary/10 border border-tertiary/20 dark:bg-tertiary/5 dark:border-tertiary/30",
    iconTone: "text-tertiary",
    text: "L'amour du football et du jeu collectif guide chacune de nos actions et décisions.",
  },
]

export const aboutStaff = [
  {
    name: "Jean Dupont",
    role: "Président",
    icon: User,
    toneBox: "bg-primary/10 border border-primary/20 dark:bg-primary/5 dark:border-primary/30",
    iconTone: "text-primary",
    bio: "Passionné de football depuis 30 ans, Jean dirige le club avec vision et détermination.",
  },
  {
    name: "Marie Martin",
    role: "Entraîneuse principale",
    icon: Zap,
    toneBox: "bg-secondary/10 border border-secondary/20 dark:bg-secondary/5 dark:border-secondary/30",
    iconTone: "text-secondary",
    bio: "Ancienne joueuse professionnelle, Marie apporte son expertise technique et tactique.",
  },
  {
    name: "Pierre Dubois",
    role: "Préparateur physique",
    icon: Shield,
    toneBox: "bg-tertiary/10 border border-tertiary/20 dark:bg-tertiary/5 dark:border-tertiary/30",
    iconTone: "text-tertiary",
    bio: "Spécialiste en préparation physique, Pierre optimise les performances de nos joueurs.",
  },
]

export const aboutFacilityMain = [
  "Pelouse naturelle entretenue",
  "Éclairage LED dernière génération",
  "Tribunes de 500 places",
  "Système d'arrosage automatique",
]

export const aboutFacilityEquip = [
  "Vestiaires modernes et spacieux",
  "Salle de musculation équipée",
  "Terrain d'entraînement synthétique",
  "Buvette et espace convivial",
]
