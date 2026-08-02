import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicStoryPlayerClient from "./PublicStoryPlayerClient";

interface PublicStoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicStoryPageProps) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug },
    include: { template: true },
  });

  if (!story || story.paymentStatus !== "PAID") {
    return { title: "Story Not Found — MemoryFlix" };
  }

  return {
    title: `A Special Story for You — MemoryFlix`,
    description: `An interactive, animated tribute created with MemoryFlix.`,
    openGraph: {
      title: `A Special Story for You — MemoryFlix`,
      description: `Open to experience an interactive story tribute.`,
      images: [story.template.previewUrl || "/1.png"],
    },
  };
}

export default async function PublicStoryPage({
  params,
}: PublicStoryPageProps) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      template: {
        include: {
          pages: {
            orderBy: { position: "asc" },
          },
        },
      },
      pageInstances: true,
    },
  });

  // Verify story is published and paid
  if (!story || story.paymentStatus !== "PAID" || !story.template) {
    notFound();
  }

  const blueprintMap = new Map(
    story.template.pages.map((bp) => [bp.id, bp])
  );

  const formattedPages = story.pageInstances
    .map((inst) => {
      const bp = blueprintMap.get(inst.templatePageBlueprintId);
      if (!bp) return null;

      return {
        id: inst.id,
        position: bp.position,
        componentKey: bp.componentKey,
        fixedConfig: bp.fixedConfig,
        fieldValues: (inst.fieldValues as Record<string, any>) || {},
        title: (bp.editableSchema as any)?.title || bp.componentKey,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.position - b!.position);

  return (
    <PublicStoryPlayerClient
      story={story as any}
      pages={formattedPages as any}
    />
  );
}
