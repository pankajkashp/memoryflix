"use client";

import React from "react";
import HeroSection from "./sections/HeroSection";
import HowItStartedSection from "./sections/HowItStartedSection";
import MemoriesSection from "./sections/MemoriesSection";
import TimelineSection from "./sections/TimelineSection";
import LoveNoteSection from "./sections/LoveNoteSection";
import FullScreenMemorySection from "./sections/FullScreenMemorySection";
import FinalSection from "./sections/FinalSection";

interface OurStoryRendererProps {
  pages: Array<{
    id: string;
    componentKey: string;
    fieldValues: Record<string, any>;
  }>;
}

export default function OurStoryRenderer({ pages }: OurStoryRendererProps) {
  return (
    <div className="w-full bg-black text-white selection:bg-rose-500/30 font-sans">
      {pages.map((page) => {
        switch (page.componentKey) {
          case "OUR_STORY_HERO":
            return (
              <HeroSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_HOW_IT_STARTED":
            return (
              <HowItStartedSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_MEMORIES":
            return (
              <MemoriesSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_TIMELINE":
            return (
              <TimelineSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_LOVE_NOTE":
            return (
              <LoveNoteSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_FULL_SCREEN_MEMORY":
            return (
              <FullScreenMemorySection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "OUR_STORY_FINAL":
            return (
              <FinalSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
