import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TemplateDetailClient from "./TemplateDetailClient";

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = await prisma.template.findUnique({
    where: { slug },
  });

  if (!template) {
    return { title: "Template Not Found — MemoryFlix" };
  }

  return {
    title: `${template.name} — MemoryFlix Template`,
    description: template.description,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;

  const template = await prisma.template.findUnique({
    where: { slug },
    include: {
      pages: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!template || !template.isActive) {
    notFound();
  }

  return <TemplateDetailClient template={template as any} />;
}
