import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createStoryFromTemplate } from "../src/app/actions/templateStory";

const prisma = new PrismaClient();

async function run() {
  console.log("=========================================");
  console.log("🚀 PHASE 4 MULTI-TEMPLATE VERIFICATION");
  console.log("=========================================\n");

  // Step 1: Verify all 3 templates in DB
  const templates = await prisma.template.findMany({
    include: {
      pages: { orderBy: { position: "asc" } },
    },
    orderBy: { price: "asc" },
  });

  console.log(`Found ${templates.length} templates in database:`);
  for (const t of templates) {
    console.log(`  • ${t.name} (slug: "${t.slug}", category: "${t.category}", price: ₹${t.price / 100}, blueprints: ${t.pages.length})`);
    const keys = t.pages.map((p) => p.componentKey).join(" → ");
    console.log(`    Component sequence: ${keys}`);
  }

  if (templates.length < 3) {
    throw new Error(`Expected at least 3 templates, found ${templates.length}`);
  }

  // Step 2: Create Story for Romantic Anniversary
  console.log("\nCreating test story from 'romantic-anniversary'...");
  const annivResult = await createStoryFromTemplate("romantic-anniversary");
  if (!annivResult.success || !annivResult.storyId) {
    throw new Error(`Failed to create anniversary story: ${annivResult.error}`);
  }
  console.log(`✓ Created Anniversary Story: ${annivResult.storyId}`);

  // Step 3: Create Story for Neon Birthday Blast
  console.log("\nCreating test story from 'birthday-blast'...");
  const bdayResult = await createStoryFromTemplate("birthday-blast");
  if (!bdayResult.success || !bdayResult.storyId) {
    throw new Error(`Failed to create birthday story: ${bdayResult.error}`);
  }
  console.log(`✓ Created Birthday Story: ${bdayResult.storyId}`);

  // Step 4: Verify HTTP responses from the local dev server
  const urlsToTest = [
    { label: "Templates Gallery", url: "http://localhost:3000/templates", expectedTerms: ["Friendship Day", "Romantic Anniversary", "Neon Birthday Blast"] },
    { label: "Anniversary Detail", url: "http://localhost:3000/templates/romantic-anniversary", expectedTerms: ["Romantic Anniversary", "Create Your Story", "Anniversary Alert"] },
    { label: "Birthday Detail", url: "http://localhost:3000/templates/birthday-blast", expectedTerms: ["Neon Birthday Blast", "Create Your Story", "BIRTHDAY PROTOCOL"] },
    { label: "Anniversary Wizard", url: `http://localhost:3000/create/${annivResult.storyId}`, expectedTerms: ["Romantic Anniversary", "Anniversary Alert", "Soulmate"] },
    { label: "Birthday Wizard", url: `http://localhost:3000/create/${bdayResult.storyId}`, expectedTerms: ["Neon Birthday Blast", "BIRTHDAY PROTOCOL", "Iconic"] },
  ];

  console.log("\nVerifying HTTP rendering across routes...");
  for (const item of urlsToTest) {
    try {
      const res = await fetch(item.url);
      const text = await res.text();
      if (res.status !== 200) {
        console.error(`❌ [${res.status}] ${item.label} (${item.url})`);
        continue;
      }

      const missing = item.expectedTerms.filter((term) => !text.includes(term));
      if (missing.length > 0) {
        console.error(`⚠️ [200 OK] ${item.label} missing expected strings:`, missing);
      } else {
        console.log(`✓ [200 OK] ${item.label} (${item.url}) rendered correctly!`);
      }
    } catch (e: any) {
      console.error(`❌ Connection error on ${item.label} (${item.url}):`, e.message);
    }
  }

  console.log("\n🎉 Phase 4 verification complete!");
}

run()
  .catch((e) => {
    console.error("FATAL:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
