import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Story } from "@prisma/client";

export function editAccessCookieName(storyId: string): string {
  return `mflx_edit_${storyId}`;
}

/** Mints the httpOnly edit-access cookie for a story onto the current response. */
export async function grantStoryEditAccess(story: Pick<Story, "id" | "editToken">) {
  (await cookies()).set(editAccessCookieName(story.id), story.editToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days — comfortably covers the 30-day post-payment editToken window
  });
}

export type StoryEditAccessResult =
  | { ok: true; story: Story }
  | { ok: false; status: 403 | 404; error: string };

/**
 * Verifies the caller holds a valid edit-access cookie for `storyId` before
 * any read/mutation of story draft content is allowed. Guards against IDOR:
 * a guessed/enumerated storyId alone must not grant access.
 */
export async function assertStoryEditAccess(storyId: string): Promise<StoryEditAccessResult> {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) {
    return { ok: false, status: 404, error: "Story not found" };
  }

  const cookieToken = (await cookies()).get(editAccessCookieName(storyId))?.value;
  if (!cookieToken || cookieToken !== story.editToken) {
    return { ok: false, status: 403, error: "Invalid or missing edit access" };
  }

  if (story.editTokenExpiresAt && story.editTokenExpiresAt.getTime() < Date.now()) {
    return { ok: false, status: 403, error: "Edit access has expired" };
  }

  return { ok: true, story };
}
