"use client";

/**
 * CinematicBirthdayExperience
 *
 * Scene state machine for the birthday-cinematic template.
 * Manages scene transitions, branching (YES/NO), and cleanup.
 *
 * Architecture:
 * - Only ONE scene is mounted in the DOM at a time.
 * - Scenes call transition callbacks (onNext, onYes, onNo, etc.)
 * - The orchestrator unmounts the old scene and mounts the next.
 * - GSAP timelines live entirely inside each scene component.
 */

import { useCallback, useState, useEffect } from "react";
import gsap from "gsap";

import Scene01Envelope from "./scenes/Scene01Envelope";
import Scene02Question from "./scenes/Scene02Question";
import Scene03Reaction from "./scenes/Scene03Reaction";
import Scene04AcceptGift from "./scenes/Scene04AcceptGift";
import Scene05GiftSelection from "./scenes/Scene05GiftSelection";
import Scene06MemoryReveal from "./scenes/Scene06MemoryReveal";
import Scene07Wish from "./scenes/Scene07Wish";
import Scene08LetterCollage from "./scenes/Scene08LetterCollage";
import Scene09FinalMessage from "./scenes/Scene09FinalMessage";

export type SceneId =
  | "s01_envelope"
  | "s02_question"
  | "s03_reaction"
  | "s04_accept"
  | "s05_gifts"
  | "s06_memory"
  | "s07_wish"
  | "s08_letter"
  | "s09_final";

interface StoryData {
  recipientName: string;
  senderName: string;
  questionText: string;
  photo1: string;
  caption1: string;
  photo2?: string;
  caption2?: string;
  photo3?: string;
  caption3?: string;
  photo4?: string;
  caption4?: string;
  wishMessage: string;
  collageNote: string;
  finalMessage: string;
}

interface CinematicBirthdayExperienceProps {
  /** All the user's field values from the single page blueprint */
  fieldValues: Record<string, string>;
}

function normalizeData(fv: Record<string, string>): StoryData {
  return {
    recipientName: fv.recipientName || "You",
    senderName: fv.senderName || "Someone Special",
    questionText: fv.questionText || "Wanna see what I made?",
    photo1: fv.photo1 || "/1.png",
    caption1: fv.caption1 || "A special memory",
    photo2: fv.photo2,
    caption2: fv.caption2,
    photo3: fv.photo3,
    caption3: fv.caption3,
    photo4: fv.photo4,
    caption4: fv.caption4,
    wishMessage: fv.wishMessage || "Make a wish...",
    collageNote: fv.collageNote || "Every memory with you is one I'll treasure forever.",
    finalMessage: fv.finalMessage || "May all the good things you've been waiting for\nfinally find you this year.\n\nHappy Birthday. 🎂",
  };
}

export default function CinematicBirthdayExperience({ fieldValues }: CinematicBirthdayExperienceProps) {
  const [currentScene, setCurrentScene] = useState<SceneId>("s01_envelope");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const data = normalizeData(fieldValues);

  // Prefers reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  const goTo = useCallback((scene: SceneId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // Scenes handle their own exit animation, then call this.
    // We add a tiny delay so the exit tween has time to fire.
    setTimeout(() => {
      setCurrentScene(scene);
      setIsTransitioning(false);
    }, reducedMotion ? 0 : 50);
  }, [isTransitioning, reducedMotion]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" data-cinematic-birthday>
      {/* Reduced motion override */}
      {reducedMotion && (
        <style>{`
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        `}</style>
      )}

      {currentScene === "s01_envelope" && (
        <Scene01Envelope
          data={{ recipientName: data.recipientName, senderName: data.senderName }}
          onNext={() => goTo("s02_question")}
        />
      )}

      {currentScene === "s02_question" && (
        <Scene02Question
          data={{ recipientName: data.recipientName, questionText: data.questionText }}
          onYes={() => goTo("s04_accept")}
          onNo={() => goTo("s03_reaction")}
        />
      )}

      {currentScene === "s03_reaction" && (
        <Scene03Reaction
          data={{ recipientName: data.recipientName }}
          onTryAgain={() => goTo("s02_question")}
        />
      )}

      {currentScene === "s04_accept" && (
        <Scene04AcceptGift
          data={{ recipientName: data.recipientName }}
          onAccept={() => goTo("s05_gifts")}
        />
      )}

      {currentScene === "s05_gifts" && (
        <Scene05GiftSelection
          onGiftSelected={() => goTo("s06_memory")}
        />
      )}

      {currentScene === "s06_memory" && (
        <Scene06MemoryReveal
          data={{
            photo1: data.photo1,
            caption1: data.caption1,
            recipientName: data.recipientName,
          }}
          onNext={() => goTo("s07_wish")}
        />
      )}

      {currentScene === "s07_wish" && (
        <Scene07Wish
          data={{ wishMessage: data.wishMessage, recipientName: data.recipientName }}
          onNext={() => goTo("s08_letter")}
        />
      )}

      {currentScene === "s08_letter" && (
        <Scene08LetterCollage
          data={{
            photo1: data.photo1,
            caption1: data.caption1,
            photo2: data.photo2,
            caption2: data.caption2,
            photo3: data.photo3,
            caption3: data.caption3,
            photo4: data.photo4,
            caption4: data.caption4,
            collageNote: data.collageNote,
            recipientName: data.recipientName,
            senderName: data.senderName,
          }}
          onNext={() => goTo("s09_final")}
        />
      )}

      {currentScene === "s09_final" && (
        <Scene09FinalMessage
          data={{
            finalMessage: data.finalMessage,
            recipientName: data.recipientName,
            senderName: data.senderName,
          }}
          onReplay={() => goTo("s01_envelope")}
        />
      )}
    </div>
  );
}
