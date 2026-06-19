import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-rose-500/30">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg
              className="w-6 h-6 text-rose-400 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 36 36"
              fill="none"
              aria-hidden="true"
            >
              <rect x="1" y="9" width="34" height="18" rx="3" fill="currentColor" opacity="0.18" />
              <rect x="1" y="10" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="1" y="16.5" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="1" y="23" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="31" y="10" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="31" y="16.5" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="31" y="23" width="4" height="3" rx="1" fill="currentColor" opacity="0.6" />
              <path
                d="M18 26s-8-5.2-8-10.5a5.2 5.2 0 0 1 8-4.4 5.2 5.2 0 0 1 8 4.4C26 20.8 18 26 18 26z"
                fill="currentColor"
              />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-rose-50 transition-colors">
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
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
