import Image from "next/image";
import Link from "next/link";
import LandingHero from "@/components/landing/LandingHero";
import TemplateCards from "@/components/landing/TemplateCards";
import DemoStories from "@/components/landing/DemoStories";
import PricingSection from "@/components/landing/PricingSection";

export const metadata = {
  title: "MemoryFlix — Your love story, on screen",
  description:
    "Transform your wedding, travels, and life moments into cinematic stories worth watching forever. Beautiful. Private. Yours.",
};

export default function LandingPage() {
  const ctaHref = "/templates";
  const ctaText = "Begin Your Story";

  return (
    <main className="min-h-screen bg-[#FFF8F2] selection:bg-[#E85D75]/25">
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-4 sm:p-6 lg:px-8"
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1 group"
              aria-label="MemoryFlix — home"
            >
              <div className="relative w-12 h-12 flex items-center justify-center -ml-2">
                <Image
                  src="/icon.png"
                  alt="MemoryFlix Logo"
                  fill
                  priority
                  sizes="48px"
                  className="object-cover scale-[1.65] transition-transform duration-300 group-hover:scale-[1.75]"
                />
              </div>
              {/* Wordmark */}
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#3B2436] group-hover:text-[#E85D75] transition-colors duration-200">
                Memory<span className="text-[#E85D75]">Flix</span>
              </span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex shrink-0 justify-end items-center gap-3 sm:gap-6">
            <Link
              href="/templates"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E85D75] to-[#B9425C] px-5 py-2 text-sm font-semibold text-white shadow-magical hover:scale-105 transition-all duration-300 border border-white/30"
            >
              <span>Create Story</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <LandingHero ctaHref={ctaHref} ctaText={ctaText} />

      {/* ── Section 2: Template Cards ───────────────────────────────────────── */}
      <TemplateCards ctaHref={ctaHref} />

      {/* ── Section 3: Demo Stories ─────────────────────────────────────────── */}
      <DemoStories />

      {/* ── Section 4: Pricing ──────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#FFFBF6] border-t border-[#F3DEE2] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 opacity-70 hover:opacity-100 transition-opacity group">
            <div className="relative w-8 h-8 flex items-center justify-center -ml-1.5">
              <Image
                src="/icon.png"
                alt="MemoryFlix Logo"
                fill
                sizes="32px"
                className="object-cover scale-[1.7] transition-all duration-300"
              />
            </div>
            <span className="text-base font-semibold text-[#8B6B7A]">
              Memory<span className="text-[#E85D75]">Flix</span>
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-[#B49AA4] text-center">
            &copy; {new Date().getFullYear()} MemoryFlix. Every memory deserves a premiere.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs text-[#B49AA4]">
            <Link href="/templates" className="hover:text-[#E85D75] transition-colors">Templates</Link>
            <Link href="/demo" className="hover:text-[#E85D75] transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
