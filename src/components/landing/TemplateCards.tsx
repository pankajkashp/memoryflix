"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ─── Template data ─────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    emoji: "❤️",
    title: "Love Story",
    subtitle: "For couples and relationships",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop",
    bottomGradient: "from-rose-900/90 via-rose-900/30",
    borderHover: "group-hover:border-rose-500/40",
    accentText: "text-rose-300",
    btnClass:
      "border-rose-400/50 text-rose-200 hover:bg-rose-500/20 hover:border-rose-400",
  },
  {
    emoji: "💍",
    title: "Wedding Film",
    subtitle: "Relive your wedding forever",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop",
    bottomGradient: "from-amber-900/90 via-amber-900/30",
    borderHover: "group-hover:border-amber-400/40",
    accentText: "text-amber-300",
    btnClass:
      "border-amber-400/50 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400",
  },
  {
    emoji: "✈️",
    title: "Travel Journal",
    subtitle: "Turn adventures into stories",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop",
    bottomGradient: "from-sky-900/90 via-sky-900/30",
    borderHover: "group-hover:border-sky-500/40",
    accentText: "text-sky-300",
    btnClass:
      "border-sky-400/50 text-sky-200 hover:bg-sky-500/20 hover:border-sky-400",
  },
  {
    emoji: "🎂",
    title: "Birthday Memories",
    subtitle: "Celebrate life's milestones",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&auto=format&fit=crop",
    bottomGradient: "from-purple-900/90 via-purple-900/30",
    borderHover: "group-hover:border-purple-500/40",
    accentText: "text-purple-300",
    btnClass:
      "border-purple-400/50 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function TemplateCards({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="bg-[#080808] py-24 sm:py-32 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-rose-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="text-center mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400/60" />
            <span className="text-xs uppercase tracking-[0.32em] text-rose-400/80 font-semibold">
              Choose your story
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400/60" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
          >
            What&apos;s your story?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-zinc-400 text-lg max-w-md mx-auto"
          >
            Every memory deserves the right frame.
          </motion.p>
        </div>

        {/* ── 2×2 card grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {TEMPLATES.map((tpl, i) => (
            <motion.div
              key={tpl.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/5 ${tpl.borderHover} transition-all duration-500 cursor-pointer`}
            >
              {/* ── Background image with Ken-Burns zoom ─────────────────── */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: `url(${tpl.image})` }}
              />

              {/* ── Base dark overlay ────────────────────────────────────── */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />

              {/* ── Coloured bottom gradient ─────────────────────────────── */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${tpl.bottomGradient} to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
              />

              {/* ── Strong bottom vignette for text legibility ───────────── */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

              {/* ── Content ──────────────────────────────────────────────── */}
              <div className="absolute inset-0 p-7 sm:p-10 flex flex-col justify-end">
                <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  {/* Emoji */}
                  <span className="text-3xl block mb-3 drop-shadow-md">
                    {tpl.emoji}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight drop-shadow-lg">
                    {tpl.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-sm font-medium mb-6 ${tpl.accentText}`}>
                    {tpl.subtitle}
                  </p>

                  {/* CTA — reveals on hover */}
                  <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <Link
                      href={ctaHref}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-sm text-sm font-semibold transition-all duration-300 hover:scale-105 ${tpl.btnClass}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Use This Template
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
