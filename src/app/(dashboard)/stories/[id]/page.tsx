import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StoryWizard from "@/components/story/StoryWizard";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { title: "Story — MemoryFlix" };

  const story = await prisma.story.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });
  return { title: story ? `${story.title} — MemoryFlix` : "Story — MemoryFlix" };
}

export default async function StoryEditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const story = await prisma.story.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      template: true,
      media: { orderBy: { position: "asc" } }
    },
  });

  if (!story) notFound();

  return (
    <div className="min-h-[calc(100vh-80px)] w-full">
      <StoryWizard story={story} />
    </div>
  );
}
