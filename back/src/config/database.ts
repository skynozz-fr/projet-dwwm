import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Gérer la fermeture propre de la connexion
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
