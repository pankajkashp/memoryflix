import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingHero from "@/components/landing/LandingHero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import StoryExperiences from "@/components/landing/StoryExperiences";
import LivePreviewShowcase from "@/components/landing/LivePreviewShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import TemplatesSection from "@/components/landing/TemplatesSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export const metadata = {
  title: "MemoryFlix — Your memories, cinematic",
  description: "Turn your photo albums into premium Netflix-style stories. Beautiful layouts, elegant typography, and effortless sharing.",
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;
  
  const ctaHref = isAuthenticated ? "/dashboard" : "/register";
  const ctaText = isAuthenticated ? "Go to Dashboard" : "Start Creating Free";

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
            {!isAuthenticated ? (
              <>
                <a href="/login" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors">
                  Log in
                </a>
                <a href="/register" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors">
                  Sign up
                </a>
              </>
            ) : (
              <a href="/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors">
                Dashboard
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Sections */}
      <LandingHero ctaHref={ctaHref} ctaText={ctaText} />
      <ProductShowcase />
      <StoryExperiences />
      <LivePreviewShowcase />
      <HowItWorks />
      <TemplatesSection />
      <FeaturesGrid />
      <PricingSection ctaHref={ctaHref} ctaText={ctaText} />
      <FAQSection />
      <CTASection ctaHref={ctaHref} ctaText={ctaText} />
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-zinc-900 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} MemoryFlix. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
