"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Scene09Props {
  data: {
    finalMessage: string;
    recipientName: string;
    senderName: string;
  };
  onReplay: () => void;
}

function FloatingDeco({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span
      className="absolute text-2xl sm:text-3xl pointer-events-none select-none"
      style={{ ...style, animation: `float ${2 + Math.random() * 1.5}s ease-in-out infinite alternate` }}
    >
      {emoji}
    </span>
  );
}

export default function Scene09FinalMessage({ data, onReplay }: Scene09Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const fromRef = useRef<HTMLParagraphElement>(null);
  const decoRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  // Split message into lines for staggered reveal
  const lines = data.finalMessage
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((l) => l.trim());

  const decorations = [
    { emoji: "✨", style: { top: "8%", left: "6%", opacity: 0.5 } },
    { emoji: "🌸", style: { top: "15%", right: "8%", opacity: 0.5 } },
    { emoji: "💫", style: { bottom: "25%", left: "4%", opacity: 0.4 } },
    { emoji: "🎂", style: { bottom: "20%", right: "5%", opacity: 0.45 } },
    { emoji: "💕", style: { top: "40%", left: "3%", opacity: 0.35 } },
    { emoji: "🎈", style: { top: "35%", right: "4%", opacity: 0.4 } },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Background settles
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" })
        // Lines reveal one by one
        .fromTo(
          linesRef.current.filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.3,
            ease: "power2.out",
          },
          "-=0.2"
        )
        // From line
        .fromTo(fromRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.1")
        // Decorations stagger in
        .fromTo(decoRef.current?.children || [],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2)" },
          "-=0.3"
        )
        // Brand
        .fromTo(brandRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
        // Replay
        .fromTo(replayRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleReplay = () => {
    const tl = gsap.timeline({ onComplete: onReplay });
    tl.to(containerRef.current, { scale: 0.95, opacity: 0, duration: 0.5, ease: "power3.in" });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center px-8 sm:px-12 bg-gradient-to-br from-[#0d0d0d] via-[#1a0a1e] to-[#0d0d0d] overflow-hidden select-none"
    >
      {/* Floating decorations */}
      <div ref={decoRef} className="absolute inset-0 pointer-events-none">
        {decorations.map((d, i) => (
          <FloatingDeco key={i} emoji={d.emoji} style={d.style} />
        ))}
      </div>

      {/* Main text block */}
      <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md w-full text-center space-y-4 sm:space-y-5">
        {lines.map((line, idx) => (
          <span
            key={idx}
            ref={(el) => { linesRef.current[idx] = el; }}
            className="block text-2xl sm:text-3xl md:text-4xl font-serif text-white/90 leading-snug"
          >
            {line}
          </span>
        ))}
      </div>

      {/* From */}
      <p
        ref={fromRef}
        className="relative z-10 mt-10 sm:mt-12 font-mono text-sm tracking-[0.2em] uppercase text-rose-400/80"
      >
        — with love, {data.senderName}
      </p>

      {/* Replay button */}
      <button
        ref={replayRef}
        onClick={handleReplay}
        className="relative z-10 mt-8 min-h-[44px] px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs font-mono tracking-widest uppercase hover:bg-white/15 hover:text-white/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
        aria-label="Replay the story from the beginning"
      >
        ↩ replay story
      </button>

      {/* MemoryFlix brand */}
      <div ref={brandRef} className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <span className="font-bold text-xs bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent tracking-wide opacity-60">
          Made with MemoryFlix ♡
        </span>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(-5deg); }
          to { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
