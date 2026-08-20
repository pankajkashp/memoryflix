import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete old birthday-magic template if it exists
  const oldTemplate = await prisma.template.findUnique({
    where: { slug: "birthday-magic" },
  });
  if (oldTemplate) {
    console.log("Deleting old 'birthday-magic' template...");
    await prisma.template.delete({ where: { slug: "birthday-magic" } });
  }

  // Delete old birthday-cinematic template if it exists (re-seed)
  const existingCinematic = await prisma.template.findUnique({
    where: { slug: "birthday-cinematic" },
  });
  if (existingCinematic) {
    console.log("Deleting existing 'birthday-cinematic' template for re-seeding...");
    await prisma.template.delete({ where: { slug: "birthday-cinematic" } });
  }

  console.log("Seeding 'Birthday Cinematic' template...");

  await prisma.template.create({
    data: {
      name: "Birthday Magic",
      slug: "birthday-cinematic",
      category: "Birthday",
      price: 4900,
      description:
        "A cinematic, scene-by-scene interactive birthday gift. Click through 9 beautiful scenes — envelope, question, gift reveal, memories, wish, and a final heartfelt message.",
      previewUrl: "/2.png",
      isActive: true,
      pages: {
        create: [
          {
            position: 1,
            componentKey: "BIRTHDAY_CINEMATIC_STORY",
            fixedConfig: {},
            editableSchema: {
              title: "Birthday Story Content",
              description:
                "All the content for your cinematic birthday experience. Fill in the details and upload photos.",
              fields: [
                // Opening scene
                {
                  name: "recipientName",
                  label: "Birthday Person's Name",
                  type: "text",
                  required: true,
                  default: "Alex",
                  placeholder: "e.g. Alex",
                },
                {
                  name: "senderName",
                  label: "Your Name (sender)",
                  type: "text",
                  required: true,
                  default: "Sam",
                  placeholder: "e.g. Sam",
                },
                // Question scene
                {
                  name: "questionText",
                  label: "Opening Question (YES / NO)",
                  type: "text",
                  required: true,
                  default: "Wanna see what I made?",
                  placeholder: "e.g. Wanna see what I made?",
                },
                // Memory photos
                {
                  name: "photo1",
                  label: "Memory Photo 1 (main reveal)",
                  type: "image",
                  required: true,
                  default: "/1.png",
                },
                {
                  name: "caption1",
                  label: "Caption for Photo 1",
                  type: "text",
                  required: true,
                  default: "That unforgettable day",
                },
                {
                  name: "photo2",
                  label: "Memory Photo 2 (collage)",
                  type: "image",
                  required: false,
                  default: "/2.png",
                },
                {
                  name: "caption2",
                  label: "Caption for Photo 2",
                  type: "text",
                  required: false,
                  default: "Adventures together",
                },
                {
                  name: "photo3",
                  label: "Memory Photo 3 (collage)",
                  type: "image",
                  required: false,
                  default: "/3.png",
                },
                {
                  name: "caption3",
                  label: "Caption for Photo 3",
                  type: "text",
                  required: false,
                  default: "Best moments",
                },
                {
                  name: "photo4",
                  label: "Memory Photo 4 (collage)",
                  type: "image",
                  required: false,
                  default: "/1.png",
                },
                {
                  name: "caption4",
                  label: "Caption for Photo 4",
                  type: "text",
                  required: false,
                  default: "Always laughing",
                },
                // Wish scene
                {
                  name: "wishMessage",
                  label: "Wish Scene Text",
                  type: "text",
                  required: true,
                  default: "Make a wish...",
                },
                // Letter / collage scene
                {
                  name: "collageNote",
                  label: "Handwritten Note (Letter Scene)",
                  type: "textarea",
                  required: true,
                  default:
                    "Every memory with you is one I'll treasure forever. Here's to another year of adventures!",
                },
                // Final message
                {
                  name: "finalMessage",
                  label: "Final Heartfelt Message",
                  type: "textarea",
                  required: true,
                  default:
                    "May all the good things you've been waiting for finally find you this year.\n\nHappy Birthday. 🎂",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 'Birthday Cinematic' template successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
