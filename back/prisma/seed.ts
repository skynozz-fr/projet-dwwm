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

  console.log("Seed complete:", {
    admin: { id: admin.id, email: admin.email, role: admin.role },
    user: { id: user.id, email: user.email, role: user.role },
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
