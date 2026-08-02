"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createStoryFromTemplate(templateSlug: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { slug: templateSlug },
      include: {
        pages: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!template || !template.isActive) {
      return { success: false, error: "Template not found or inactive" };
    }

    // Generate random URL-safe 48-char hex editToken
    const editToken = crypto.randomBytes(24).toString("hex");

    // Create Story record
    const story = await prisma.story.create({
      data: {
        templateId: template.id,
        status: "DRAFT",
        paymentStatus: "UNPAID",
        editToken,
      },
    });

    // Create initial StoryPageInstances for each blueprint with schema defaults
    for (const blueprint of template.pages) {
      const schema = blueprint.editableSchema as any;
      const initialFields: Record<string, any> = {};

      if (schema && Array.isArray(schema.fields)) {
        for (const field of schema.fields) {
          if (field.name) {
            initialFields[field.name] = field.default !== undefined ? field.default : "";
          }
        }
      }

      await prisma.storyPageInstance.create({
        data: {
          storyId: story.id,
          templatePageBlueprintId: blueprint.id,
          fieldValues: initialFields,
        },
      });
    }

    return {
      success: true,
      storyId: story.id,
      editToken: story.editToken,
    };
  } catch (err: any) {
    console.error("Failed to create story from template:", err);
    return { success: false, error: err.message || "Failed to create story" };
  }
}

export async function updateStoryPageInstance(
  storyId: string,
  pageInstanceId: string,
  fieldValues: Record<string, any>
) {
  try {
    const instance = await prisma.storyPageInstance.findFirst({
      where: {
        id: pageInstanceId,
        storyId,
      },
    });

    if (!instance) {
      return { success: false, error: "Page instance not found" };
    }

    const updated = await prisma.storyPageInstance.update({
      where: { id: pageInstanceId },
      data: {
        fieldValues,
      },
    });

    return { success: true, instance: updated };
  } catch (err: any) {
    console.error("Failed to update story page instance:", err);
    return { success: false, error: err.message || "Failed to save changes" };
  }
}

export async function finalizeStoryDraft(storyId: string, email?: string) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return { success: false, error: "Story not found" };
    }

    const updated = await prisma.story.update({
      where: { id: storyId },
      data: {
        status: "COMPLETED",
        ...(email ? { email } : {}),
      },
    });

    try {
      revalidatePath(`/create/${storyId}`);
      revalidatePath(`/create/${storyId}/preview`);
    } catch {
      // Ignored outside Next.js request context
    }

    return { success: true, story: updated };
  } catch (err: any) {
    console.error("Failed to finalize story draft:", err);
    return { success: false, error: err.message || "Failed to finalize story" };
  }
}
