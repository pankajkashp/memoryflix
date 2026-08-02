"use server";

import { prisma } from "@/lib/prisma";
import { sendStoryDeliveryEmail } from "@/lib/email";

// Simple in-memory rate-limiter: max 3 requests per email per 5 minutes
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export async function recoverStoryLinks(email: string) {
  try {
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Check rate limit
    const now = Date.now();
    const existing = rateLimitMap.get(trimmedEmail);

    if (existing && existing.expiresAt > now) {
      if (existing.count >= 3) {
        return {
          success: false,
          error: "Too many recovery attempts. Please try again in 5 minutes.",
        };
      }
      existing.count += 1;
    } else {
      rateLimitMap.set(trimmedEmail, { count: 1, expiresAt: now + 5 * 60 * 1000 });
    }

    // Find stories associated with this email
    const stories = await prisma.story.findMany({
      where: {
        email: trimmedEmail,
        paymentStatus: "PAID",
      },
      include: {
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // Resend email for each paid story found
    for (const story of stories) {
      if (story.slug) {
        const shareUrl = `${baseUrl}/s/${story.slug}`;
        const editUrl = `${baseUrl}/create/${story.id}?token=${story.editToken}`;

        await sendStoryDeliveryEmail({
          toEmail: trimmedEmail,
          templateName: story.template?.name || "Story",
          shareUrl,
          editUrl,
        });
      }
    }

    // Always return success to prevent email enumeration
    return {
      success: true,
      message:
        "If any paid stories are linked to this email, we have resent your share and edit links to your inbox.",
    };
  } catch (err: any) {
    console.error("Recover story links error:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again shortly.",
    };
  }
}
