"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection({ ctaHref, ctaText }: { ctaHref: string, ctaText: string }) {
  return (
    <section className="bg-black py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="relative isolate overflow-hidden bg-zinc-900 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16 border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to tell your story?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Join thousands of users who have already transformed their photo albums into breathtaking cinematic experiences.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={ctaHref}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {ctaText}
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6 text-white hover:text-zinc-300 transition-colors">
              Watch demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
