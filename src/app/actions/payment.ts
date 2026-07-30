"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";
import { z } from "zod";

const PRICE_IN_PAISE = 9900; // ₹99

export async function createRazorpayOrder(storyId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify ownership
    const story = await prisma.story.findFirst({
      where: { id: storyId, userId: session.user.id },
    });

    if (!story) return { success: false, error: "Story not found or unauthorized" };

    if (story.paymentStatus === "PAID") {
      return { success: false, error: "Story is already paid" };
    }

    // Check if a pending payment already exists for this story
    let payment = await prisma.payment.findFirst({
      where: { storyId, userId: session.user.id, status: "PENDING" },
    });

    if (!payment) {
      // Create order in Razorpay
      const order = await razorpay.orders.create({
        amount: PRICE_IN_PAISE,
        currency: "INR",
        receipt: `receipt_${storyId}`,
      });

      // Save payment intent to database
      payment = await prisma.payment.create({
        data: {
          userId: session.user.id,
          storyId,
          razorpayOrderId: order.id,
          amount: PRICE_IN_PAISE,
          currency: "INR",
          status: "PENDING",
        },
      });
    }

    return { 
      success: true, 
      orderId: payment.razorpayOrderId, 
      amount: payment.amount, 
      currency: payment.currency 
    };

  } catch (error) {
    console.error("Payment Order Error:", error);
    return { success: false, error: "Failed to initialize payment" };
  }
}

const VerificationSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  storyId: z.string(),
});

export async function verifyRazorpayPayment(data: z.infer<typeof VerificationSchema>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const parsed = VerificationSchema.safeParse(data);
    if (!parsed.success) return { success: false, error: "Invalid input" };
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, storyId } = parsed.data;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid payment signature" };
    }

    // Update payment record in database
    await prisma.$transaction(async (tx) => {
      // Find the payment record
      const payment = await tx.payment.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
      });

      if (!payment || payment.userId !== session.user.id || payment.storyId !== storyId) {
        throw new Error("Invalid payment record");
      }

      if (payment.status === "SUCCESS") {
        return; // Already processed
      }

      // Update payment
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: "SUCCESS",
        },
      });

      // Update story status
      await tx.story.update({
        where: { id: storyId },
        data: { paymentStatus: "PAID" },
      });
    });

    return { success: true };

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { success: false, error: "Payment verification failed" };
  }
}
