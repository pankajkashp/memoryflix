/**
 * Prisma seed script — seeds the Netflix StoryTemplate.
 *
 * Run with: npx prisma db seed
 * (configured in package.json under "prisma.seed")
 */
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // Upsert so re-running the seed is safe.
  const netflix = await prisma.storyTemplate.upsert({
    where: { slug: "netflix" },
    update: {},
    create: {
      name: "Netflix",
      slug: "netflix",
      description:
        "A cinematic story format inspired by Netflix — perfect for love stories, anniversaries, and milestone moments.",
      isActive: true,
    },
  });

  console.log(`✓ StoryTemplate seeded: ${netflix.name} (${netflix.id})`);
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
