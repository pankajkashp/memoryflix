"use client";

import { useState } from "react";
import { Story, MediaAsset, Chapter, StoryTemplate } from "@prisma/client";
import NetflixTemplate from "./templates/NetflixTemplate";
import AppleTemplate from "./templates/AppleTemplate";
import TravelTemplate from "./templates/TravelTemplate";
import WeddingTemplate from "./templates/WeddingTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import AudioPlayer from "./AudioPlayer";
import { getFontClassName } from "@/lib/fonts";
import { getPresetConfig, getAccentConfig } from "@/lib/typography-presets";

export type StoryWithFullPayload = Story & { 
  media: MediaAsset[];
  chapters?: Chapter[];
  template: StoryTemplate;
};

export default function PreviewClientWrapper({ 
  story, 
  isEditable = false 
}: { 
  story: StoryWithFullPayload;
  isEditable?: boolean;
}) {
  const slug = story.template.slug;

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const handleChapterChange = (chapterId: string | null) => {
    setActiveChapterId(chapterId);
  };

  const renderTemplate = () => {
    switch (slug) {
      case "apple-memories":
        return <AppleTemplate story={story} isEditable={isEditable} onChapterChange={handleChapterChange} />;
      case "travel-journal":
        return <TravelTemplate story={story} isEditable={isEditable} onChapterChange={handleChapterChange} />;
      case "wedding-film":
        return <WeddingTemplate story={story} isEditable={isEditable} onChapterChange={handleChapterChange} />;
      case "timeline-story":
        return <TimelineTemplate story={story} isEditable={isEditable} onChapterChange={handleChapterChange} />;
      case "netflix-memories":
      default:
        return <NetflixTemplate story={story} isEditable={isEditable} onChapterChange={handleChapterChange} />;
    }
  };

  const presetConfig = getPresetConfig(story.typographyPreset);
  const accentConfig = getAccentConfig(story.accentColor);
  const fontClassName = getFontClassName(presetConfig.fontId);

  return (
    <div className={`${fontClassName} ${accentConfig.text}`}>
      {renderTemplate()}
      <AudioPlayer 
        chapters={story.chapters || []} 
        activeChapterId={activeChapterId} 
      />
    </div>
  );
}
