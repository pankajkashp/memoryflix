import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  let template = await prisma.template.findUnique({
    where: { slug: "travel-journey" },
  });

  if (template) {
    console.log("Deleting existing 'travel-journey' template for re-seeding...");
    await prisma.template.delete({
      where: { slug: "travel-journey" },
    });
  }

  console.log("Seeding 'Travel Journey' template...");

  await prisma.template.create({
    data: {
      name: "Travel Journey",
      slug: "travel-journey",
      category: "Travel",
      price: 6900,
      description: "A beautiful passport to your favorite memories. Features interactive maps and postcard layouts.",
      previewUrl: "/3.png",
      isActive: true,
      pages: {
        create: [
          {
            position: 1,
            componentKey: "TRAVEL_OPENING",
            fixedConfig: {},
            editableSchema: {
              title: "Journey Opening",
              description: "Set the destination and title for your adventure.",
              fields: [
                { name: "tripName", label: "Trip Name", type: "text", required: true, default: "Euro Summer 2024" },
                { name: "travelers", label: "Who Went?", type: "text", required: true, default: "Sarah & Mark" },
                { name: "dates", label: "Travel Dates", type: "text", required: false, default: "June 14 - July 2" },
                { name: "photoUrl", label: "Cover Photo", type: "image", required: true, default: "/3.png" },
              ],
            },
          },
          {
            position: 2,
            componentKey: "TRAVEL_DESTINATION",
            fixedConfig: {},
            editableSchema: {
              title: "The Destination",
              description: "Highlight where you went and why it was special.",
              fields: [
                { name: "locationName", label: "Location Name", type: "text", required: true, default: "Amalfi Coast, Italy" },
                { name: "description", label: "Short Description", type: "textarea", required: true, default: "A dream realized. Sun, pasta, and the most beautiful coastline in the world." },
                { name: "photoUrl", label: "Destination Photo", type: "image", required: true, default: "/1.png" },
              ],
            },
          },
          {
            position: 3,
            componentKey: "TRAVEL_MEMORIES",
            fixedConfig: {},
            editableSchema: {
              title: "Travel Gallery",
              description: "A grid of your best travel photos.",
              fields: [
                { name: "photo1", label: "Photo 1", type: "image", required: true, default: "/2.png" },
                { name: "photo2", label: "Photo 2", type: "image", required: true, default: "/3.png" },
                { name: "photo3", label: "Photo 3", type: "image", required: true, default: "/1.png" },
                { name: "photo4", label: "Photo 4 (Optional)", type: "image", required: false, default: "/2.png" },
                { name: "caption", label: "Gallery Caption", type: "text", required: false, default: "Views we'll never forget" },
              ],
            },
          },
          {
            position: 4,
            componentKey: "TRAVEL_TIMELINE",
            fixedConfig: {},
            editableSchema: {
              title: "Itinerary / Highlights",
              description: "A winding path showing your journey highlights.",
              fields: [
                { name: "day1Title", label: "Stop 1 Name", type: "text", required: true, default: "Arrival in Rome" },
                { name: "day1Desc", label: "Stop 1 Detail", type: "text", required: false, default: "Colosseum & Pizza" },
                { name: "day2Title", label: "Stop 2 Name", type: "text", required: true, default: "Train to Naples" },
                { name: "day2Desc", label: "Stop 2 Detail", type: "text", required: false, default: "The best espresso" },
                { name: "day3Title", label: "Stop 3 Name", type: "text", required: true, default: "Positano Sunsets" },
                { name: "day3Desc", label: "Stop 3 Detail", type: "text", required: false, default: "Boats and limoncello" },
              ],
            },
          },
          {
            position: 5,
            componentKey: "TRAVEL_POSTCARD_ENDING",
            fixedConfig: {},
            editableSchema: {
              title: "Postcard Ending",
              description: "A digital postcard summing up the trip.",
              fields: [
                { name: "stampText", label: "Stamp Location", type: "text", required: false, default: "Roma, IT" },
                { name: "message", label: "Postcard Message", type: "textarea", required: true, default: "Until the next adventure. This trip was everything we hoped for and more. Let's keep exploring the world together." },
                { name: "signOff", label: "Sign-off", type: "text", required: true, default: "XOXO, Us" },
                { name: "photoUrl", label: "Postcard Front Photo", type: "image", required: true, default: "/3.png" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded 'Travel Journey' template successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
