import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StoryWizard from "@/components/story/StoryWizard";
import { cache } from "react";

const getStory = cache(async (id: string, userId: string) => {
  return await prisma.story.findFirst({
    where: { id, userId },
    include: {
      template: true,
      media: { orderBy: { position: "asc" } },
      chapters: { orderBy: { position: "asc" } },
    },
  });
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { title: "Story — MemoryFlix" };

  const story = await getStory(id, session.user.id);
  return { title: story ? `${story.title} — MemoryFlix` : "Story — MemoryFlix" };
}

export default async function StoryEditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const story = await getStory(id, session!.user.id);

  if (!story) notFound();

  const templates = await prisma.storyTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-[calc(100vh-80px)] w-full">
      <StoryWizard story={story} templates={templates} />
    </div>
  );
}
