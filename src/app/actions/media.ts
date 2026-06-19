"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export async function generateCloudinarySignature(paramsToSign: Record<string, string | number | boolean>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return signature;
}

export async function saveMediaAsset(data: {
  storyId: string;
  url: string;
  publicId: string;
  type: "IMAGE" | "VIDEO";
  bytes?: number;
  duration?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership of the story
  const story = await prisma.story.findUnique({
    where: { id: data.storyId, userId: session.user.id },
  });

  if (!story) throw new Error("Story not found or unauthorized");

  const position = await prisma.mediaAsset.count({
    where: { storyId: data.storyId },
  });

  const asset = await prisma.mediaAsset.create({
    data: {
      storyId: data.storyId,
      userId: session.user.id,
      url: data.url,
      storageKey: data.publicId,
      type: data.type,
      position,
      sizeBytes: data.bytes,
      durationSeconds: data.duration ? Math.round(data.duration) : null,
    },
  });

  revalidatePath(`/dashboard/stories/${data.storyId}`);
  revalidatePath(`/stories/${data.storyId}/preview`);
  return { success: true, asset };
}

// ── setCoverMedia ─────────────────────────────────────────────────────────────

export async function setCoverMedia(storyId: string, mediaId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the user owns the story
  const story = await prisma.story.findUnique({
    where: { id: storyId, userId: session.user.id },
  });

  if (!story) throw new Error("Story not found or unauthorized");

  // Verify the media exists, belongs to the story, and is an IMAGE
  const media = await prisma.mediaAsset.findUnique({
    where: { id: mediaId, storyId },
  });

  if (!media) throw new Error("Media asset not found in this story");
  if (media.type !== "IMAGE") throw new Error("Only images can be set as cover");

  // Update the story's coverMediaId
  await prisma.story.update({
    where: { id: storyId },
    data: { coverMediaId: mediaId },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  if (story.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true };
}

// ── reorderMedia ──────────────────────────────────────────────────────────────

export async function reorderMedia(storyId: string, mediaIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the user owns the story
  const story = await prisma.story.findUnique({
    where: { id: storyId, userId: session.user.id },
  });

  if (!story) throw new Error("Story not found or unauthorized");

  // Update positions in a transaction to ensure atomicity
  await prisma.$transaction(
    mediaIds.map((id, index) =>
      prisma.mediaAsset.update({
        where: { id, storyId },
        data: { position: index },
      })
    )
  );

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  if (story.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true };
}

// ── updateCaption ─────────────────────────────────────────────────────────────

export async function updateCaption(
  storyId: string,
  mediaId: string,
  caption: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the user owns the story that contains this media
  const story = await prisma.story.findUnique({
    where: { id: storyId, userId: session.user.id },
  });
  if (!story) throw new Error("Story not found or unauthorized");

  // Verify the media asset belongs to this story (double ownership check)
  const media = await prisma.mediaAsset.findUnique({
    where: { id: mediaId, storyId },
  });
  if (!media) throw new Error("Media asset not found in this story");

  const trimmed = caption.trim();

  const updated = await prisma.mediaAsset.update({
    where: { id: mediaId },
    data: { caption: trimmed.length > 0 ? trimmed : null },
  });

  revalidatePath(`/stories/${storyId}`);
  revalidatePath(`/stories/${storyId}/preview`);
  if (story.slug) {
    revalidatePath(`/s/${story.slug}`);
  }

  return { success: true, asset: updated };
}
