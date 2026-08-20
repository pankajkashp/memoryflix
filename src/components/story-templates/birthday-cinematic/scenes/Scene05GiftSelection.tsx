"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface GiftItem {
  emoji: string;
  label: string;
  color: string;
  rotation: number;
}

interface Scene05Props {
  onGiftSelected: (giftIdx: number) => void;
}

const GIFTS: GiftItem[] = [
  { emoji: "🎁", label: "Memory", color: "from-rose-400 to-pink-500", rotation: -6 },
  { emoji: "🎀", label: "Surprise", color: "from-violet-400 to-purple-500", rotation: 4 },
  { emoji: "💝", label: "Moment", color: "from-amber-400 to-orange-500", rotation: -3 },
];

export default function Scene05GiftSelection({ onGiftSelected }: Scene05Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const giftRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.1")
        .fromTo(giftRefs.current,
          { y: 80, scale: 0.5, opacity: 0, rotation: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        )
        .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.1");

      // Apply individual rotations after entrance
      giftRefs.current.forEach((el, i) => {
        if (!el) return;
        // Gentle hover-like animation
        gsap.to(el, {
          y: -8,
          rotation: GIFTS[i].rotation,
          duration: 1.5 + i * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGiftClick = (idx: number) => {
    if (isSelecting) return;
    setIsSelecting(true);

    const selectedEl = giftRefs.current[idx];
    const otherEls = giftRefs.current.filter((_, i) => i !== idx);

    // Kill floating animations
    giftRefs.current.forEach(el => el && gsap.killTweensOf(el));

    const tl = gsap.timeline({ onComplete: () => onGiftSelected(idx) });

    // Others scatter and fade
    tl.to(otherEls, {
      x: (i) => (i === 0 ? -200 : 200),
      y: 50,
      scale: 0.5,
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      stagger: 0.05,
    })
    // Selected moves to center, wobbles, then lid pops
    .to(selectedEl, {
      x: () => {
        const rect = selectedEl!.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        return centerX - rect.left - rect.width / 2;
      },
      y: () => {
        const rect = selectedEl!.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        return centerY - rect.top - rect.height / 2;
      },
      scale: 1.4,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.3")
    // Wobble
    .to(selectedEl, { rotation: -10, duration: 0.1 })
    .to(selectedEl, { rotation: 10, duration: 0.1 })
    .to(selectedEl, { rotation: 0, duration: 0.1 })
    // Scale explode out
    .to(selectedEl, { scale: 3, opacity: 0, duration: 0.4, ease: "power3.in" })
    // Whole container fades
    .to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center gap-8 sm:gap-12 px-6 bg-gradient-to-br from-fuchsia-50 via-pink-50 to-amber-50 select-none"
    >
      {/* Title */}
      <div ref={titleRef} className="text-center space-y-1">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-pink-400/70">gifts for you</p>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-800 uppercase tracking-tight">
          Pick one to open 🎁
        </h1>
      </div>

      {/* Gifts row */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16">
        {GIFTS.map((gift, idx) => (
          <button
            key={idx}
            ref={(el) => { giftRefs.current[idx] = el; }}
            onClick={() => handleGiftClick(idx)}
            disabled={isSelecting}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${gift.color} shadow-2xl flex flex-col items-center justify-center gap-1 border-2 border-white/40 cursor-pointer hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-default`}
            aria-label={`Open ${gift.label} gift`}
            style={{ transform: `rotate(${gift.rotation}deg)` }}
          >
            {/* Ribbon cross */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-white/25 rounded-full" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-white/25 rounded-full" />
            {/* Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex">
              <div className="w-4 h-5 border-2 border-white/60 rounded-tl-full rounded-bl-full rotate-[30deg] translate-x-1 bg-white/30" />
              <div className="w-4 h-5 border-2 border-white/60 rounded-tr-full rounded-br-full -rotate-[30deg] -translate-x-1 bg-white/30" />
            </div>
            <span className="text-3xl sm:text-4xl z-10">{gift.emoji}</span>
            <span className="text-white/80 font-bold text-[10px] uppercase tracking-wider z-10">{gift.label}</span>
          </button>
        ))}
      </div>

      <p ref={hintRef} className="font-mono text-xs tracking-wider text-zinc-400/70 text-center">
        click any gift to reveal your surprise
      </p>
    </div>
  );
}
