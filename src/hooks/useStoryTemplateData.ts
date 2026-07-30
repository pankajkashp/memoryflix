import { useState } from "react";
import { StoryWithFullPayload } from "@/components/preview/PreviewClientWrapper";

export function useStoryTemplateData(story: StoryWithFullPayload) {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | null>(null);
  const [isCinematicPlaying, setIsCinematicPlaying] = useState<boolean>(false);

  const hasMedia = !!story.media && story.media.length > 0;
  const firstImage = story.media?.find((m) => m.type === "IMAGE");
  const coverImage = story.media?.find((m) => m.id === story.coverMediaId) || firstImage;

  const allChapters = (story.chapters || []).map((chapter) => ({
    chapter,
    mediaItems: (story.media || [])
      .map((item, index) => ({ item, index }))
      .filter((m) => m.item.chapterId === chapter.id),
  }));

  const chaptersWithMedia = allChapters.filter((c) => c.mediaItems.length > 0);

  const unassignedMedia = (story.media || [])
    .map((item, index) => ({ item, index }))
    .filter((m) => !m.item.chapterId);

  return {
    galleryActiveIndex,
    setGalleryActiveIndex,
    isCinematicPlaying,
    setIsCinematicPlaying,
    hasMedia,
    firstImage,
    coverImage,
    allChapters,
    chaptersWithMedia,
    unassignedMedia
  };
}
