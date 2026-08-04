import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import AtmosphericBackground from "@/components/common/AtmosphericBackground";

export const metadata = {
  title: "Story Templates — MemoryFlix",
  description:
    "Choose a handcrafted interactive story template to celebrate your friendships, love stories, and birthdays.",
};

export const revalidate = 60; // ISR cache for 1 minute

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      pages: {
        orderBy: { position: "asc" },
      },
    },
  });

  return (
    <div className="relative min-h-screen bg-[#050508] text-white selection:bg-rose-500/30 overflow-x-hidden">
      {/* Ambient Atmospheric Background Layer (Radial glow + noise/grid + floating particles) */}
      <AtmosphericBackground glowColor="rose" includeGrid={true} />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              MemoryFlix
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
              Templates
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/recover"
              className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Find My Story
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Handcrafted Interactive Experiences
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 drop-shadow-md">
            Pick a Template. <br />
            Create Magic in Minutes.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300/90 font-sans leading-relaxed max-w-2xl mx-auto">
            Turn your shared jokes, polaroids, and heartfelt notes into an
            unforgettable interactive gift. No video editing skills needed.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => {
            const priceInRupees = Math.round(tpl.price / 100);

            return (
              <Link
                key={tpl.id}
                href={`/templates/${tpl.slug}`}
                className="group relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-950/85 backdrop-blur-2xl flex flex-col transition-all duration-500 hover:border-rose-500/50 hover:shadow-[0_25px_60px_rgba(244,63,94,0.18)] hover:-translate-y-2 shadow-xl"
              >
                {/* Thumbnail Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-900">
                  <Image
                    src={tpl.previewUrl || "/1.png"}
                    alt={tpl.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md border border-white/20 text-zinc-200 shadow-md">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/40">
                      ₹{priceInRupees}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-rose-300 transition-colors">
                        {tpl.name}
                      </h2>
                      <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {tpl.pages.length} Pages
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300/80 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Instant Delivery</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:translate-x-1.5 transition-transform">
                      Preview & Create <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
