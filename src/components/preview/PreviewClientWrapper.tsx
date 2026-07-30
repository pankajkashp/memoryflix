"use client";

import { useState } from "react";
import Link from "next/link";
import { Story, MediaAsset, Chapter, StoryTemplate } from "@prisma/client";
import dynamic from "next/dynamic";

const NetflixTemplate = dynamic(() => import("./templates/NetflixTemplate"));
const AppleTemplate = dynamic(() => import("./templates/AppleTemplate"));
const TravelTemplate = dynamic(() => import("./templates/TravelTemplate"));
const WeddingTemplate = dynamic(() => import("./templates/WeddingTemplate"));
const TimelineTemplate = dynamic(() => import("./templates/TimelineTemplate"));
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
      {!activeChapterId && (
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] md:px-12 md:pb-6 md:pt-[calc(env(safe-area-inset-top)+1.5rem)] bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
          <span className="text-red-600 font-bold text-2xl md:text-3xl tracking-tighter">MEMORYFLIX</span>
          <Link 
            href="/dashboard"
            className="text-white/80 hover:text-white text-sm md:text-base font-medium transition-colors"
          >
            Exit Preview
          </Link>
        </header>
      )}
      {renderTemplate()}
      <AudioPlayer 
        chapters={story.chapters || []} 
        activeChapterId={activeChapterId} 
      />
    </div>
  );
}
