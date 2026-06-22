"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function verifyOwnership(storyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const story = await prisma.story.findUnique({
    where: { id: storyId },
  });

  if (!story || story.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function createChapter(storyId: string, title: string, emoji: string | null = null, subtitle: string | null = null, date: string | null = null, location: string | null = null) {
  await verifyOwnership(storyId);

  // Get current max position
  const lastChapter = await prisma.chapter.findFirst({
    where: { storyId },
    orderBy: { position: "desc" },
  });
  const position = lastChapter ? lastChapter.position + 1 : 0;

  await prisma.chapter.create({
    data: {
      storyId,
      title,
      emoji,
      subtitle,
      date: date ? new Date(date) : null,
      location,
      position,
    },
  });

  revalidatePath(`/stories/${storyId}`);
}

export async function updateChapter(storyId: string, chapterId: string, title: string, emoji: string | null = null, subtitle: string | null = null, date: string | null = null, location: string | null = null) {
  await verifyOwnership(storyId);

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { 
      title, 
      emoji,
      subtitle,
      date: date ? new Date(date) : null,
      location 
    },
  });

  revalidatePath(`/stories/${storyId}`);
}

export async function deleteChapter(storyId: string, chapterId: string) {
  await verifyOwnership(storyId);

  await prisma.chapter.delete({
    where: { id: chapterId },
  });

  // Re-order remaining chapters to ensure contiguous positions
  const remainingChapters = await prisma.chapter.findMany({
    where: { storyId },
    orderBy: { position: "asc" },
  });

  for (let i = 0; i < remainingChapters.length; i++) {
    await prisma.chapter.update({
      where: { id: remainingChapters[i].id },
      data: { position: i },
    });
  }

  revalidatePath(`/stories/${storyId}`);
}

export async function reorderChapters(storyId: string, chapterIds: string[]) {
  await verifyOwnership(storyId);

  await prisma.$transaction(
    chapterIds.map((id, index) =>
      prisma.chapter.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  revalidatePath(`/stories/${storyId}`);
}

export async function updateChapterLayout(storyId: string, chapterId: string, layout: string) {
  await verifyOwnership(storyId);

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { layout },
  });

  revalidatePath(`/stories/${storyId}/preview`);
  const story = await prisma.story.findUnique({ where: { id: storyId }});
  if (story?.slug) {
    revalidatePath(`/s/${story.slug}`);
  }
}

export async function updateChapterMusicConfig(
  storyId: string,
  chapterId: string,
  config: { 
    type: "BUILT_IN" | "CUSTOM" | "NONE"; 
    url?: string; 
    source?: string; 
    trackId?: string 
  }
) {
  await verifyOwnership(storyId);

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { 
      musicType: config.type,
      musicUrl: config.url || null,
      musicSource: config.source || null,
      musicTrack: config.trackId || null,
    },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  const story = await prisma.story.findUnique({ where: { id: storyId }});
  if (story?.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true };
}

export async function setChapterCover(storyId: string, chapterId: string, mediaId: string) {
  await verifyOwnership(storyId);

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { coverMediaId: mediaId },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
}
