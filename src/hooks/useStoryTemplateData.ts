import { useState } from "react";
import { StoryWithFullPayload } from "@/components/preview/PreviewClientWrapper";

export function useStoryTemplateData(story: StoryWithFullPayload) {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);

  const hasMedia = !!story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");
  const coverImage = story.media?.find((m) => m.id === story.coverMediaId) || firstImage;

  const allMedia = (story.media || []).map((item, index) => ({ item, index }));

  return {
    galleryActiveIndex,
    setGalleryActiveIndex,
    isCinematicPlaying,
    setIsCinematicPlaying,
    hasMedia,
    firstImage,
    coverImage,
    allMedia,
  };
}
