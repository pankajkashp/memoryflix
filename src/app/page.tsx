import LandingHero from "@/components/landing/LandingHero";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoStory from "@/components/landing/DemoStory";
import TemplatesSection from "@/components/landing/TemplatesSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export const metadata = {
  title: "MemoryFlix — Your memories, cinematic",
  description: "Turn your photo albums into premium Netflix-style stories. Beautiful layouts, elegant typography, and effortless sharing.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-red-500/30">
      {/* Top Navigation Bar - simplified for landing page */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <span className="text-xl font-bold tracking-tighter text-white">
              MemoryFlix
            </span>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <a href="/login" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors">
              Log in
            </a>
            <a href="/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors">
              Sign up
            </a>
          </div>
        </nav>
      </header>

      {/* Sections */}
      <LandingHero />
      <HowItWorks />
      <DemoStory />
      <TemplatesSection />
      <FeaturesGrid />
      <PricingSection />
      <FAQSection />
      <CTASection />
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-zinc-900 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} MemoryFlix. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
