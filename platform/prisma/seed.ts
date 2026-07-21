import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PERMISSION_CATALOG } from "./seed-permissions";

const prisma = new PrismaClient();

const PLANS = [
  {
    slug: "trial",
    name: "Trial",
    priceMonthly: 0,
    maxBranches: 2,
    maxEmployees: 10,
    features: ["Up to 2 branches", "Up to 10 employees", "Core modules"],
  },
  {
    slug: "basic",
    name: "Basic",
    priceMonthly: 9900,
    maxBranches: 10,
    maxEmployees: 100,
    features: ["Up to 10 branches", "Up to 100 employees", "Performance metrics", "Documents"],
  },
  {
    slug: "pro",
    name: "Pro",
    priceMonthly: 29900,
    maxBranches: 1000,
    maxEmployees: 10000,
    features: ["Unlimited branches", "Advanced roles", "Priority support", "All modules"],
  },
];

async function main() {
  // 1) Permissions
  for (const p of PERMISSION_CATALOG) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { group: p.group, description: p.description },
      create: p,
    });
  }
  console.log(`Seeded ${PERMISSION_CATALOG.length} permissions.`);

  // 2) Subscription plans
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log(`Seeded ${PLANS.length} plans.`);

  // 3) A default platform admin (change credentials after first login).
  const adminEmail = "admin@branchos.app";
  const adminPass = "ChangeMe!2026";
  await prisma.platformAdmin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Platform Admin",
      passwordHash: await bcrypt.hash(adminPass, 10),
    },
  });
  console.log(`Platform admin ready: ${adminEmail} / ${adminPass}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
