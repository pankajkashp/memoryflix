"use client";

import React from "react";
import LetterPage from "./LetterPage";
import SearchResultsPage from "./SearchResultsPage";
import DefinitionPage from "./DefinitionPage";
import NotificationPage from "./NotificationPage";
import LabeledPhotoPage from "./LabeledPhotoPage";
import LoadingPage from "./LoadingPage";
import CertificatePage from "./CertificatePage";
import { FixedPageConfig } from "@/lib/pageAnimations";

export interface PageRendererProps {
  componentKey: string;
  fixedConfig: FixedPageConfig;
  fieldValues: Record<string, any>;
  isActive?: boolean;
  isExiting?: boolean;
}

export function formatPageData(componentKey: string, raw: Record<string, any>) {
  switch (componentKey) {
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

    default:
      return (
        <div className="p-8 text-center text-zinc-400">
          Component &ldquo;{componentKey}&rdquo; not recognized.
        </div>
      );
  }
}
