"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import FloatingParticles from "./FloatingParticles";

// ─── Curated memory collage photos ─────────────────────────────────────────
// 6 emotionally resonant Unsplash images — always shown as the base layer.
// The hero.mp4 video (if present) fades in on top of this collage.
const COLLAGE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop",
    alt: "Wedding couple",
    delay: 0,
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop",
    alt: "Romantic moment",
    delay: 0.15,
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop",
    alt: "Travel memories",
    delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop",
    alt: "Anniversary",
    delay: 0.1,
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop",
    alt: "Wedding ceremony",
    delay: 0.25,
  },
  {
    src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop",
    alt: "Family moment",
    delay: 0.2,
  },
];

// ─── Hero copy — emotional, human, not SaaS ─────────────────────────────────
const HEADLINE_TOP = "Your love story.";
const HEADLINE_BOTTOM = "Finally on screen.";
const SUB_COPY =
  "The photos are in your camera roll. The videos are in a group chat.\nBring them back — beautifully, forever — in one cinematic story.";

export default function LandingHero({
  ctaHref,
  ctaText,
}: {
  ctaHref: string;
  ctaText: string;
}) {
  const [videoError, setVideoError] = useState(false);

  // ─── HERO VIDEO ────────────────────────────────────────────────────────────
  // Place your hero video at: public/videos/hero.mp4
  // The collage always shows — the video fades in over it when available.
  const videoUrl = "/videos/hero.mp4";
  const showVideo = !videoError;

  return (
    <section className="relative flex h-screen min-h-[680px] w-full items-center justify-center overflow-hidden">
      {/* ── Layer 0: Memory Collage (always visible, base layer) ───────────── */}
      <div className="absolute inset-0 z-0">
        {/* 3×2 asymmetric mosaic grid */}
        <div
          className="h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1.2fr",
            gridTemplateRows: "1fr 1fr",
            gap: "3px",
          }}
        >
          {COLLAGE_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              className="relative overflow-hidden"
              // Row 0 col 0 spans 2 rows for the hero anchor photo
              style={
                i === 0
                  ? { gridRow: "1 / 3" }
                  : {}
              }
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                opacity: { duration: 1.8, delay: img.delay },
                scale: { duration: 8, delay: img.delay, ease: "linear" },
              }}
            >
              {/* Slow-zoom Ken Burns animation */}
              <motion.img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                animate={{ scale: [1, 1.06] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: i * 1.5,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Layer 1: Cinematic hero.mp4 (fades in over collage if available) ── */}
      {showVideo && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* ── Layer 2: Cinematic overlay stack ──────────────────────────────── */}
      {/* Base darkening — collage needs to be moody, not bright */}
      <div className="absolute inset-0 z-[2] bg-black/60" />
      {/* Vignette: strong bottom-to-top — ensures text is always readable */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/75 to-black/20" />
      {/* Left + right side shadows — cinematic letterbox feel */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      {/* Top shadow for nav contrast */}
      <div className="absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-black/80 to-transparent" />

      {/* ── Layer 3: Particles ─────────────────────────────────────────────── */}
      <FloatingParticles />

      {/* ── Layer 4: Hero Content ─────────────────────────────────────────── */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 mt-32 sm:mt-0 text-center lg:px-8">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-8 flex items-center justify-center gap-3"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400/70" />
          <span className="text-xs uppercase tracking-[0.35em] text-rose-300/90 font-semibold">
            For the moments that matter
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400/70" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto"
        >
          {/* Main headline — two lines, large serif-weight impact */}
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl drop-shadow-2xl leading-[1.05] pb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-rose-50 to-white/60">
              {HEADLINE_TOP}
            </span>
            <br />
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 relative inline-block"
              style={{ filter: "drop-shadow(0 0 20px rgba(244,63,94,0.3))" }}
            >
              {HEADLINE_BOTTOM}
            </span>
          </h1>

          {/* Emotional sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 sm:mt-8 text-base sm:text-lg text-zinc-300/90 max-w-xl mx-auto leading-relaxed drop-shadow-md whitespace-pre-line"
          >
            {SUB_COPY}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary — rose glow CTA */}
            <Link
              href={ctaHref}
              className="group relative inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-9 text-base font-semibold text-white shadow-lg shadow-rose-600/40 transition-all hover:scale-105 hover:shadow-rose-500/60 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              {/* Animated glow ring */}
              <span className="absolute -inset-1 rounded-full bg-rose-500/30 blur-md opacity-0 transition-all group-hover:opacity-100 group-hover:blur-lg" />
              <span className="relative flex items-center gap-2.5">
                <svg
                  className="w-4 h-4 fill-white opacity-90"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                </svg>
                {ctaText}
              </span>
            </Link>

            {/* Secondary — glassmorphism */}
            <Link
              href="/demo"
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 text-base font-medium text-white/90 transition-all hover:bg-white/10 hover:border-white/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <svg
                className="w-4 h-4 fill-white/80 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch a Story
            </Link>
          </motion.div>

          {/* Social proof micro-line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-zinc-500 tracking-wide"
          >
            No credit card · Free forever · Your memories, your privacy
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-zinc-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
