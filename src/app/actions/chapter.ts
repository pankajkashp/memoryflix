"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ChapterSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  emoji: z.string().max(10, "Emoji too long").nullable(),
  subtitle: z.string().max(200, "Subtitle too long").nullable(),
  date: z.string().nullable(),
  location: z.string().max(100, "Location too long").nullable(),
});

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
  const parsed = ChapterSchema.parse({ title, emoji, subtitle, date, location });

  // Get current max position
  const lastChapter = await prisma.chapter.findFirst({
    where: { storyId },
    orderBy: { position: "desc" },
  });
  const position = lastChapter ? lastChapter.position + 1 : 0;

  const newChapter = await prisma.chapter.create({
    data: {
      storyId,
      title: parsed.title,
      emoji: parsed.emoji,
      subtitle: parsed.subtitle,
      date: parsed.date ? new Date(parsed.date) : null,
      location: parsed.location,
      position,
    },
  });

  revalidatePath(`/stories/${storyId}`);
  
  return newChapter;
}

export async function updateChapter(storyId: string, chapterId: string, title: string, emoji: string | null = null, subtitle: string | null = null, date: string | null = null, location: string | null = null) {
  await verifyOwnership(storyId);
  const parsed = ChapterSchema.parse({ title, emoji, subtitle, date, location });

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.storyId !== storyId) throw new Error("Unauthorized");

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { 
      title: parsed.title, 
      emoji: parsed.emoji,
      subtitle: parsed.subtitle,
      date: parsed.date ? new Date(parsed.date) : null,
      location: parsed.location 
    },
  });

  revalidatePath(`/stories/${storyId}`);
}

export async function deleteChapter(storyId: string, chapterId: string) {
  await verifyOwnership(storyId);

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.storyId !== storyId) throw new Error("Unauthorized");

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

  const chapters = await prisma.chapter.findMany({ where: { id: { in: chapterIds } } });
  if (chapters.some(c => c.storyId !== storyId)) throw new Error("Unauthorized");

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
  const parsedLayout = z.string().parse(layout);

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.storyId !== storyId) throw new Error("Unauthorized");

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { layout: parsedLayout },
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

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.storyId !== storyId) throw new Error("Unauthorized");

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

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter || chapter.storyId !== storyId) throw new Error("Unauthorized");

  const media = await prisma.mediaAsset.findFirst({ where: { id: mediaId, storyId } });
  if (!media) throw new Error("Unauthorized media");

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { coverMediaId: mediaId },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
}
