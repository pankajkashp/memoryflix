"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import FloatingParticles from "./FloatingParticles";

export default function LandingHero({ ctaHref, ctaText }: { ctaHref: string, ctaText: string }) {
  const [videoError, setVideoError] = useState(false);

  // =========================================================================
  // 🎬 CINEMATIC HERO VIDEO SETUP
  // =========================================================================
  // 1. Place your cinematic background video at: public/videos/hero.mp4
  // 2. Change `videoUrl` below to: "/videos/hero.mp4"
  // =========================================================================
  const videoUrl: string | null = null; // Set to null by default to prevent 404 console errors

  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden bg-black">
      {/* Cinematic Background Video (Only renders if videoUrl is set and hasn't errored) */}
      {videoUrl && !videoError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0 h-full w-full"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.25]"
            onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" onError={() => setVideoError(true)} />
          </video>
        </motion.div>
      )}

      {/* Dark Gradient Overlay for Readability & Cinematic Feel */}
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

      {/* Magical Floating Particles */}
      <FloatingParticles />

      {/* Hero Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 text-center lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Apple-like smooth spring
          className="mx-auto max-w-4xl"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-2xl">
            Every Memory{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Deserves A Premiere
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg text-zinc-300 max-w-2xl mx-auto sm:text-xl leading-relaxed drop-shadow-md font-medium"
          >
            Turn your love stories, weddings, travels and special moments into cinematic stories worth watching forever.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            {/* Primary CTA - Solid with subtle glow */}
            <Link
              href={ctaHref}
              className="group relative inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="absolute -inset-1 rounded-full bg-white/20 blur-md transition-all group-hover:bg-white/40 group-hover:blur-lg opacity-0 group-hover:opacity-100"></span>
              <span className="relative flex items-center gap-2">
                ❤️ Create Our Story
              </span>
            </Link>

            {/* Secondary CTA - Glassmorphism */}
            <Link
              href="/demo"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 text-lg font-medium text-white transition-all hover:bg-white/10 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              ▶ Watch Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-500"
      >
        <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent"
        ></motion.div>
      </motion.div>
    </section>
  );
}
