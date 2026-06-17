"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DemoStory() {
  return (
    <section id="demo" className="bg-zinc-950 py-24 sm:py-32 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-zinc-950 to-zinc-950"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A viewing experience they won't forget
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Send a link that opens up like a blockbuster movie. Your photos are beautifully organized, full-screen, and completely distraction-free.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 sm:mt-20 flex justify-center"
        >
          <div className="relative w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black group">
            {/* Dark gradient overlay mimicking the Netflix hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
            
            {/* Abstract Background for Demo */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518131672697-613becd4fab5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"></div>
            
            <div className="absolute bottom-0 left-0 p-8 sm:p-12 z-20 w-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">N SERIES</span>
                <span className="text-zinc-300 text-sm font-medium">NEW STORY</span>
              </div>
              <h3 className="text-4xl sm:text-6xl font-bold text-white mb-4">Summer in Italy</h3>
              <p className="text-zinc-300 max-w-xl text-sm sm:text-base line-clamp-3 mb-6">
                Two weeks exploring the Amalfi coast, eating endless amounts of pasta, and watching the sunset over the Mediterranean Sea.
              </p>
              <div className="flex gap-3">
                <Link href="/demo" className="bg-white text-black px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Play
                </Link>
                <Link href="/demo" className="bg-zinc-500/40 text-white px-6 py-2 rounded font-semibold hover:bg-zinc-500/60 transition-colors backdrop-blur-md">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
