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

  // Create 2 matches
  const match1 = await prisma.match.upsert({
    where: { id: 1 },
    update: {},
    create: {
      home_team: "FC Popcorn",
      away_team: "SC Butter",
      is_home: true,
      date: new Date("2025-11-15"),
      time: "15:00",
      venue: "Stade du Maïs",
      location: "Popcorn City",
      competition: "LEAGUE",
      status: "SCHEDULED",
      description: "Match de championnat crucial pour la première place",
    },
  });

  const match2 = await prisma.match.upsert({
    where: { id: 2 },
    update: {},
    create: {
      home_team: "AS Caramel",
      away_team: "FC Popcorn",
      is_home: false,
      date: new Date("2025-11-08"),
      time: "18:30",
      venue: "Arena Sucrée",
      location: "Sweet Town",
      competition: "CUP",
      status: "COMPLETED",
      home_score: 1,
      away_score: 3,
      description: "Victoire éclatante en quart de finale de coupe !",
      referee: "M. Kernelle",
      weather: "Ensoleillé",
    },
  });

  // Create 2 news (authored by admin)
  const news1 = await prisma.news.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Victoire éclatante en coupe : 3-1 contre AS Caramel",
      excerpt:
        "Le FC Popcorn a brillé hier soir en s'imposant 3-1 face à AS Caramel en quart de finale de coupe.",
      content:
        "Une performance remarquable de nos joueurs qui ont dominé le match de bout en bout. Nos attaquants ont été particulièrement efficaces avec un triplé en seconde mi-temps. Cette victoire nous propulse en demi-finale et confirme notre excellente forme du moment. Le coach a salué l'état d'esprit combatif de l'équipe.",
      category: "MATCH",
      author_id: admin.id,
    },
  });

  const news2 = await prisma.news.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Match décisif ce samedi face à SC Butter",
      excerpt:
        "Rendez-vous au Stade du Maïs pour soutenir le FC Popcorn dans ce choc au sommet du championnat.",
      content:
        "Ce samedi 15 novembre à 15h, le FC Popcorn affrontera son rival SC Butter dans un match qui pourrait décider du leader du championnat. Nos joueurs comptent sur votre soutien massif dans les tribunes. Les billets sont disponibles à la billetterie et en ligne. Ambiance garantie pour ce derby tant attendu !",
      category: "MATCH",
      author_id: admin.id,
    },
  });

  console.log("Seed complete:", {
    admin: { id: admin.id, email: admin.email, role: admin.role },
    user: { id: user.id, email: user.email, role: user.role },
    matches: [
      { id: match1.id, home_team: match1.home_team, away_team: match1.away_team },
      { id: match2.id, home_team: match2.home_team, away_team: match2.away_team },
    ],
    news: [
      { id: news1.id, title: news1.title },
      { id: news2.id, title: news2.title },
    ],
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
