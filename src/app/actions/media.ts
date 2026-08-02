"use server";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MediaAssetSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  type: z.enum(["IMAGE", "VIDEO"]),
  bytes: z.number().positive().optional(),
  duration: z.number().nonnegative().optional(),
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateCloudinarySignature(
  paramsToSign: Record<string, string | number | boolean>
) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return "mock_signature_dev";

  const signature = cloudinary.utils.api_sign_request(paramsToSign, secret);
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
  const parsed = MediaAssetSchema.parse(data);

  // Verify story exists
  const story = await prisma.story.findUnique({
    where: { id: data.storyId },
  });

  if (!story) throw new Error("Story not found");

  const position = await prisma.mediaAsset.count({
    where: { storyId: data.storyId },
  });

  const asset = await prisma.mediaAsset.create({
    data: {
      storyId: data.storyId,
      url: parsed.url,
      storageKey: parsed.publicId,
      type: parsed.type,
      position,
      sizeBytes: parsed.bytes,
      durationSeconds: parsed.duration ? Math.round(parsed.duration) : null,
    },
  });

  revalidatePath(`/create/${data.storyId}`);
  revalidatePath(`/create/${data.storyId}/preview`);
  return { success: true, asset };
}

export async function deleteMedia(storyId: string, mediaId: string) {
  const media = await prisma.mediaAsset.findFirst({
    where: { id: mediaId, storyId },
  });
  if (!media) throw new Error("Media asset not found in this story");

  await prisma.mediaAsset.delete({
    where: { id: mediaId },
  });

  revalidatePath(`/create/${storyId}`);
  revalidatePath(`/create/${storyId}/preview`);
  return { success: true };
}
