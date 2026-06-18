import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  try {
    const invalidDate = new Date("");
    await prisma.story.update({
      where: { id: "test-id" },
      data: {
        eventDate: invalidDate
      }
    });
  } catch (e) {
    console.error(e);
  }
}
main();
