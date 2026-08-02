import { prisma } from "../src/lib/prisma";
import {
  createStoryFromTemplate,
  updateStoryPageInstance,
  finalizeStoryDraft,
} from "../src/app/actions/templateStory";
import {
  createStoryPaymentOrder,
  verifyRazorpayPayment,
} from "../src/app/actions/payment";
import { recoverStoryLinks } from "../src/app/actions/recover";

async function runPipelineTest() {
  console.log("\n🚀 Starting End-to-End Pipeline Verification...\n");

  // Step 1: Verify Template
  const template = await prisma.template.findUnique({
    where: { slug: "friendship-day" },
    include: { pages: { orderBy: { position: "asc" } } },
  });

  if (!template || template.pages.length !== 7) {
    throw new Error(`Template verification failed. Found ${template?.pages?.length} pages.`);
  }
  console.log(`✓ Step 1: Template '${template.name}' loaded with ${template.pages.length} blueprints.`);

  // Step 2: Create Story
  const createRes = await createStoryFromTemplate("friendship-day");
  if (!createRes.success || !createRes.storyId) {
    throw new Error(`Story creation failed: ${createRes.error}`);
  }
  const storyId = createRes.storyId;
  console.log(`✓ Step 2: Created story ${storyId} with editToken.`);

  // Step 3: Verify Page Instances & Customization
  const instances = await prisma.storyPageInstance.findMany({
    where: { storyId },
  });

  if (instances.length !== 7) {
    throw new Error(`Expected 7 page instances, got ${instances.length}`);
  }
  console.log(`✓ Step 3: Verified 7 page instances auto-created.`);

  // Customize Page 1 (Notification)
  const p1 = instances[0];
  const updateRes = await updateStoryPageInstance(storyId, p1.id, {
    notificationTitle: "To My Best Friend Forever 💖",
    notificationText: "Happy Friendship Day!",
    sender: "Alex",
    time: "10:00 AM",
    replyText: "A friendship that lasts a lifetime",
  });

  if (!updateRes.success) {
    throw new Error(`Failed to update page instance: ${updateRes.error}`);
  }
  console.log(`✓ Step 4: Auto-saved customization for chapter 1.`);

  // Step 4: Finalize Draft with Email
  const testEmail = "testfriend@example.com";
  const finalizeRes = await finalizeStoryDraft(storyId, testEmail);
  if (!finalizeRes.success) {
    throw new Error(`Failed to finalize draft: ${finalizeRes.error}`);
  }
  console.log(`✓ Step 5: Draft finalized with email ${testEmail}.`);

  // Step 5: Initialize Checkout Order
  const orderRes = await createStoryPaymentOrder(storyId, testEmail);
  if (!orderRes.success || !orderRes.orderId) {
    throw new Error(`Failed to create payment order: ${orderRes.error}`);
  }
  console.log(`✓ Step 6: Initialized payment order ${orderRes.orderId} (₹${orderRes.amount / 100}).`);

  // Step 6: Verify and Fulfill Payment
  const payRes = await verifyRazorpayPayment({
    razorpay_order_id: orderRes.orderId,
    razorpay_payment_id: `pay_e2e_${Date.now()}`,
    razorpay_signature: "mock_signature_dev",
    storyId,
  });

  if (!payRes.success || !payRes.story?.slug) {
    throw new Error(`Payment verification/fulfillment failed: ${payRes.error}`);
  }
  const publishedSlug = payRes.story.slug;
  console.log(`✓ Step 7: Payment fulfilled! Story published at /s/${publishedSlug}`);

  // Step 7: Verify Public Share Query
  const publishedStory = await prisma.story.findUnique({
    where: { slug: publishedSlug },
    include: {
      template: { include: { pages: { orderBy: { position: "asc" } } } },
      pageInstances: true,
    },
  });

  if (
    !publishedStory ||
    publishedStory.paymentStatus !== "PAID" ||
    publishedStory.status !== "PUBLISHED"
  ) {
    throw new Error("Public story verification failed");
  }
  console.log(`✓ Step 8: Public query verified: ${publishedStory.pageInstances.length} chapters playable.`);

  // Step 8: Test Link Recovery
  const recoverRes = await recoverStoryLinks(testEmail);
  if (!recoverRes.success) {
    throw new Error(`Recovery failed: ${recoverRes.error}`);
  }
  console.log(`✓ Step 9: Recovery workflow triggered successfully for ${testEmail}.`);

  console.log("\n🎉 ALL 9 PIPELINE STEPS PASSED 100% END-TO-END!\n");
}

runPipelineTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Pipeline test error:", err);
    process.exit(1);
  });
