"use client";

import { useState } from "react";
import { Story, MediaAsset, Chapter, StoryTemplate } from "@prisma/client";
import NetflixTemplate from "./templates/NetflixTemplate";
import AppleTemplate from "./templates/AppleTemplate";
import TravelTemplate from "./templates/TravelTemplate";
import WeddingTemplate from "./templates/WeddingTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";

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

  switch (slug) {
    case "apple-memories":
      return <AppleTemplate story={story} isEditable={isEditable} />;
    case "travel-journal":
      return <TravelTemplate story={story} isEditable={isEditable} />;
    case "wedding-film":
      return <WeddingTemplate story={story} isEditable={isEditable} />;
    case "timeline-story":
      return <TimelineTemplate story={story} isEditable={isEditable} />;
    case "netflix-memories":
    default:
      return <NetflixTemplate story={story} isEditable={isEditable} />;
  }
}
