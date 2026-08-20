"use client";

import React from "react";
import TravelOpeningSection from "./sections/TravelOpeningSection";
import TravelDestinationSection from "./sections/TravelDestinationSection";
import TravelMemoriesSection from "./sections/TravelMemoriesSection";
import TravelTimelineSection from "./sections/TravelTimelineSection";
import TravelPostcardEndingSection from "./sections/TravelPostcardEndingSection";

interface TravelRendererProps {
  pages: Array<{
    id: string;
    componentKey: string;
    fieldValues: Record<string, any>;
  }>;
}

export default function TravelRenderer({ pages }: TravelRendererProps) {
  return (
    <div className="w-full bg-stone-900 text-stone-100 selection:bg-rose-500/30 font-sans">
      {pages.map((page) => {
        switch (page.componentKey) {
          case "TRAVEL_OPENING":
            return (
              <TravelOpeningSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "TRAVEL_DESTINATION":
            return (
              <TravelDestinationSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "TRAVEL_MEMORIES":
            return (
              <TravelMemoriesSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "TRAVEL_TIMELINE":
            return (
              <TravelTimelineSection
                key={page.id}
                data={page.fieldValues as any}
                isActive={true}
              />
            );
          case "TRAVEL_POSTCARD_ENDING":
            return (
              <TravelPostcardEndingSection
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
