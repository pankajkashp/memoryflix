import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TemplateStoryWizard from "@/components/story/TemplateStoryWizard";

interface CreateStoryPageProps {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{ page?: string; token?: string }>;
}

export const metadata = {
  title: "Customize Your Story — MemoryFlix",
};

export default async function CreateStoryPage({
  params,
  searchParams,
}: CreateStoryPageProps) {
  const { storyId } = await params;
  const { page: pageQuery } = await searchParams;

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
      pageInstances: {
        include: {
          media: true,
        },
      },
    },
  });

  if (!story || !story.template) {
    notFound();
  }

  // Ensure all blueprints have a corresponding StoryPageInstance
  let instances = story.pageInstances;
  if (instances.length === 0) {
    for (const bp of story.template.pages) {
      const schema = bp.editableSchema as any;
      const initialFields: Record<string, any> = {};

      if (schema && Array.isArray(schema.fields)) {
        for (const field of schema.fields) {
          if (field.name) {
            initialFields[field.name] =
              field.default !== undefined ? field.default : "";
          }
        }
      }

      await prisma.storyPageInstance.create({
        data: {
          storyId: story.id,
          templatePageBlueprintId: bp.id,
          fieldValues: initialFields,
        },
      });
    }

    // Refetch instances
    instances = await prisma.storyPageInstance.findMany({
      where: { storyId: story.id },
      include: { media: true },
    });
  }

  // Map blueprint to each instance and order by blueprint.position
  const blueprintMap = new Map(
    story.template.pages.map((bp) => [bp.id, bp])
  );

  const enrichedInstances = instances
    .map((inst) => ({
      ...inst,
      fieldValues: (inst.fieldValues as Record<string, any>) || {},
      blueprint: blueprintMap.get(inst.templatePageBlueprintId)!,
    }))
    .filter((inst) => inst.blueprint !== undefined)
    .sort((a, b) => a.blueprint.position - b.blueprint.position);

  // Resume at requested page index, or first page
  const initialPageIndex = pageQuery ? Math.max(0, parseInt(pageQuery, 10) - 1) : 0;

  return (
    <TemplateStoryWizard
      story={story as any}
      pageInstances={enrichedInstances as any}
      initialPageIndex={initialPageIndex}
    />
  );
}
