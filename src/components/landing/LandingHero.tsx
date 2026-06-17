"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-60"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Your memories,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              cinematic.
            </span>
          </h1>
          <p className="mt-8 text-xl text-zinc-400 max-w-2xl mx-auto sm:text-2xl leading-relaxed">
            Turn your photo albums into premium Netflix-style stories. Beautiful layouts, elegant typography, and effortless sharing.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-lg font-semibold text-black transition-transform hover:scale-105"
            >
              Start Creating Free
            </Link>
            <Link
              href="#demo"
              className="inline-flex h-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 px-8 text-lg font-medium text-white backdrop-blur transition-colors hover:bg-zinc-800"
            >
              See a Demo
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Visual Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="relative mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="aspect-video w-full rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-2xl overflow-hidden relative backdrop-blur">
          {/* Mockup UI Bar */}
          <div className="absolute top-0 inset-x-0 h-12 border-b border-zinc-800 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          {/* Mockup Content */}
          <div className="absolute inset-0 top-12 p-8 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <div className="w-full">
              <div className="h-6 w-1/4 rounded bg-red-600/20 mb-4 blur-[2px]"></div>
              <div className="h-16 w-3/4 rounded bg-white/10 mb-4 blur-[2px]"></div>
              <div className="h-4 w-1/2 rounded bg-zinc-500/20 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
