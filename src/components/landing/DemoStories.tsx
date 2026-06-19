"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ─── Demo story data ────────────────────────────────────────────────────────
const STORIES = [
  {
    emoji: "❤️",
    title: "Mayank & Aditi",
    category: "Love Story",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&auto=format&fit=crop",
    href: "/demo",
  },
  {
    emoji: "💍",
    title: "Rahul Weds Priya",
    category: "Wedding Film",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&auto=format&fit=crop",
    href: "/demo",
  },
  {
    emoji: "✈️",
    title: "Goa Memories",
    category: "Travel Journal",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop",
    href: "/demo",
  },
  {
    emoji: "🎂",
    title: "Mom's 50th Birthday",
    category: "Birthday Memories",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&auto=format&fit=crop",
    href: "/demo",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function DemoStories() {
  return (
    <section className="bg-black py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle purple glow from top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Header row ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-purple-400/60" />
              <span className="text-xs uppercase tracking-[0.32em] text-purple-400/80 font-semibold">
                Real stories
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
            >
              Watch Real Stories
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-3 text-zinc-400 text-base max-w-sm"
            >
              See exactly what MemoryFlix creates.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link
              href="/demo"
              className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              See all stories
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Netflix-style card row ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer"
            >
              {/* Cover image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                style={{ backgroundImage: `url(${story.image})` }}
              />

              {/* Progressive dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Top emoji badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-2xl drop-shadow-lg">{story.emoji}</span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase mb-1.5">
                  {story.category}
                </p>
                <h3 className="text-lg font-bold text-white mb-4 leading-tight">
                  {story.title}
                </h3>

                {/* Watch button — slides up on hover */}
                <Link
                  href={story.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 hover:border-white/30 transition-all duration-300 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                  aria-label={`Watch ${story.title}`}
                >
                  <svg
                    className="w-3 h-3 fill-white"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Story
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
