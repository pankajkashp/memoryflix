"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setPending(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-[2rem] border border-white/10 bg-black/40 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
    >
      {/* Subtle internal glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 pointer-events-none" />

      <div className="relative z-10 text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome Back ❤️
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Continue your story where you left off.
        </p>
      </div>

      {registered && (
        <div className="relative z-10 mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 text-center backdrop-blur-md">
          Account created! Please sign in to begin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center backdrop-blur-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:from-rose-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all duration-300 mt-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="relative z-10 mt-8 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-white hover:text-rose-400 transition-colors underline decoration-white/30 underline-offset-4 hover:decoration-rose-400"
        >
          Start here
        </Link>
      </p>
    </motion.div>
  );
}
