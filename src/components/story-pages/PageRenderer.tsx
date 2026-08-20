"use client";

import React from "react";
import LetterPage from "./LetterPage";
import SearchResultsPage from "./SearchResultsPage";
import DefinitionPage from "./DefinitionPage";
import NotificationPage from "./NotificationPage";
import LabeledPhotoPage from "./LabeledPhotoPage";
import LoadingPage from "./LoadingPage";
import CertificatePage from "./CertificatePage";
import PickRevealPage from "./PickRevealPage";
import ScratchRevealPage from "./ScratchRevealPage";
import { FixedPageConfig } from "@/lib/pageAnimations";

// Our Story Templates
import HeroSection from "../story-templates/our-story/sections/HeroSection";
import HowItStartedSection from "../story-templates/our-story/sections/HowItStartedSection";
import MemoriesSection from "../story-templates/our-story/sections/MemoriesSection";
import TimelineSection from "../story-templates/our-story/sections/TimelineSection";
import LoveNoteSection from "../story-templates/our-story/sections/LoveNoteSection";
import FullScreenMemorySection from "../story-templates/our-story/sections/FullScreenMemorySection";
import FinalSection from "../story-templates/our-story/sections/FinalSection";

// Birthday Templates
import BirthdayOpeningSection from "../story-templates/birthday/sections/BirthdayOpeningSection";
import BirthdayRevealSection from "../story-templates/birthday/sections/BirthdayRevealSection";
import BirthdayMemoriesSection from "../story-templates/birthday/sections/BirthdayMemoriesSection";
import BirthdaySurpriseEndingSection from "../story-templates/birthday/sections/BirthdaySurpriseEndingSection";

// Travel Templates
import TravelOpeningSection from "../story-templates/travel/sections/TravelOpeningSection";
import TravelDestinationSection from "../story-templates/travel/sections/TravelDestinationSection";
import TravelMemoriesSection from "../story-templates/travel/sections/TravelMemoriesSection";
import TravelTimelineSection from "../story-templates/travel/sections/TravelTimelineSection";
import TravelPostcardEndingSection from "../story-templates/travel/sections/TravelPostcardEndingSection";

// Birthday Cinematic
import CinematicBirthdayExperience from "../story-templates/birthday-cinematic/CinematicBirthdayExperience";

export interface PageRendererProps {
  componentKey: string;
  fixedConfig: FixedPageConfig;
  fieldValues: Record<string, any>;
  isActive?: boolean;
  isExiting?: boolean;
}

export function formatPageData(componentKey: string, raw: Record<string, any>) {
  switch (componentKey) {
    case "SCRATCH_REVEAL":
      return {
        title: raw.title || raw.notificationTitle || "A Secret Story For You 💖",
        subtitle: raw.subtitle || raw.tagline || "Someone created a mystery just for you",
        secretMessage: raw.secretMessage || raw.notificationText || "Every great memory begins with a spark.",
        sender: raw.sender || "MemoryFlix Surprise 🎁",
        photoUrl: raw.photoUrl,
      };

    case "PICK_REVEAL":
      return {
        prompt: raw.prompt,
        option1Text: raw.option1Text,
        option1Photo: raw.option1Photo,
        option2Text: raw.option2Text,
        option2Photo: raw.option2Photo,
        option3Text: raw.option3Text,
        option3Photo: raw.option3Photo,
        options: raw.options,
      };

    case "NOTIFICATION":
      return {
        notificationTitle: raw.notificationTitle || "Priority Notification 💌",
        notificationText:
          raw.notificationText || "Tap to open your special message",
        sender: raw.sender || "MemoryFlix",
        time: raw.time || "Just now",
        replyText: raw.replyText || "Unlocked special memory ❤️",
      };

    case "DEFINITION":
      return {
        word: raw.word || "Serendipity",
        phonetic: raw.phonetic || "/ˌsɛr(ə)nˈdɪpɪti/",
        partOfSpeech: raw.partOfSpeech || "noun",
        definition:
          raw.definition || "A moment of delightful discovery.",
        exampleSentence: raw.exampleSentence || "With you, every day feels special.",
        photoUrl: raw.photoUrl || "/2.png",
      };

    case "LOADING":
      return {
        loadingLabel: raw.loadingLabel || "CALCULATING COMPATIBILITY...",
        awardTitle: raw.awardTitle || "BEST FRIEND OF THE DECADE",
        rewardText:
          raw.rewardText || "100% certified bond rating.",
        subtitle: raw.subtitle || "Presented with admiration",
      };

    case "CERTIFICATE":
      return {
        title: raw.title || "Certificate of Eternal Friendship",
        recipientName: raw.recipientName || "Best Friend",
        message:
          raw.message ||
          "For being the best companion anyone could ever ask for.",
        issuer: raw.issuer || "Your Friend",
        date: raw.date || "Today",
        certificateNo: raw.certificateNo || "MFLX-2024",
      };

    case "LABELED_PHOTO":
      return {
        title: raw.title || "Anatomy of Our Memory",
        subtitle: raw.subtitle || "The little details we'll never forget",
        photoUrl: raw.photoUrl || "/1.png",
        labels: [
          {
            text: raw.label1 || "Your iconic smile",
            target: { x: 48, y: 32 },
            labelPos: { x: 20, y: 20 },
            badge: "Highlight",
          },
          {
            text: raw.label2 || "That sunny day",
            target: { x: 75, y: 30 },
            labelPos: { x: 78, y: 15 },
          },
          {
            text: raw.label3 || "Always by my side",
            target: { x: 50, y: 68 },
            labelPos: { x: 22, y: 75 },
          },
          {
            text: raw.label4 || "Our special song",
            target: { x: 80, y: 65 },
            labelPos: { x: 75, y: 78 },
          },
        ],
      };

    case "SEARCH":
      return {
        searchQuery:
          raw.searchQuery || "what is the definition of true happiness?",
        resultsCount: raw.resultsCount || "Found 3 unforgettable memories",
        photos: [
          {
            url: raw.photo1 || "/1.png",
            title: raw.title1 || "Unforgettable Moment",
          },
          {
            url: raw.photo2 || "/2.png",
            title: raw.title2 || "Road Trip Vibes",
          },
          {
            url: raw.photo3 || "/3.png",
            title: raw.title3 || "Campfire Stories",
          },
        ],
      };

    case "LETTER":
      return {
        recipientName: raw.recipientName || "Friend",
        message:
          raw.message ||
          "Thank you for being such an extraordinary part of my journey.",
        senderName: raw.senderName || "Me",
        date: raw.date || "Forever",
        photoUrl: raw.photoUrl || "/3.png",
      };

    default:
      return raw;
  }
}

