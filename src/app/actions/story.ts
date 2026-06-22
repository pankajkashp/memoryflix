"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ── Helpers ───────────────────────────────────────────────────────────────────


// ── Types ─────────────────────────────────────────────────────────────────────

export type StoryActionState = {
  errors?: {
    title?: string[];
    description?: string[];
    occasion?: string[];
    eventDate?: string[];
    general?: string[];
  };
};

// ── createStory ───────────────────────────────────────────────────────────────

const CreateStorySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be under 100 characters"),
});

export async function createStory(
  _state: StoryActionState,
  formData: FormData
): Promise<StoryActionState> {
  // 1. Auth check — every Server Action must verify the session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { errors: { general: ["You must be logged in to create a story."] } };
  }

  // 2. Validate
  const result = CreateStorySchema.safeParse({
    title: formData.get("title"),
  });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title } = result.data;

  // 3. Dynamic prisma import — prevents eager init at module-load time
  const { prisma } = await import("@/lib/prisma");

  // 4. Get the default template (Netflix Memories)
  const template = await prisma.storyTemplate.findFirst({
    where: { slug: "netflix-memories", isActive: true },
  });
  if (!template) {
    return { errors: { general: ["Story template not found. Please contact support."] } };
  }

  // 5. Create the story — slug is left null until the story is published (Phase 6)
  let story;
  try {
    story = await prisma.story.create({
      data: {
        userId: session.user.id,
        templateId: template.id,
        title,
      },
    });
  } catch {
    return { errors: { general: ["Failed to create story. Please try again."] } };
  }

  // 6. Redirect to the story editor
  redirect(`/stories/${story.id}`);
}

// ── updateStory ───────────────────────────────────────────────────────────────

const UpdateStorySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be under 100 characters"),
  description: z.string().max(500, "Description must be under 500 characters").optional().or(z.literal("")),
  occasion: z.string().max(50, "Occasion must be under 50 characters").optional().or(z.literal("")),
  eventDate: z.string().optional().or(z.literal("")),
});

export async function updateStory(
  storyId: string,
  _state: StoryActionState,
  formData: FormData
): Promise<StoryActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { errors: { general: ["Unauthorized."] } };
  }

  const result = UpdateStorySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    occasion: formData.get("occasion"),
    eventDate: formData.get("eventDate"),
  });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { prisma } = await import("@/lib/prisma");

  // Verify ownership before updating
  const story = await prisma.story.findFirst({
    where: { id: storyId, userId: session.user.id },
  });
  if (!story) {
    return { errors: { general: ["Story not found."] } };
  }

  const { title, description, occasion, eventDate } = result.data;
  const parsedDate = (eventDate && eventDate.trim() !== "") ? new Date(eventDate) : null;

  await prisma.story.update({
    where: { id: storyId },
    data: { 
      title,
      description: description || null,
      occasion: occasion || null,
      eventDate: parsedDate,
    },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/dashboard");
  return {};
}

// ── updateStoryTemplate ───────────────────────────────────────────────────────

export async function updateStoryTemplate(storyId: string, templateId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { prisma } = await import("@/lib/prisma");

  const story = await prisma.story.findFirst({
    where: { id: storyId, userId: session.user.id },
  });
  if (!story) throw new Error("Story not found or unauthorized");

  const template = await prisma.storyTemplate.findUnique({
    where: { id: templateId, isActive: true },
  });
  if (!template) throw new Error("Template not found or inactive");

  await prisma.story.update({
    where: { id: storyId },
    data: { templateId },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  if (story.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true };
}

// ── deleteStory ───────────────────────────────────────────────────────────────

export async function deleteStory(storyId: string): Promise<void> {
  // Guard: session must be present
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;

  const { prisma } = await import("@/lib/prisma");

  // Guard: story must exist and belong to this user
  const story = await prisma.story.findFirst({
    where: { id: storyId, userId: session.user.id },
  });
  if (!story) return;

  await prisma.story.delete({ where: { id: storyId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ── publishStory ──────────────────────────────────────────────────────────────

export async function publishStory(storyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { prisma } = await import("@/lib/prisma");

  const story = await prisma.story.findFirst({
    where: { id: storyId, userId: session.user.id },
  });

  if (!story) throw new Error("Story not found or unauthorized");

  if (story.status === "PUBLISHED" && story.slug) {
    return { success: true, slug: story.slug };
  }

  const baseSlug = story.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const slug = `${baseSlug}-${uniqueId}`;

  await prisma.story.update({
    where: { id: storyId },
    data: {
      status: "PUBLISHED",
      slug,
      publishedAt: new Date(),
    },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath("/dashboard");
  
  return { success: true, slug };
}

// ── updateStoryTypography ──────────────────────────────────────────────────────

export async function updateStoryTypography(storyId: string, typographyPreset: string | null, accentColor: string | null) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { prisma } = await import("@/lib/prisma");

  const story = await prisma.story.findFirst({
    where: { id: storyId, userId: session.user.id },
  });

  if (!story) throw new Error("Story not found or unauthorized");

  await prisma.story.update({
    where: { id: storyId },
    data: { typographyPreset, accentColor },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  if (story.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true };
}
