"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  ArrowLeft,
} from "lucide-react";

import LetterPage from "@/components/story-pages/LetterPage";
import SearchResultsPage from "@/components/story-pages/SearchResultsPage";
import DefinitionPage from "@/components/story-pages/DefinitionPage";
import NotificationPage from "@/components/story-pages/NotificationPage";
import LabeledPhotoPage from "@/components/story-pages/LabeledPhotoPage";
import LoadingPage from "@/components/story-pages/LoadingPage";
import CertificatePage from "@/components/story-pages/CertificatePage";

const PAGES = [
  {
    id: "letter",
    name: "1. Letter Page",
    component: LetterPage,
    fixedConfig: {
      backgroundColor: "#0c0a09",
      textColor: "#f5f5f4",
      accentColor: "#f43f5e",
      cardBg: "rgba(28, 25, 23, 0.9)",
      backgroundTexture: "paper-grain",
    },
    data: {
      date: "October 14, 2024",
      recipientName: "Ananya",
      senderName: "Rohan",
      message:
        "From the first coffee in Mumbai to late night walks under the Paris sky, every single second with you has felt like a dream I never want to wake up from.\n\nThank you for loving me with all your heart.",
      photoUrl: "/1.png",
    },
  },
  {
    id: "search",
    name: "2. Search Results",
    component: SearchResultsPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#3b82f6",
      cardBg: "rgba(24, 24, 27, 0.85)",
      backgroundTexture: "subtle-noise",
    },
    data: {
      searchQuery: "what does true happiness look like?",
      resultsCount: "Found 4 unforgettable chapters",
      photos: [
        {
          url: "/1.png",
          title: "Golden Hour in Tuscany",
          caption: "When the sky mirrored our smiles.",
        },
        {
          url: "/2.png",
          title: "First Mountain Summit",
          caption: "Cold hands, warmest hearts.",
        },
        {
          url: "/3.png",
          title: "By the Campfire",
          caption: "Singing old acoustic songs till dawn.",
        },
      ],
    },
  },
  {
    id: "definition",
    name: "3. Definition Page",
    component: DefinitionPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#f4f4f5",
      accentColor: "#ec4899",
      cardBg: "rgba(24, 24, 27, 0.85)",
      backgroundTexture: "subtle-noise",
    },
    data: {
      word: "Serendipity",
      phonetic: "/ˌsɛr(ə)nˈdɪpɪti/",
      partOfSpeech: "noun",
      definition:
        "The occurrence of finding valuable and delightful things by chance. Or simply, walking into a bookstore on a rainy Tuesday and meeting you.",
      exampleSentence:
        "They say serendipity is rare, but with you, it became our daily reality.",
      photoUrl: "/2.png",
    },
  },
  {
    id: "notification",
    name: "4. Notification Page",
    component: NotificationPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#f43f5e",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "soft-stripes",
    },
    data: {
      sender: "MemoryFlix",
      time: "A reminder from Rohan",
      notificationTitle: "You have 1 new priority delivery 💌",
      notificationText:
        "Hey you! Just a reminder that you are the most incredible person in my entire universe. Tap here to open your heart.",
      replyText:
        "Unlocked: 1,000 warm hugs and a lifetime subscription to my unconditional love ❤️",
    },
  },
  {
    id: "labeled-photo",
    name: "5. Labeled Photo Page",
    component: LabeledPhotoPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#ec4899",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "canvas",
    },
    data: {
      title: "Anatomy of Our Perfect Evening",
      subtitle: "The little details I will remember when we are eighty",
      photoUrl: "/1.png",
      labels: [
        {
          text: "The look you gave me before we danced",
          target: { x: 48, y: 32 },
          labelPos: { x: 20, y: 20 },
          badge: "Highlight",
        },
        {
          text: "The golden lights reflecting on the water",
          target: { x: 75, y: 30 },
          labelPos: { x: 78, y: 15 },
        },
        {
          text: "When you held my hand tightly",
          target: { x: 50, y: 68 },
          labelPos: { x: 22, y: 75 },
        },
        {
          text: "The song playing in the background",
          target: { x: 80, y: 65 },
          labelPos: { x: 75, y: 78 },
        },
      ],
    },
  },
  {
    id: "loading",
    name: "6. Loading / Reward",
    component: LoadingPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#eab308",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "subtle-noise",
    },
    data: {
      loadingLabel: "CALCULATING COMPATIBILITY SCORE...",
      awardTitle: "THE WORLD'S GREATEST PARTNER AWARD",
      rewardText:
        "After calculating 10,000 moments, 4,000 shared laughs, and countless coffees: You have achieved a flawless 100% compatibility rating.",
      subtitle: "Presented with infinite admiration & joy",
    },
  },
  {
    id: "certificate",
    name: "7. Certificate Page",
    component: CertificatePage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#f5f5f4",
      accentColor: "#eab308",
      cardBg: "rgba(20, 20, 24, 0.95)",
      backgroundTexture: "linen",
    },
    data: {
      title: "Certificate of Infinite Love",
      recipientName: "Ananya Sharma",
      message:
        "For bringing endless warmth, laughter, and magic into my life every single day. This certificate is valid for eternity.",
      issuer: "Rohan Kapoor",
      date: "October 14, 2024",
      certificateNo: "MFLX-2024-8891",
    },
  },
];

