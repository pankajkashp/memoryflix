import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { fulfillPaidStory } from "@/app/actions/payment";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "dummy_secret";

    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature && process.env.NODE_ENV === "production") {
        console.error("❌ Invalid Razorpay Webhook Signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`🔔 Razorpay Webhook Event: ${event.event}`);

    // Handle payment.captured or order.paid
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId =
        paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      let storyId =
        paymentEntity?.notes?.storyId || orderEntity?.notes?.storyId;

      // If storyId wasn't in notes, lookup from Payment record by orderId
      if (!storyId && orderId) {
        const paymentRecord = await prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });
        storyId = paymentRecord?.storyId;
      }

      if (storyId) {
        console.log(`✨ Fulfilling story ${storyId} via Webhook`);
        await fulfillPaidStory(storyId, paymentId, orderId);
      } else {
        console.warn("⚠️ No storyId found in webhook payload");
      }
    }

    return NextResponse.json({ received: true, status: "ok" });
  } catch (err: any) {
    console.error("Razorpay Webhook handler error:", err);
    return NextResponse.json(
      { error: err.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
