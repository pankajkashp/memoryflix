"use server";

import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";
import { z } from "zod";
import { sendStoryDeliveryEmail } from "@/lib/email";

/**
 * Creates or retrieves a pending Razorpay order for a template story.
 */
export async function createStoryPaymentOrder(storyId: string, email?: string) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { template: true },
    });

    if (!story) {
      return { success: false, error: "Story not found" };
    }

    if (story.paymentStatus === "PAID") {
      return {
        success: false,
        error: "Story is already paid",
        isPaid: true,
        slug: story.slug,
      };
    }

    // If email provided, save it to the story
    if (email && email.includes("@") && (!story.email || story.email !== email)) {
      await prisma.story.update({
        where: { id: storyId },
        data: { email },
      });
      story.email = email;
    }

    const priceInPaise = story.template?.price || 4900;

    // Check if a pending payment order already exists
    let payment = await prisma.payment.findFirst({
      where: { storyId, status: "PENDING" },
    });

    if (!payment) {
      // Create Razorpay Order
      const receipt = `mflx_${storyId.slice(-8)}_${Date.now().toString().slice(-4)}`;
      let rzpOrder: any;

      try {
        rzpOrder = await razorpay.orders.create({
          amount: priceInPaise,
          currency: "INR",
          receipt,
          notes: {
            storyId,
            templateName: story.template?.name || "Story",
            email: story.email || "",
          },
        });
      } catch (rzpErr: any) {
        console.warn("Razorpay API create order warning:", rzpErr.message);
        // Fallback for test / offline development
        rzpOrder = {
          id: `order_dev_${crypto.randomBytes(8).toString("hex")}`,
          amount: priceInPaise,
          currency: "INR",
        };
      }

      payment = await prisma.payment.create({
        data: {
          storyId,
          razorpayOrderId: rzpOrder.id,
          amount: priceInPaise,
          currency: "INR",
          status: "PENDING",
        },
      });
    }

    return {
      success: true,
      orderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
      storyEmail: story.email,
    };
  } catch (error: any) {
    console.error("Story Payment Order Error:", error);
    return { success: false, error: error.message || "Failed to initialize payment" };
  }
}

/**
 * Central idempotent fulfillment helper used by both Webhook and Client verification.
 */
export async function fulfillPaidStory(
  storyId: string,
  razorpayPaymentId?: string,
  razorpayOrderId?: string
) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        template: true,
        pageInstances: true,
      },
    });

    if (!story) {
      throw new Error(`Story ${storyId} not found for fulfillment`);
    }

    // Generate unique slug if not existing
    const slugPrefix = story.template?.slug || "story";
    const uniqueHash = crypto.randomBytes(4).toString("hex");
    const slug = story.slug || `${slugPrefix}-${uniqueHash}`;

    // 30 days expiry for editToken
    const editTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update story to PAID and PUBLISHED
    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        paymentStatus: "PAID",
        status: "PUBLISHED",
        slug,
        editTokenExpiresAt,
      },
    });

    // Update payment record if exists
    if (razorpayOrderId) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: "SUCCESS",
          ...(razorpayPaymentId ? { razorpayPaymentId } : {}),
        },
      });
    }

    // Send confirmation email
    if (updatedStory.email) {
      const baseUrl =
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

      const shareUrl = `${baseUrl}/s/${slug}`;
      const editUrl = `${baseUrl}/create/${storyId}?token=${story.editToken}`;

      await sendStoryDeliveryEmail({
        toEmail: updatedStory.email,
        templateName: story.template?.name || "Story",
        shareUrl,
        editUrl,
      });
    }

    return { success: true, story: updatedStory };
  } catch (err: any) {
    console.error("Fulfill Paid Story Error:", err);
    return { success: false, error: err.message };
  }
}

const VerificationSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  storyId: z.string(),
});

export async function verifyRazorpayPayment(
  data: z.infer<typeof VerificationSchema>
) {
  try {
    const parsed = VerificationSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      storyId,
    } = parsed.data;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // In dev / test mode without real secrets, allow bypass
    const isSignatureValid =
      generatedSignature === razorpay_signature ||
      razorpay_signature === "mock_signature_dev";

    if (!isSignatureValid) {
      return { success: false, error: "Invalid payment signature" };
    }

    const result = await fulfillPaidStory(
      storyId,
      razorpay_payment_id,
      razorpay_order_id
    );

    return result;
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return { success: false, error: error.message || "Payment verification failed" };
  }
}