export default function PagesPreviewDevRoute() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isTransitioningRef = useRef(false);

  const currentPage = PAGES[currentIndex];
  const Component = currentPage.component;

  const handleAdvance = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % PAGES.length);
      setIsExiting(false);
      setAnimKey((k) => k + 1);
      isTransitioningRef.current = false;
    }, 320);
  };

  const handlePrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + PAGES.length) % PAGES.length);
      setIsExiting(false);
      setAnimKey((k) => k + 1);
      isTransitioningRef.current = false;
    }, 250);
  };

  const handleReplay = () => {
    setAnimKey((k) => k + 1);
  };

  const handleSelect = (idx: number) => {
    if (isTransitioningRef.current) return;
    setCurrentIndex(idx);
    setAnimKey((k) => k + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "r" || e.key === "R") {
        handleReplay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-rose-500/30">
      {/* Top Dev Bar */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              Template Blueprint Page Components Preview
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors"
            title="Replay Animation (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
          <span className="text-xs font-mono text-zinc-400 px-2">
            {currentIndex + 1} / {PAGES.length}
          </span>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdvance}
            disabled={currentIndex === PAGES.length - 1}
            className="p-1.5 rounded-lg bg-rose-500 text-white disabled:opacity-30 hover:bg-rose-400 transition-colors"
            title="Next (Right Arrow / Space / Tap)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Component Navigation Chips */}
      <div className="border-b border-white/5 bg-zinc-950/40 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {PAGES.map((page, idx) => (
          <button
            key={page.id}
            onClick={() => handleSelect(idx)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
              currentIndex === idx
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Main Preview Screen (Click anywhere to advance) */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 relative overflow-hidden">
        <div
          onClick={handleAdvance}
          className="w-full max-w-5xl aspect-auto sm:min-h-[640px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative flex cursor-pointer"
        >
          <Component
            key={animKey}
            fixedConfig={currentPage.fixedConfig}
            data={currentPage.data as any}
            isActive={true}
            isExiting={isExiting}
          />
        </div>
      </main>

      {/* Footer Navigation Bar */}
      <footer className="border-t border-white/10 bg-zinc-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
        <div>
          Current Component:{" "}
          <span className="font-semibold text-zinc-300">
            {currentPage.name}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Click anywhere or use keyboard ← / → to advance</span>
          <span>Press R to replay entrance</span>
        </div>
      </footer>
    </div>
  );
}
