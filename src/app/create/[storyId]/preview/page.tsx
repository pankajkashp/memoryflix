import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StoryPreviewClient from "./StoryPreviewClient";

interface StoryPreviewPageProps {
  params: Promise<{ storyId: string }>;
}

export const metadata = {
  title: "Preview Your Story — MemoryFlix",
};

export default async function StoryPreviewPage({
  params,
}: StoryPreviewPageProps) {
  const { storyId } = await params;

  const story = await prisma.story.findUnique({
    where: { id: storyId },
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

  if (!story || !story.template) {
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
    <StoryPreviewClient
      story={story as any}
      pages={formattedPages as any}
    />
  );
}
