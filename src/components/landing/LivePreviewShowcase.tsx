"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Plus, ThumbsUp, Volume2 } from "lucide-react";

export default function LivePreviewShowcase() {
  return (
    <section className="bg-black py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            A true cinematic premiere
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Our signature Netflix-style layout turns your camera roll into an immersive interactive experience, free of distractions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black aspect-[16/9] sm:aspect-video group"
        >
          {/* Simulated Video Player Background */}
          <div className="absolute inset-0 z-0">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-[10s] ease-linear group-hover:scale-110"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518131672697-613becd4fab5?q=80&w=2000&auto=format&fit=crop')" }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent w-2/3"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>

          {/* Top Nav Mock */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent">
             <div className="text-red-600 font-bold text-xl tracking-tighter">MEMORYFLIX</div>
             <div className="flex gap-4 text-sm font-semibold text-white">
                <span className="hidden sm:block cursor-default">Home</span>
                <span className="hidden sm:block cursor-default text-zinc-400">TV Shows</span>
                <span className="hidden sm:block cursor-default text-zinc-400">Movies</span>
             </div>
             <div className="w-8 h-8 rounded bg-zinc-800"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-16 pb-16 sm:pb-24">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-red-600">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <span className="text-zinc-300 text-xs sm:text-sm font-bold tracking-widest uppercase">Original Story</span>
              </div>
              
              <h3 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                SUMMER<br/>IN ITALY
              </h3>
              
              <div className="flex items-center gap-3 text-sm font-semibold text-white mb-6 drop-shadow">
                <span className="text-green-500">98% Match</span>
                <span>2023</span>
                <span className="px-1.5 py-0.5 border border-zinc-600 text-zinc-300 rounded text-xs">4K</span>
                <span>2 Episodes</span>
              </div>
              
              <p className="text-white/90 text-sm sm:text-lg max-w-lg mb-8 drop-shadow line-clamp-3">
                Two weeks exploring the Amalfi coast, eating endless amounts of pasta, and watching the sunset over the Mediterranean Sea.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link 
                  href="/demo" 
                  className="flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-white/80 transition-colors font-bold text-lg"
                >
                  <Play className="w-6 h-6 fill-black" />
                  Play
                </Link>
                <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-zinc-400/50 bg-zinc-900/40 text-white hover:border-white transition-colors backdrop-blur">
                  <Plus className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-zinc-400/50 bg-zinc-900/40 text-white hover:border-white transition-colors backdrop-blur">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full border-2 border-zinc-400/50 bg-zinc-900/40 text-white hover:border-white transition-colors backdrop-blur ml-auto">
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Gradient Fade to Black at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
        </motion.div>
      </div>
    </section>
  );
}
