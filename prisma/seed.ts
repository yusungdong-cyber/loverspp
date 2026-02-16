import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@wpautoprofit.ai" },
    update: {},
    create: {
      email: "demo@wpautoprofit.ai",
      name: "Demo User",
      passwordHash,
    },
  });

  const session = await prisma.trendSession.create({
    data: {
      userId: user.id,
      topics: {
        create: [
          {
            title: "AI-Powered Home Automation in 2026",
            keyword: "ai home automation 2026",
            searchVolume: 74000,
            competitionScore: 35,
            monetizationScore: 88,
            trendScore: 92,
            category: "Technology",
          },
          {
            title: "Best Budget Electric Vehicles Under $30K",
            keyword: "budget electric vehicles 2026",
            searchVolume: 110000,
            competitionScore: 58,
            monetizationScore: 95,
            trendScore: 87,
            category: "Automotive",
          },
          {
            title: "Remote Work Productivity Tools Guide",
            keyword: "remote work productivity tools",
            searchVolume: 62000,
            competitionScore: 42,
            monetizationScore: 78,
            trendScore: 81,
            category: "Business",
          },
          {
            title: "Beginner's Guide to Passive Income Streams",
            keyword: "passive income streams beginners",
            searchVolume: 88000,
            competitionScore: 65,
            monetizationScore: 92,
            trendScore: 76,
            category: "Finance",
          },
          {
            title: "Plant-Based Protein Supplements Review",
            keyword: "plant based protein supplements",
            searchVolume: 49000,
            competitionScore: 30,
            monetizationScore: 85,
            trendScore: 74,
            category: "Health",
          },
        ],
      },
    },
  });

  console.log("Seeded demo user:", user.email);
  console.log("Seeded trend session:", session.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
