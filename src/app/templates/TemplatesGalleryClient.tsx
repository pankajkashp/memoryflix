"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Star,
  Film,
  Heart,
  Compass,
  PartyPopper,
  Filter,
} from "lucide-react";
import AtmosphericBackground from "@/components/common/AtmosphericBackground";
import MagneticButton from "@/components/ui/MagneticButton";

interface TemplatePage {
  id: string;
  position: number;
  componentKey: string;
}

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  previewUrl: string;
  pages: TemplatePage[];
}

interface TemplatesGalleryClientProps {
  templates: TemplateItem[];
}

export default function TemplatesGalleryClient({
  templates,
}: TemplatesGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!templates.length) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-rose-500/30 overflow-x-hidden">
        <AtmosphericBackground glowColor="multi" />

        <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="max-w-xl rounded-[28px] border border-white/10 bg-white/[0.02] px-8 py-10 text-center shadow-[0_0_40px_rgba(244,63,94,0.12)] backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-2xl shadow-[0_0_25px_rgba(244,63,94,0.18)]">
              ✨
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Template library is being refreshed</h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              The previous template gallery has been removed while the new interactive design is prepared.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map((t) => t.category))).filter(
      Boolean
    );
    return ["All", ...cats];
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "All") return templates;
    return templates.filter(
      (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [templates, selectedCategory]);

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "romantic":
      case "love":
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case "travel":
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case "birthday":
      case "celebration":
        return <PartyPopper className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Film className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // Headline word stagger
  const headlineWords1 = ["Pick", "a", "Template."];
  const headlineWords2 = ["Create", "Magic", "in", "Minutes."];

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-rose-500/30 overflow-x-hidden">
      {/* ── 1. Lightweight Ambient Glow + Dot Texture Background ──────── */}
      <AtmosphericBackground glowColor="multi" />

      {/* ── 2. Top Navigation Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/60 border-b border-white/[0.08] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo with magnetic subtle response */}
          <MagneticButton href="/" strength={0.15}>
            <div className="flex items-center gap-2.5 py-1 px-2 rounded-xl transition-colors hover:bg-white/[0.04]">
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                Memory<span className="text-rose-500">Flix</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 font-mono font-medium">
                Gallery
              </span>
            </div>
          </MagneticButton>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Magnetic 'Find My Story' CTA */}
            <MagneticButton href="/recover" strength={0.28}>
              <div className="group relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-rose-400/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform duration-300" />
                <span>Find My Story</span>
              </div>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* ── 3. Hero Section with Staggered Entrance ────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-28 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-5">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-amber-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.15)] backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Curated Interactive Experiences</span>
          </motion.div>

          {/* Staggered Entrance Headline with Display Serif Accent */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1">
              {headlineWords1.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.65,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <div className="w-full h-0" />
              {headlineWords2.map((word, i) => {
                const isMagic = word === "Magic";
                return (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.35 + i * 0.09,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={
                      isMagic
                        ? "font-serif italic font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 drop-shadow-[0_4px_16px_rgba(244,63,94,0.4)] px-1 relative inline-block"
                        : "inline-block"
                    }
                    style={
                      isMagic
                        ? { fontFamily: "var(--font-playfair), Georgia, serif" }
                        : undefined
                    }
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
            className="text-base sm:text-lg text-zinc-300/90 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Turn your shared jokes, polaroids, and heartfelt notes into an
            unforgettable interactive premiere. No video editing skills needed.
          </motion.p>

          {/* ── Category Filter Pills ──────────────────────────────────── */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "text-white bg-white/[0.12] border border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                        : "text-zinc-400 bg-white/[0.03] border border-white/[0.06] hover:text-zinc-200 hover:bg-white/[0.07] hover:border-white/[0.15]"
                    }`}
                  >
                    {cat !== "All" && getCategoryIcon(cat)}
                    <span>{cat}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="activeCategoryGlow"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 -z-10 blur-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* ── 4. Templates Grid with Staggered Entrance & Liquid CTAs ────── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8"
          >
            {filteredTemplates.map((tpl) => {
              const priceInRupees = Math.round(tpl.price / 100);

              return (
                <motion.div
                  key={tpl.id}
                  variants={itemVariants}
                  layout
                  className="group relative"
                >
                  {/* Subtle hover backlight glow */}
                  <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-rose-500/0 via-purple-500/0 to-amber-500/0 group-hover:from-rose-500/35 group-hover:via-pink-500/25 group-hover:to-purple-500/35 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

                  {/* Main Card Shell */}
                  <Link
                    href={`/templates/${tpl.slug}`}
                    className="relative rounded-[26px] overflow-hidden border border-white/[0.12] bg-zinc-950/80 group-hover:border-rose-500/40 backdrop-blur-2xl flex flex-col transition-all duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_25px_60px_rgba(244,63,94,0.18)]"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900">
                      <Image
                        src={tpl.previewUrl || "/1.png"}
                        alt={tpl.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Rich gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                      {/* Category Tag with Distinctive Chamfered Geometry */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md text-[11px] font-semibold uppercase tracking-wider bg-black/75 backdrop-blur-md border border-white/[0.18] text-zinc-200 shadow-md">
                          {getCategoryIcon(tpl.category)}
                          {tpl.category}
                        </span>
                      </div>

                      {/* Price Tag with Pill Geometry */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/40 border border-white/20">
                          ₹{priceInRupees}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors duration-300">
                            {tpl.name}
                          </h2>
                          <span className="shrink-0 text-xs font-mono text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                            {tpl.pages.length} Pages
                          </span>
                        </div>

                        <p className="text-sm text-zinc-300/80 line-clamp-2 leading-relaxed font-normal">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Card Footer with Distinctive Liquid-Morph CTA */}
                      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Instant Delivery</span>
                        </div>

                        {/* Distinctive Liquid Morphing Button CTA */}
                        <div className="relative inline-flex items-center justify-center">
                          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl group-hover:rounded-2xl bg-rose-500/10 group-hover:bg-rose-500 text-rose-300 group-hover:text-white border border-rose-500/30 group-hover:border-transparent text-xs font-semibold transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.45)] group-hover:scale-105">
                            <span>Preview & Create</span>
                            <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state fallback */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-zinc-300">
              No templates in this category yet
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              Check back soon or select "All" to browse all experiences.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-rose-500 text-white hover:bg-rose-400 transition-colors"
            >
              Show All Templates
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
