import type { Metadata } from "next";
import PreviewClientWrapper from "@/components/preview/PreviewClientWrapper";

export const metadata: Metadata = {
  title: "Summer in Italy — MemoryFlix Demo",
};

import type { StoryWithFullPayload } from "@/components/preview/PreviewClientWrapper";

export default function DemoPage() {
  // Hardcoded demo story data using high-quality Unsplash images
  const demoStory = {
    id: "demo-story",
    userId: "demo-user",
    templateId: "demo-template",
    title: "Summer in Italy",
    description: "Two weeks exploring the Amalfi coast, eating endless amounts of pasta, and watching the sunset over the Mediterranean Sea.",
    occasion: "Vacation",
    eventDate: new Date("2023-07-15"),
    slug: "demo",
    status: "PUBLISHED",
    publishedAt: new Date(),
    coverMediaId: "media-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    template: {
      slug: "netflix-memories",
      name: "Netflix Memories"
    },
    media: [
      {
        id: "media-1",
        storyId: "demo-story",
        userId: "demo-user",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1518131672697-613becd4fab5?q=80&w=2000&auto=format&fit=crop",
        storageKey: "demo1",
        caption: "Amalfi Coast",
        position: 0,
        createdAt: new Date(),
      },
      {
        id: "media-2",
        storyId: "demo-story",
        userId: "demo-user",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=2000&auto=format&fit=crop",
        storageKey: "demo2",
        caption: "Positano architecture",
        position: 1,
        createdAt: new Date(),
      },
      {
        id: "media-3",
        storyId: "demo-story",
        userId: "demo-user",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1533604100582-7b003c004ca5?q=80&w=2000&auto=format&fit=crop",
        storageKey: "demo3",
        caption: "Evening strolls",
        position: 2,
        createdAt: new Date(),
      },
      {
        id: "media-4",
        storyId: "demo-story",
        userId: "demo-user",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1529148482759-b35b25c5f217?q=80&w=2000&auto=format&fit=crop",
        storageKey: "demo4",
        caption: "Pasta for days",
        position: 3,
        createdAt: new Date(),
      },
    ],
  };

  return (
    <main>
      <PreviewClientWrapper story={demoStory as unknown as StoryWithFullPayload} />
    </main>
  );
}
