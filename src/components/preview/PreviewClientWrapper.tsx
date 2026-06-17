"use client";

import { useState } from "react";
import { Story, MediaAsset } from "@prisma/client";
import NetflixHero from "@/components/preview/NetflixHero";
import MediaGallery from "@/components/preview/MediaGallery";
import MediaViewer from "@/components/preview/MediaViewer";
import CinematicPlayer from "@/components/preview/CinematicPlayer";
import EmptyState from "@/components/preview/EmptyState";

type StoryWithMedia = Story & { media: MediaAsset[] };

export default function PreviewClientWrapper({ story }: { story: StoryWithMedia }) {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);

  const hasMedia = story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");
  const coverImage = story.media?.find((m) => m.id === story.coverMediaId) || firstImage;

  return (
    <>
      <NetflixHero 
        story={story} 
        heroImageUrl={coverImage?.url} 
        onPlay={hasMedia ? () => setIsCinematicPlaying(true) : undefined}
      />
      
      {hasMedia ? (
        <MediaGallery 
          media={story.media} 
          onMediaClick={(index) => setGalleryActiveIndex(index)}
        />
      ) : (
        <EmptyState />
      )}

      {galleryActiveIndex !== null && story.media && (
        <MediaViewer
          media={story.media}
          initialIndex={galleryActiveIndex}
          onClose={() => setGalleryActiveIndex(null)}
        />
      )}

      {isCinematicPlaying && story.media && (
        <CinematicPlayer
          media={story.media}
          initialIndex={0}
          onClose={() => setIsCinematicPlaying(false)}
        />
      )}
    </>
  );
}
