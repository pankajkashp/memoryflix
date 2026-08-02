import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PreviewClientWrapper from "@/components/preview/PreviewClientWrapper";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug },
    include: { media: { orderBy: { position: "asc" } } },
  });

  if (!story || story.status !== "PUBLISHED" || story.paymentStatus !== "PAID") {
    return { title: "Story Not Found" };
  }

  const firstImage = story.media.find((m) => m.type === "IMAGE");
  const coverImage = story.media.find((m) => m.id === story.coverMediaId) || firstImage;

  return {
    title: `${story.title} | MemoryFlix`,
    description: story.description || "A cinematic story shared on MemoryFlix.",
    openGraph: {
      title: story.title,
      description: story.description || "A cinematic story shared on MemoryFlix.",
      images: coverImage ? [{ url: coverImage.url }] : [],
    },
  };
}

export default async function PublicStoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  const story = await prisma.story.findUnique({
    where: { slug },
    include: { 
      media: { orderBy: { position: "asc" } },
      template: true,
    },
  });

  // Security check: Only allow access if the story is published and paid
  if (!story || story.status !== "PUBLISHED" || story.paymentStatus !== "PAID") {
    notFound();
  }

  return (
    <main>
      <PreviewClientWrapper story={story} />
    </main>
  );
}
