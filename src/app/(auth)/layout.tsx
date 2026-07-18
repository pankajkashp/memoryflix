import Link from "next/link";
import FloatingParticles from "@/components/landing/FloatingParticles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black selection:bg-rose-500/30">
      {/* ── Background Image ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      
      {/* ── Overlays ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />

      {/* ── Floating Particles (Hearts/Light) ────────────────────────────── */}
      <FloatingParticles />

      {/* ── Navigation Logo ────────────────────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 p-6 lg:px-8 z-50">
        <Link href="/" className="flex items-center gap-1 group w-fit">
          <div className="relative w-12 h-12 flex items-center justify-center -ml-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="MemoryFlix Logo" className="w-full h-full object-cover scale-[1.65] transition-transform duration-300 group-hover:scale-[1.75]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-rose-50 transition-colors duration-200">
            Memory<span className="text-rose-400">Flix</span>
          </span>
        </Link>
      </div>

      {/* ── Content Container ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md px-5 sm:px-0 mt-12 sm:mt-0">
        {children}
      </div>
    </div>
  );
}
