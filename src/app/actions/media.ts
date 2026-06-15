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

console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "present" : "missing"
);

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
