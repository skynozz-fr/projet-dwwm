import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = (raw: string) => bcrypt.hashSync(raw, bcrypt.genSaltSync(10));

async function main() {
  // Read defaults from env or use sensible local dev fallbacks
  const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.test";
  const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin1234";
  const ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME || "Admin";
  const ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME || "Admin";

  const USER_EMAIL = process.env.DEFAULT_USER_EMAIL || "user@user.test";
  const USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || "User1234";
  const USER_FIRSTNAME = process.env.DEFAULT_USER_FIRSTNAME || "User";
  const USER_LASTNAME = process.env.DEFAULT_USER_LASTNAME || "User";

  // Create ADMIN if it doesn't exist
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {}, // do not overwrite existing data on repeated seeds
    create: {
      firstname: ADMIN_FIRSTNAME,
      lastname: ADMIN_LASTNAME,
      email: ADMIN_EMAIL,
      password: hash(ADMIN_PASSWORD),
      role: "ADMIN" as Role,
    },
  });

  // Create USER if it doesn't exist
  const user = await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      firstname: USER_FIRSTNAME,
      lastname: USER_LASTNAME,
      email: USER_EMAIL,
      password: hash(USER_PASSWORD),
      role: "USER" as Role,
    },
  });

  // Create 6 matches (mix of completed & scheduled)
  const match1 = await prisma.match.create({
    data: {
      home_team: "FC Popcorn",
      away_team: "SC Butter",
      is_home: true,
      datetime: new Date("2025-11-26T15:00:00"),
      venue: "Stade du Maïs",
      location: "Popcorn City",
      competition: "LEAGUE",
      status: "SCHEDULED",
      description: "Affiche pour la 12e journée : duel pour la tête du classement",
      referee: "J. Martin",
      weather: "Frais, couvert",
    },
  });

  const match2 = await prisma.match.create({
    data: {
      home_team: "AS Caramel",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: new Date("2025-11-20T20:45:00"),
      venue: "Arena Sucrée",
      location: "Sweet Town",
      competition: "CUP",
      status: "COMPLETED",
      home_score: 1,
      away_score: 3,
      description: "Quart de finale : qualification solide avec un jeu maîtrisé",
      referee: "M. Kernelle",
      weather: "Sec, 8°C",
    },
  });

  const match3 = await prisma.match.create({
    data: {
      home_team: "FC Popcorn",
      away_team: "Grain United",
      is_home: true,
      datetime: new Date("2025-11-18T18:30:00"),
      venue: "Stade du Maïs",
      location: "Popcorn City",
      competition: "LEAGUE",
      status: "COMPLETED",
      home_score: 2,
      away_score: 2,
      description: "Match accroché : égalisation dans le temps additionnel",
      referee: "S. Lefèvre",
      weather: "Pluie légère",
    },
  });

  const match4 = await prisma.match.create({
    data: {
      home_team: "Popcorn City",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: new Date("2025-11-14T14:00:00"),
      venue: "Centre Sportif Municipal",
      location: "Popcorn City",
      competition: "FRIENDLY",
      status: "COMPLETED",
      home_score: 0,
      away_score: 4,
      description: "Match amical pour faire tourner l'effectif : clean sheet",
      referee: "A. Roche",
      weather: "Ensoleillé, 12°C",
    },
  });

  const match5 = await prisma.match.create({
    data: {
      home_team: "FC Popcorn",
      away_team: "Maïs Athletic",
      is_home: true,
      datetime: new Date("2025-12-02T21:00:00"),
      venue: "Stade du Maïs",
      location: "Popcorn City",
      competition: "LEAGUE",
      status: "SCHEDULED",
      description: "Rencontre importante avant la trêve : objectif victoire",
      referee: "T. Gravier",
      weather: "Froid attendu",
    },
  });

  const match6 = await prisma.match.create({
    data: {
      home_team: "FC Popcorn",
      away_team: "Butter Royals",
      is_home: true,
      datetime: new Date("2025-12-10T19:00:00"),
      venue: "Stade du Maïs",
      location: "Popcorn City",
      competition: "TOURNAMENT",
      status: "SCHEDULED",
      description: "Tournoi d'hiver : entrée en lice contre un rival historique",
      referee: "L. Perrin",
      weather: "Froid sec",
    },
  });

  // Create 6 news (authored by admin)
  const news1 = await prisma.news.create({
    data: {
      title: "Qualification méritée en coupe face à AS Caramel",
      excerpt: "Victoire 3-1 : solidité défensive et réalisme offensif.",
      content: "Le FC Popcorn s'est imposé 3-1 à l'extérieur grâce à une prestation collective sérieuse. Après une entame prudente, l'équipe a accéléré au retour des vestiaires. Le coach a salué l'attitude et l'engagement de tous les joueurs.",
      category: "MATCH",
      author_id: admin.id,
    },
  });

  const news2 = await prisma.news.create({
    data: {
      title: "Match nul frustrant mais encourageant contre Grain United",
      excerpt: "2-2 : égalisation tardive qui évite la défaite.",
      content: "Un match intense où le FC Popcorn a montré du caractère en revenant au score dans les dernières secondes. Le staff souligne la capacité mentale du groupe à ne jamais abandonner.",
      category: "MATCH",
      author_id: admin.id,
    },
  });

  const news3 = await prisma.news.create({
    data: {
      title: "Large succès en amical : rotation réussie",
      excerpt: "Victoire 4-0 : les remplaçants ont répondu présent.",
      content: "Dans un match de préparation, plusieurs jeunes joueurs ont eu leur chance et ont impressionné par leur dynamique et leur discipline tactique. De bon augure pour la suite de la saison.",
      category: "MATCH",
      author_id: admin.id,
    },
  });

  const news4 = await prisma.news.create({
    data: {
      title: "Rumeur de transfert : un milieu ciblé pour janvier",
      excerpt: "Le club explore le marché pour renforcer l'entrejeu.",
      content: "Selon plusieurs sources internes, le FC Popcorn étudie la possibilité d'ajouter un milieu relayeur technique pour anticiper la deuxième partie de saison. Aucune offre officielle n'a encore été formulée mais des discussions préliminaires existent.",
      category: "TRANSFER",
      author_id: admin.id,
    },
  });

  const news5 = await prisma.news.create({
    data: {
      title: "Point santé : effectif presque au complet",
      excerpt: "Seul un joueur en reprise individuelle cette semaine.",
      content: "Le staff médical a confirmé que la majorité des petits pépins musculaires sont résorbés. Le groupe devrait être presque complet pour le prochain match de championnat, hormis un joueur encore en phase de réathlétisation.",
      category: "OTHER",
      author_id: admin.id,
    },
  });

  const news6 = await prisma.news.create({
    data: {
      title: "Focus sur la formation : trois jeunes avec le groupe pro",
      excerpt: "Intégration progressive de talents issus de l'académie.",
      content: "Le club poursuit sa stratégie d'intégration des jeunes en invitant trois espoirs à s'entraîner régulièrement avec le groupe professionnel. Objectif : leur offrir un cadre exigeant tout en accélérant leur adaptation au niveau supérieur.",
      category: "OTHER",
      author_id: admin.id,
    },
  });

  console.log("Seed complete:", {
    admin: { id: admin.id, email: admin.email, role: admin.role },
    user: { id: user.id, email: user.email, role: user.role },
    matches: [match1, match2, match3, match4, match5, match6].map(m => ({ id: m.id, home_team: m.home_team, away_team: m.away_team, status: m.status })),
    news: [news1, news2, news3, news4, news5, news6].map(n => ({ id: n.id, title: n.title, category: n.category })),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
