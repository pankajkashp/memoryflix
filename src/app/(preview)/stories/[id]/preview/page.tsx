import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NetflixHero from "@/components/preview/NetflixHero";
import MediaGallery from "@/components/preview/MediaGallery";
import EmptyState from "@/components/preview/EmptyState";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PreviewPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const story = await prisma.story.findUnique({
    where: { id, userId: session.user.id },
    include: { media: true },
  });

  if (!story) {
    notFound();
  }

  const hasMedia = story.media && story.media.length > 0;

  return (
    <main>
      <NetflixHero story={story} />
      {hasMedia ? (
        <MediaGallery media={story.media} />
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
