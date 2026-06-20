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
  const templates = [
    {
      name: "Netflix Memories",
      slug: "netflix-memories",
      description: "A cinematic story format inspired by Netflix — perfect for love stories, anniversaries, and milestone moments.",
    },
    {
      name: "Apple Memories",
      slug: "apple-memories",
      description: "Clean, minimal glassmorphism design with smooth crossfades. Inspired by Apple Photos.",
    },
    {
      name: "Travel Journal",
      slug: "travel-journal",
      description: "A map-inspired vertical journey, connecting your favorite locations with an adventurous aesthetic.",
    },
    {
      name: "Wedding Film",
      slug: "wedding-film",
      description: "Luxury wedding design featuring elegant typography, gold accents, and slow cinematic transitions.",
    },
    {
      name: "Timeline Story",
      slug: "timeline-story",
      description: "A chronological storybook timeline, organizing memories perfectly by year and milestone.",
    }
  ];

  for (const t of templates) {
    const record = await prisma.storyTemplate.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        isActive: true,
      },
    });
    console.log(`✓ StoryTemplate seeded: ${record.name} (${record.id})`);
  }
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