export default function PageRenderer({
  componentKey,
  fixedConfig,
  fieldValues,
  isActive = true,
  isExiting = false,
}: PageRendererProps) {
  const formattedData = formatPageData(componentKey, fieldValues);

  switch (componentKey) {
    case "SCRATCH_REVEAL":
      return (
        <ScratchRevealPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "PICK_REVEAL":
      return (
        <PickRevealPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "NOTIFICATION":
      return (
        <NotificationPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "DEFINITION":
      return (
        <DefinitionPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "LOADING":
      return (
        <LoadingPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "CERTIFICATE":
      return (
        <CertificatePage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "LABELED_PHOTO":
      return (
        <LabeledPhotoPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "SEARCH":
      return (
        <SearchResultsPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    case "LETTER":
      return (
        <LetterPage
          fixedConfig={fixedConfig}
          data={formattedData as any}
          isActive={isActive}
          isExiting={isExiting}
        />
      );

    // OUR STORY COMPONENTS
    case "OUR_STORY_HERO":
      return <HeroSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_HOW_IT_STARTED":
      return <HowItStartedSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_MEMORIES":
      return <MemoriesSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_TIMELINE":
      return <TimelineSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_LOVE_NOTE":
      return <LoveNoteSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_FULL_SCREEN_MEMORY":
      return <FullScreenMemorySection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "OUR_STORY_FINAL":
      return <FinalSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;

    // BIRTHDAY COMPONENTS
    case "BIRTHDAY_OPENING":
      return <BirthdayOpeningSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "BIRTHDAY_REVEAL":
      return <BirthdayRevealSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "BIRTHDAY_MEMORIES":
      return <BirthdayMemoriesSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "BIRTHDAY_SURPRISE_ENDING":
      return <BirthdaySurpriseEndingSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;

    // TRAVEL COMPONENTS
    case "TRAVEL_OPENING":
      return <TravelOpeningSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "TRAVEL_DESTINATION":
      return <TravelDestinationSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "TRAVEL_MEMORIES":
      return <TravelMemoriesSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "TRAVEL_TIMELINE":
      return <TravelTimelineSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;
    case "TRAVEL_POSTCARD_ENDING":
      return <TravelPostcardEndingSection data={formattedData as any} isActive={isActive} isEditorPreview={true} />;

    // BIRTHDAY CINEMATIC — single scene component shows Scene 01 as editor preview
    case "BIRTHDAY_CINEMATIC_STORY":
      return (
        <div className="relative w-full h-full">
          <CinematicBirthdayExperience fieldValues={formattedData as Record<string, string>} />
        </div>
      );

    default:
      return (
        <div className="p-8 text-center text-zinc-400">
          Component &ldquo;{componentKey}&rdquo; not recognized.
        </div>
      );
  }
}
