import { prisma } from "@/lib/prisma";
import TemplatesGalleryClient from "./TemplatesGalleryClient";

export const metadata = {
  title: "Story Templates — MemoryFlix",
  description:
    "Choose a handcrafted interactive story template to celebrate your friendships, love stories, and birthdays.",
};

export const revalidate = 60; // ISR cache for 1 minute

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      pages: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          position: true,
          componentKey: true,
        },
      },
    },
  });

  return <TemplatesGalleryClient templates={templates} />;
}

