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
import PickRevealPage from "@/components/story-pages/PickRevealPage";
import ScratchRevealPage from "@/components/story-pages/ScratchRevealPage";

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
    id: "scratch-reveal",
    name: "2. Scratch & Reveal (Foil Opener)",
    component: ScratchRevealPage,
    fixedConfig: {
      backgroundColor: "#F7F2EA",
      textColor: "#2D1822",
      accentColor: "#f43f5e",
      accentTextColor: "#e11d48",
      cardBg: "rgba(255, 255, 255, 0.96)",
      backgroundTexture: "paper-grain",
    },
    data: {
      title: "A Secret Story For You 💖",
      subtitle: "Someone created a mystery just for you",
      secretMessage:
        "Every great memory begins with a spark.\nUnfold the surprises waiting for you inside!",
      sender: "MysteryFlix Surprise 🎁",
      photoUrl: "/2.png",
    },
  },
  {
    id: "search",
    name: "3. Search Results",
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
          title: "Midnight Gelato in Rome",
          caption: "Laughter echoes through cobblestone streets.",
        },
        {
          url: "/3.png",
          title: "Sunrise at Mount Rigi",
          caption: "Wrapped in blankets, watching the world wake up.",
        },
      ],
    },
  },
  {
    id: "definition",
    name: "4. Definition Page",
    component: DefinitionPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#ec4899",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "dots",
    },
    data: {
      word: "Aethelgard",
      partOfSpeech: "noun",
      phonetic: "/ˈeɪ.θəl.ɡɑːrd/",
      definition:
        "The quiet certainty that wherever you are in the world, you are already home as long as you're with them.",
      exampleSentence:
        '"Standing in the crowded station, she realized she had found her aethelgard."',
      photoUrl: "/2.png",
    },
  },
  {
    id: "notification",
    name: "5. Priority Notification",
    component: NotificationPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#f43f5e",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "subtle-noise",
    },
    data: {
      sender: "Rohan 💌",
      time: "11:11 PM",
      notificationTitle: "SPECIAL DELIVERY",
      notificationText: "A secret memory has arrived on your screen.",
      replyText:
        "Unlocked: 1,000 warm hugs and a lifetime subscription to my unconditional love ❤️",
    },
  },
  {
    id: "labeled-photo-beige",
    name: "6. Labeled Photo (Aesthetic Beige #F7F2EA)",
    component: LabeledPhotoPage,
    fixedConfig: {
      backgroundColor: "#F7F2EA",
      textColor: "#2D1822",
      accentColor: "#f43f5e",
      cardBg: "rgba(255, 255, 255, 0.96)",
      backgroundTexture: "paper-grain",
    },
    data: {
      title: "Anatomy of a Perfect Day",
      subtitle: "Every little detail captured in time",
      photoUrl: "/2.png",
      labels: [
        {
          text: "Your genuine bright smile",
          target: { x: 48, y: 32 },
          labelPos: { x: 20, y: 20 },
          badge: "Highlight",
        },
        {
          text: "The sunlit view behind us",
          target: { x: 75, y: 30 },
          labelPos: { x: 78, y: 15 },
        },
        {
          text: "Uncontrollable laughter",
          target: { x: 50, y: 68 },
          labelPos: { x: 22, y: 75 },
        },
        {
          text: "A memory we will keep forever",
          target: { x: 80, y: 65 },
          labelPos: { x: 75, y: 78 },
        },
      ],
    },
  },
  {
    id: "loading",
    name: "7. Loading / Reward",
    component: LoadingPage,
    fixedConfig: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      accentColor: "#a855f7",
      cardBg: "rgba(24, 24, 27, 0.9)",
      backgroundTexture: "soft-stripes",
    },
    data: {
      loadingLabel: "CALCULATING COMPATIBILITY...",
      awardTitle: "BEST DUO IN THE UNIVERSE",
      rewardText:
        "100% certified bond rating. You two are officially unstoppable.",
      subtitle: "Presented with endless admiration and love",
    },
  },
  {
    id: "certificate",
    name: "8. Certificate",
    component: CertificatePage,
    fixedConfig: {
      backgroundColor: "#0a0a0f",
      textColor: "#ffffff",
      accentColor: "#f59e0b",
      cardBg: "rgba(18, 18, 26, 0.95)",
      backgroundTexture: "luxury-moire",
    },
    data: {
      title: "CERTIFICATE OF ETERNAL LOVE",
      recipientName: "Ananya Sharma",
      message:
        "For bringing endless warmth, laughter, and magic into my life every single day. This certificate is valid for eternity.",
      issuer: "Rohan Kapoor",
      date: "October 14, 2024",
      certificateNo: "MFLX-2024-8891",
    },
  },
  {
    id: "pick-reveal-bears",
    name: "9. Pick & Reveal (Bears - Pink)",
    component: PickRevealPage,
    fixedConfig: {
      backgroundColor: "#FFD6E8",
      textColor: "#2A0E1C",
      accentColor: "#f43f5e",
      accentTextColor: "#e11d48",
      cardBg: "rgba(255, 255, 255, 0.95)",
      backgroundTexture: "paper-grain",
      characterSet: "bears",
    },
    data: {
      prompt: "Pick one to open 🐻",
      option1Text: "You have the warmest energy in any room we walk into ✨",
      option1Photo: "/1.png",
      option2Text: "Remember our midnight conversations? They're my favorite memories 🌙",
      option2Photo: "/2.png",
      option3Text: "Through every high and low, I am forever grateful for you ❤️",
      option3Photo: "/3.png",
    },
  },
  {
    id: "pick-reveal-bottles",
    name: "10. Pick & Reveal (Bottles - Pink)",
    component: PickRevealPage,
    fixedConfig: {
      backgroundColor: "#FFD6E8",
      textColor: "#2A0E1C",
      accentColor: "#0d9488",
      accentTextColor: "#0f766e",
      cardBg: "rgba(255, 255, 255, 0.95)",
      backgroundTexture: "linen",
      characterSet: "bottles",
    },
    data: {
      prompt: "Pick a bottle to uncork its secret 🍾",
      option1Text: "Wandering with you makes every ordinary street look like an adventure 🌊",
      option1Photo: "/2.png",
      option2Text: "Here's to a hundred more road trips with horrible singing and great memories 🚗",
      option2Photo: "/3.png",
      option3Text: "May every wish you whisper to the stars come true this year 💫",
      option3Photo: "/1.png",
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
