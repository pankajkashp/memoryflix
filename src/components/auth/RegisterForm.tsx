"use client";

import { useActionState } from "react";
import { signup, SignupState } from "@/app/actions/auth";
import Link from "next/link";
import { motion } from "framer-motion";

const initialState: SignupState = {};

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signup, initialState);

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
          Start Your Story ❤️
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Turn memories into something worth watching forever.
        </p>
      </div>

      <form action={action} className="relative z-10 space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-300 ml-1 mb-1.5"
          >
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
            placeholder="Pankaj"
          />
          {state?.errors?.name && (
            <p className="mt-2 text-xs text-rose-400 ml-1">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email */}
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
          {state?.errors?.email && (
            <p className="mt-2 text-xs text-rose-400 ml-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
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
            autoComplete="new-password"
            className="block w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
            placeholder="••••••••"
          />
          {state?.errors?.password && (
            <p className="mt-2 text-xs text-rose-400 ml-1">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* General error */}
        {state?.errors?.general && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center backdrop-blur-md">
            {state.errors.general[0]}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:from-rose-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all duration-300 mt-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          {pending ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="relative z-10 mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-white hover:text-rose-400 transition-colors underline decoration-white/30 underline-offset-4 hover:decoration-rose-400"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
