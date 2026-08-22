import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templateBlueprint = {
  position: 1,
  componentKey: "BIRTHDAY_CINEMATIC_STORY",
  fixedConfig: {},
  editableSchema: {
    title: "Cinematic Story Content",
    description: "All the content for your immersive memory story.",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text", required: true, default: "You" },
      { name: "senderName", label: "Sender Name", type: "text", required: true, default: "Someone Special" },
      { name: "questionText", label: "Question", type: "text", required: true, default: "Wanna see what I made?" },
      { name: "photo1", label: "Main Memory Photo", type: "image", required: true, default: "/1.png" },
      { name: "caption1", label: "Main Memory Caption", type: "text", required: true, default: "That unforgettable day" },
      { name: "photo2", label: "Memory Photo 2", type: "image", required: false, default: "/2.png" },
      { name: "caption2", label: "Caption 2", type: "text", required: false, default: "Adventures together" },
      { name: "photo3", label: "Memory Photo 3", type: "image", required: false, default: "/3.png" },
      { name: "caption3", label: "Caption 3", type: "text", required: false, default: "Best moments" },
      { name: "photo4", label: "Memory Photo 4", type: "image", required: false, default: "/1.png" },
      { name: "caption4", label: "Caption 4", type: "text", required: false, default: "Always laughing" },
      { name: "wishMessage", label: "Wish Message", type: "text", required: true, default: "Make a wish..." },
      { name: "collageNote", label: "Letter Note", type: "textarea", required: true, default: "Every memory with you is one I will treasure forever." },
      { name: "finalMessage", label: "Final Message", type: "textarea", required: true, default: "May all the good things you have been waiting for finally find you.\n\nWith love." },
    ],
  },
};

const templates = [
  { name: "Our Little Story", slug: "our-little-story", category: "Love", price: 4900, description: "A cinematic love story with intimate memories and a warm final reveal.", previewUrl: "/1.png" },
  { name: "A Little Surprise", slug: "a-little-surprise", category: "Celebration", price: 4900, description: "A playful surprise story with a gift reveal, memories, and heartfelt ending.", previewUrl: "/2.png" },
  { name: "The Journey", slug: "the-journey", category: "Travel", price: 5900, description: "A travel memory story built around milestones, destinations, and shared moments.", previewUrl: "/3.png" },
  { name: "Our Day", slug: "our-day", category: "Everyday", price: 4900, description: "A everyday-story template celebrating your favorite moments together.", previewUrl: "/1.png" },
  { name: "Chaos & Memories", slug: "chaos-memories", category: "Fun", price: 4900, description: "A fun, messy memory story built around laughter, spontaneity, and connection.", previewUrl: "/2.png" },
  { name: "Home", slug: "home", category: "Love", price: 4900, description: "A warm homecoming story about belonging, comfort, and togetherness.", previewUrl: "/3.png" },
  { name: "The Next Chapter", slug: "the-next-chapter", category: "Milestone", price: 5900, description: "A milestone story for a new chapter, promise, and future together.", previewUrl: "/1.png" },
  { name: "Pages", slug: "pages", category: "Story", price: 4900, description: "A visual story told through curated pages and meaningful moments.", previewUrl: "/2.png" },
  { name: "The Film", slug: "the-film", category: "Cinematic", price: 6900, description: "A cinematic, scene-led story designed for emotional reveals and memory discovery.", previewUrl: "/3.png" },
  { name: "Memory Box", slug: "memory-box", category: "Archive", price: 4900, description: "An archive-style memory story that feels like opening a keepsake box.", previewUrl: "/1.png" },
];

async function main() {
  for (const templateData of templates) {
    const template = await prisma.template.upsert({
      where: { slug: templateData.slug },
      update: {
        name: templateData.name,
        category: templateData.category,
        price: templateData.price,
        description: templateData.description,
        previewUrl: templateData.previewUrl,
        isActive: true,
      },
      create: {
        name: templateData.name,
        slug: templateData.slug,
        category: templateData.category,
        price: templateData.price,
        description: templateData.description,
        previewUrl: templateData.previewUrl,
        isActive: true,
      },
    });

    await prisma.templatePageBlueprint.deleteMany({ where: { templateId: template.id } });

    await prisma.templatePageBlueprint.create({
      data: {
        templateId: template.id,
        position: templateBlueprint.position,
        componentKey: templateBlueprint.componentKey,
        fixedConfig: templateBlueprint.fixedConfig,
        editableSchema: templateBlueprint.editableSchema,
      },
    });

    console.log(`✓ ${template.name} (${template.slug})`);
  }

  const count = await prisma.template.count();
  console.log(`Total templates: ${count}`);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
