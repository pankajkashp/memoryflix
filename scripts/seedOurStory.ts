const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Check if template exists
  let ourStoryTemplate = await prisma.template.findUnique({
    where: { slug: "our-story" },
  });

  if (ourStoryTemplate) {
    console.log("Deleting existing 'our-story' template for re-seeding...");
    await prisma.template.delete({
      where: { slug: "our-story" },
    });
  }

  console.log("Seeding 'Our Story — Cinematic Love Journey' template...");

  ourStoryTemplate = await prisma.template.create({
    data: {
      name: "Our Story",
      slug: "our-story",
      category: "Anniversary",
      price: 9900,
      description:
        "A premium interactive cinematic love story experience. Perfect for anniversaries or special milestones.",
      previewUrl: "/our-story-preview.jpg",
      isActive: true,
      pages: {
        create: [
          {
            position: 1,
            componentKey: "OUR_STORY_HERO",
            fixedConfig: {},
            editableSchema: {
              title: "Cinematic Opening",
              description: "The visually powerful first screen of your story.",
              fields: [
                { name: "coupleNames", label: "Couple Names", type: "text", required: true, default: "Emma & James" },
                { name: "subtitle", label: "Subtitle", type: "text", required: false, default: "A Cinematic Love Story" },
                { name: "date", label: "Date / Established", type: "text", required: false, default: "Est. 2020" },
                { name: "location", label: "Location", type: "text", required: false, default: "New York City" },
                { name: "photoUrl", label: "Hero Background Image", type: "image", required: true, default: "/1.png" },
              ],
            },
          },
          {
            position: 2,
            componentKey: "OUR_STORY_HOW_IT_STARTED",
            fixedConfig: {},
            editableSchema: {
              title: "How It Started",
              description: "The beginning of your journey.",
              fields: [
                { name: "title", label: "Section Title", type: "text", required: true, default: "How It Started" },
                { name: "description", label: "Story Text", type: "textarea", required: true, default: "It was just an ordinary day until we met. From that moment, everything changed." },
                { name: "photoUrl", label: "First Important Memory", type: "image", required: true, default: "/2.png" },
              ],
            },
          },
          {
            position: 3,
            componentKey: "OUR_STORY_MEMORIES",
            fixedConfig: {},
            editableSchema: {
              title: "Favorite Memories",
              description: "An elegant asymmetric layout of your favorite moments.",
              fields: [
                { name: "title", label: "Section Title", type: "text", required: true, default: "Moments We Cherish" },
                { name: "primaryPhoto", label: "Primary Photo", type: "image", required: true, default: "/3.png" },
                { name: "primaryTitle", label: "Primary Title", type: "text", required: true, default: "Our First Trip" },
                { name: "primaryDate", label: "Primary Date", type: "text", required: false, default: "Summer 2021" },
                { name: "primaryNote", label: "Primary Note", type: "textarea", required: false, default: "We drove for hours and talked about everything." },
                { name: "secondaryPhoto1", label: "Secondary Photo 1", type: "image", required: true, default: "/1.png" },
                { name: "secondaryTitle1", label: "Secondary Title 1", type: "text", required: false, default: "City Lights" },
                { name: "secondaryPhoto2", label: "Secondary Photo 2", type: "image", required: true, default: "/2.png" },
                { name: "secondaryTitle2", label: "Secondary Title 2", type: "text", required: false, default: "Quiet Evenings" },
              ],
            },
          },
          {
            position: 4,
            componentKey: "OUR_STORY_TIMELINE",
            fixedConfig: {},
            editableSchema: {
              title: "Relationship Timeline",
              description: "A vertical cinematic timeline of your milestones.",
              fields: [
                { name: "event1Year", label: "Event 1 Date/Year", type: "text", required: true, default: "2020" },
                { name: "event1Text", label: "Event 1 Description", type: "text", required: true, default: "The First Meet" },
                { name: "event2Year", label: "Event 2 Date/Year", type: "text", required: true, default: "2021" },
                { name: "event2Text", label: "Event 2 Description", type: "text", required: true, default: "First Trip Together" },
                { name: "event3Year", label: "Event 3 Date/Year", type: "text", required: false, default: "2022" },
                { name: "event3Text", label: "Event 3 Description", type: "text", required: false, default: "Moving In" },
                { name: "event4Year", label: "Event 4 Date/Year", type: "text", required: false, default: "2023" },
                { name: "event4Text", label: "Event 4 Description", type: "text", required: false, default: "Our New Home" },
              ],
            },
          },
          {
            position: 5,
            componentKey: "OUR_STORY_LOVE_NOTE",
            fixedConfig: {},
            editableSchema: {
              title: "Personal Love Note",
              description: "An elegant paper-inspired personal message.",
              fields: [
                { name: "noteHeading", label: "Note Heading", type: "textarea", required: true, default: "Some memories fade.\nSome become part of who we are." },
                { name: "noteBody", label: "Personal Note", type: "textarea", required: true, default: "Every day with you is a gift. Thank you for being my constant, my adventure, and my home." },
              ],
            },
          },
          {
            position: 6,
            componentKey: "OUR_STORY_FULL_SCREEN_MEMORY",
            fixedConfig: {},
            editableSchema: {
              title: "Full-Screen Memory",
              description: "A breathtaking full-screen memory with cinematic parallax.",
              fields: [
                { name: "caption", label: "Memory Caption", type: "text", required: true, default: "Just you and me against the world." },
                { name: "photoUrl", label: "Dominant Background Image", type: "image", required: true, default: "/3.png" },
              ],
            },
          },
          {
            position: 7,
            componentKey: "OUR_STORY_FINAL",
            fixedConfig: {},
            editableSchema: {
              title: "Final Surprise",
              description: "The emotional conclusion to your story.",
              fields: [
                { name: "preMessage", label: "Pre-Message", type: "text", required: true, default: "After all these moments..." },
                { name: "finalMessage", label: "Final Message", type: "textarea", required: true, default: "Here's to every memory we've made, and every one still waiting for us." },
                { name: "photoUrl", label: "Final Photo", type: "image", required: true, default: "/2.png" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 'Our Story' template successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
