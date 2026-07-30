import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";
import PageTransition from "@/components/common/PageTransition";
import DashboardAmbientBackground from "@/components/dashboard/DashboardAmbientBackground";

// ─── Dashboard Layout ───────────────────────────────────────────────────────
// Dark theme, matching the landing page aesthetics.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-rose-500/30 relative">
      <DashboardAmbientBackground />
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50 pt-[env(safe-area-inset-top)]" role="banner">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between" aria-label="Dashboard navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative w-10 h-10 flex items-center justify-center -ml-2">
              { }
              <img src="/icon.png" alt="MemoryFlix Logo" className="w-full h-full object-cover scale-[1.7] transition-transform duration-300 group-hover:scale-[1.85]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-rose-50 transition-colors">
              Memory<span className="text-rose-400">Flix</span>
            </span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-5">
            <span className="text-sm font-medium text-zinc-400 hidden sm:block">
              {session.user?.name}
            </span>
            <LogoutButton />
          </div>
        </nav>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:p-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
