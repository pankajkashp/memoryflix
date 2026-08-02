import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

interface CheckoutPageProps {
  params: Promise<{ storyId: string }>;
  searchParams: Promise<{ email?: string }>;
}

export const metadata = {
  title: "Checkout — MemoryFlix",
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { storyId } = await params;
  const { email: emailQuery } = await searchParams;

  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      template: true,
    },
  });

  if (!story || !story.template) {
    notFound();
  }

  // If already paid, redirect to published story share page
  if (story.paymentStatus === "PAID" && story.slug) {
    redirect(`/s/${story.slug}`);
  }

  return (
    <CheckoutClient
      story={story as any}
      initialEmail={emailQuery || story.email || ""}
    />
  );
}
