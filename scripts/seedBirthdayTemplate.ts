import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  let template = await prisma.template.findUnique({
    where: { slug: "birthday-magic" },
  });

  if (template) {
    console.log("Deleting existing 'birthday-magic' template for re-seeding...");
    await prisma.template.delete({
      where: { slug: "birthday-magic" },
    });
  }

  console.log("Seeding 'Birthday Magic' template...");

  await prisma.template.create({
    data: {
      name: "Birthday Magic",
      slug: "birthday-magic",
      category: "Birthday",
      price: 4900,
      description: "An interactive digital birthday gift with surprise reveals and memory scrolls.",
      previewUrl: "/2.png",
      isActive: true,
      pages: {
        create: [
          {
            position: 1,
            componentKey: "BIRTHDAY_OPENING",
            fixedConfig: {},
            editableSchema: {
              title: "The Gift Box",
              description: "The interactive opening where they unwrap your digital gift.",
              fields: [
                { name: "recipientName", label: "Birthday Person's Name", type: "text", required: true, default: "Alex" },
                { name: "hintText", label: "Teaser/Hint Text", type: "text", required: true, default: "I got you something special..." },
              ],
            },
          },
          {
            position: 2,
            componentKey: "BIRTHDAY_REVEAL",
            fixedConfig: {},
            editableSchema: {
              title: "The Big Reveal",
              description: "The moment the gift opens.",
              fields: [
                { name: "heading", label: "Main Heading", type: "text", required: true, default: "Happy Birthday!" },
                { name: "subheading", label: "Subheading Message", type: "textarea", required: true, default: "Another trip around the sun, and you're shining brighter than ever." },
                { name: "photoUrl", label: "Celebration Photo", type: "image", required: true, default: "/1.png" },
              ],
            },
          },
          {
            position: 3,
            componentKey: "BIRTHDAY_MEMORIES",
            fixedConfig: {},
            editableSchema: {
              title: "Birthday Memories",
              description: "A fun, scattered gallery of your best moments this past year.",
              fields: [
                { name: "title", label: "Section Title", type: "text", required: true, default: "This Year's Highlights" },
                { name: "photo1", label: "Memory 1 Photo", type: "image", required: true, default: "/2.png" },
                { name: "caption1", label: "Memory 1 Caption", type: "text", required: true, default: "That crazy night out" },
                { name: "photo2", label: "Memory 2 Photo", type: "image", required: true, default: "/3.png" },
                { name: "caption2", label: "Memory 2 Caption", type: "text", required: true, default: "Road trip adventures" },
                { name: "photo3", label: "Memory 3 Photo", type: "image", required: false, default: "/1.png" },
                { name: "caption3", label: "Memory 3 Caption", type: "text", required: false, default: "Just chilling" },
              ],
            },
          },
          {
            position: 4,
            componentKey: "BIRTHDAY_SURPRISE_ENDING",
            fixedConfig: {},
            editableSchema: {
              title: "Surprise Ending & Note",
              description: "The final heartfelt birthday wish.",
              fields: [
                { name: "message", label: "Your Birthday Message", type: "textarea", required: true, default: "Wishing you a year filled with as much joy as you bring to everyone around you. Let's make more memories!" },
                { name: "signOff", label: "Sign-off Name", type: "text", required: true, default: "With love, Sam" },
                { name: "photoUrl", label: "Final Sweet Photo", type: "image", required: true, default: "/3.png" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 'Birthday Magic' template successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
