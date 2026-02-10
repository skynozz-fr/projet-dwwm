import { MatchCompetition, MatchStatus, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = (raw: string) => bcrypt.hashSync(raw, bcrypt.genSaltSync(10));

const atTime = (base: Date, hour: number, minute: number) => {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const addHours = (base: Date, hours: number) => {
  const d = new Date(base);
  d.setHours(d.getHours() + hours);
  return d;
};

async function main() {
  const now = new Date();

  const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.test";
  const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "Admin1234";
  const ADMIN_FIRSTNAME = process.env.DEFAULT_ADMIN_FIRSTNAME || "Admin";
  const ADMIN_LASTNAME = process.env.DEFAULT_ADMIN_LASTNAME || "Admin";

  const USER_EMAIL = process.env.DEFAULT_USER_EMAIL || "user@user.test";
  const USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD || "User1234";
  const USER_FIRSTNAME = process.env.DEFAULT_USER_FIRSTNAME || "User";
  const USER_LASTNAME = process.env.DEFAULT_USER_LASTNAME || "User";

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      firstname: ADMIN_FIRSTNAME,
      lastname: ADMIN_LASTNAME,
      email: ADMIN_EMAIL,
      password: hash(ADMIN_PASSWORD),
      role: "ADMIN" as Role,
    },
  });

  await prisma.user.upsert({
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

  // Clean current domain data for deterministic seeding.
  await prisma.news.deleteMany();
  await prisma.match.deleteMany();

  const matches = [
    {
      home_team: "FC Popcorn",
      away_team: "Kernel Rangers",
      is_home: true,
      datetime: atTime(addDays(now, -62), 19, 45),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.COMPLETED,
      home_score: 1,
      away_score: 0,
      description: "Succes minimaliste mais solide pour lancer la serie.",
      referee: "P. Gauthier",
      weather: "Sec, 12C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Salted FC",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, -55), 18, 30),
      venue: "Stade des Dunes",
      location: "Salt Bay",
      competition: MatchCompetition.TOURNAMENT,
      status: MatchStatus.COMPLETED,
      home_score: 2,
      away_score: 3,
      description: "Renversement tardif avec deux buts dans le dernier quart d'heure.",
      referee: "R. Leclerc",
      weather: "Humide, 10C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "Union du Champ",
      is_home: true,
      datetime: atTime(addDays(now, -47), 20, 0),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.CUP,
      status: MatchStatus.COMPLETED,
      home_score: 0,
      away_score: 1,
      description: "Elimination cruelle sur un but en fin de rencontre.",
      referee: "D. Vidal",
      weather: "Pluie fine, 8C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Pop Valley",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, -32), 17, 30),
      venue: "Parc des Vallees",
      location: "Pop Valley",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.COMPLETED,
      home_score: 1,
      away_score: 1,
      description: "Point pris a l'exterieur dans une rencontre tres fermee.",
      referee: "N. Barthe",
      weather: "Froid, 5C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "AS Caramel",
      is_home: true,
      datetime: atTime(addDays(now, -18), 20, 30),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.COMPLETED,
      home_score: 3,
      away_score: 1,
      description: "Victoire reference avec une seconde periode de haut niveau.",
      referee: "J. Martin",
      weather: "Sec, 9C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Grain United",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, -11), 18, 0),
      venue: "Stade des Moissons",
      location: "Grainville",
      competition: MatchCompetition.CUP,
      status: MatchStatus.COMPLETED,
      home_score: 2,
      away_score: 2,
      description: "Match intense, qualification obtenue aux tirs au but.",
      referee: "M. Bernard",
      weather: "Frais, couvert",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "Butter Royals",
      is_home: true,
      datetime: atTime(addDays(now, -4), 21, 0),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.FRIENDLY,
      status: MatchStatus.COMPLETED,
      home_score: 4,
      away_score: 0,
      description: "Rotation reussie, bon rythme collectif avant la reprise.",
      referee: "S. Roche",
      weather: "Clair, 6C",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "Mais Athletic",
      is_home: true,
      datetime: atTime(addDays(now, 3), 19, 30),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.SCHEDULED,
      description: "Objectif: enchaîner à domicile et sécuriser le top 3.",
      referee: "T. Perrin",
      weather: "Froid sec attendu",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Corn City FC",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, 10), 17, 0),
      venue: "Arena Centrale",
      location: "Corn City",
      competition: MatchCompetition.TOURNAMENT,
      status: MatchStatus.SCHEDULED,
      description: "Debut du tournoi regional contre un adversaire direct.",
      referee: "L. Dufour",
      weather: "Vent faible",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "SC Butter",
      is_home: true,
      datetime: atTime(addDays(now, 17), 20, 45),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.SCHEDULED,
      description: "Affiche importante pour rester au contact du podium.",
      referee: "A. Morel",
      weather: "A confirmer",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Golden Corn FC",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, 24), 18, 15),
      venue: "Stade des Minotiers",
      location: "Golden Town",
      competition: MatchCompetition.LEAGUE,
      status: MatchStatus.SCHEDULED,
      description: "Deplacement cle face a un concurrent direct du haut de tableau.",
      referee: "B. Samson",
      weather: "A confirmer",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "FC Popcorn",
      away_team: "Toast Sporting",
      is_home: true,
      datetime: atTime(addDays(now, 31), 20, 0),
      venue: "Stade du Mais",
      location: "Popcorn City",
      competition: MatchCompetition.FRIENDLY,
      status: MatchStatus.SCHEDULED,
      description: "Match de preparation pour donner du temps de jeu au groupe.",
      referee: "C. Delmas",
      weather: "A confirmer",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
    {
      home_team: "Racing Mais",
      away_team: "FC Popcorn",
      is_home: false,
      datetime: atTime(addDays(now, 39), 21, 0),
      venue: "Stade du Rail",
      location: "Maisbourg",
      competition: MatchCompetition.CUP,
      status: MatchStatus.SCHEDULED,
      description: "Huitieme de finale, intensite maximale attendue.",
      referee: "F. Rolland",
      weather: "A confirmer",
      author_id: admin.id,
      updated_by_id: admin.id,
    },
  ];

  await prisma.match.createMany({ data: matches });

  const news = [
    {
      title: "Retour sur le debut de saison: cap maintenu",
      excerpt: "Le staff revient sur les enseignements des premiers blocs de matchs.",
      content:
        "Malgre un calendrier dense, le groupe a garde de la regularite dans l'effort. Le coach insiste sur la progression collective et la capacite a rester solide dans les temps faibles.",
      category: "OTHER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -60), 10),
      updated_at: addHours(addDays(now, -60), 12),
    },
    {
      title: "Mercato estival: deux profils observes",
      excerpt: "La cellule recrutement cible un lateral et un attaquant mobile.",
      content:
        "Le club suit plusieurs profils compatibles avec le projet de jeu. A ce stade, les discussions restent exploratoires et aucune signature n'est finalisee.",
      category: "TRANSFER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -46), 16),
      updated_at: addHours(addDays(now, -46), 18),
    },
    {
      title: "Victoire importante a l'exterieur",
      excerpt: "Trois points pris dans un contexte difficile loin de nos bases.",
      content:
        "L'equipe a su faire le dos rond en premiere periode avant d'accelerer apres la pause. L'etat d'esprit affiche valide le travail des dernieres semaines.",
      category: "MATCH" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -33), 21),
      updated_at: addHours(addDays(now, -33), 22),
    },
    {
      title: "FC Popcorn confirme sa bonne dynamique",
      excerpt: "Troisieme resultat positif de suite pour l'equipe premiere.",
      content:
        "Le groupe continue de monter en puissance. Le staff souligne la qualite des intentions de jeu, la discipline tactique et l'engagement collectif sur les deux derniers matchs.",
      category: "MATCH" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -10), 9),
      updated_at: addHours(addDays(now, -10), 11),
    },
    {
      title: "Qualification en coupe apres un match a suspense",
      excerpt: "Le FC Popcorn passe au tour suivant au terme d'un duel accroche.",
      content:
        "Menes a la pause, les joueurs ont reagi avec caractere. L'equipe obtient une qualification meritee grace a une seconde mi-temps plus agressive dans le pressing.",
      category: "MATCH" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -8), 14),
      updated_at: addHours(addDays(now, -8), 16),
    },
    {
      title: "Point effectif avant la prochaine journee",
      excerpt: "Le groupe recupere plusieurs joueurs, un seul absent de longue duree.",
      content:
        "Le preparateur physique confirme le retour progressif de plusieurs titulaires. Le staff va adapter les charges sur les prochains jours pour arriver frais au match de championnat.",
      category: "OTHER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -5), 10),
      updated_at: addHours(addDays(now, -5), 12),
    },
    {
      title: "Mercato: un milieu polyvalent suivi par le club",
      excerpt: "La cellule recrutement explore une piste pour densifier l'entrejeu.",
      content:
        "Sans urgence, le club anticipe la suite de saison et observe un profil capable d'evoluer sur plusieurs postes au milieu. Aucune offre officielle n'est encore formulee.",
      category: "TRANSFER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -3), 15),
      updated_at: addHours(addDays(now, -3), 18),
    },
    {
      title: "Programme de la semaine: focus sur l'intensite",
      excerpt: "Trois seances cles avant la reception de Mais Athletic.",
      content:
        "La semaine est orientee sur les transitions et les coups de pied arretes. Le staff veut maintenir la maitrise avec ballon et gagner en tranchant dans la surface adverse.",
      category: "OTHER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, -1), 8),
      updated_at: addHours(addDays(now, -1), 9),
    },
    {
      title: "Prochain rendez-vous au Stade du Mais",
      excerpt: "Le club compte sur le public pour pousser l'equipe dimanche soir.",
      content:
        "La reception de Mais Athletic s'annonce disputee. Le FC Popcorn appelle ses supporters a venir nombreux pour accompagner l'equipe dans une rencontre importante du championnat.",
      category: "MATCH" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(now, -2),
      updated_at: addHours(now, -1),
    },
    {
      title: "Ouverture de la billetterie pour le mois prochain",
      excerpt: "Les places pour les deux prochains matchs a domicile sont disponibles.",
      content:
        "Le club recommande de reserver rapidement, la demande est forte sur les affiches a venir. Des tarifs preferentiels sont proposes pour les groupes et familles.",
      category: "OTHER" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, 2), 9),
      updated_at: addHours(addDays(now, 2), 10),
    },
    {
      title: "Presentation de l'adversaire: Golden Corn FC",
      excerpt: "Analyse tactique avant un deplacement important en championnat.",
      content:
        "Le prochain adversaire presse haut et attaque vite dans les couloirs. Le staff prepare plusieurs ajustements pour securiser la relance et exploiter les espaces en transition.",
      category: "MATCH" as const,
      author_id: admin.id,
      updated_by_id: admin.id,
      created_at: addHours(addDays(now, 5), 14),
      updated_at: addHours(addDays(now, 5), 16),
    },
  ];

  await prisma.news.createMany({ data: news });

  const [newsCount, matchCount, userCount] = await Promise.all([
    prisma.news.count(),
    prisma.match.count(),
    prisma.user.count(),
  ]);

  console.log("Seed complete:", {
    users: userCount,
    matches: matchCount,
    news: newsCount,
    adminEmail: admin.email,
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
