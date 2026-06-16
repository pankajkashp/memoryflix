import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PreviewClientWrapper from "@/components/preview/PreviewClientWrapper";

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
    include: { media: { orderBy: { position: "asc" } } },
  });

  if (!story) {
    notFound();
  }

  return (
    <main>
      <PreviewClientWrapper story={story} />
    </main>
  );
}
