"use client";

import { useState } from "react";
import { Story, MediaAsset } from "@prisma/client";
import NetflixHero from "@/components/preview/NetflixHero";
import MediaGallery from "@/components/preview/MediaGallery";
import MediaViewer from "@/components/preview/MediaViewer";
import EmptyState from "@/components/preview/EmptyState";

type StoryWithMedia = Story & { media: MediaAsset[] };

export default function PreviewClientWrapper({ story }: { story: StoryWithMedia }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const hasMedia = story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");

  return (
    <>
      <NetflixHero 
        story={story} 
        heroImageUrl={firstImage?.url} 
        onPlay={hasMedia ? () => setActiveMediaIndex(0) : undefined}
      />
      
      {hasMedia ? (
        <MediaGallery 
          media={story.media} 
          onMediaClick={(index) => setActiveMediaIndex(index)}
        />
      ) : (
        <EmptyState />
      )}

      {activeMediaIndex !== null && story.media && (
        <MediaViewer
          media={story.media}
          initialIndex={activeMediaIndex}
          onClose={() => setActiveMediaIndex(null)}
        />
      )}
    </>
  );
}
