"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

// ─── Pricing plans — emotional language, zero SaaS jargon ──────────────────
const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Begin your first story",
    price: "$0",
    priceNote: "forever free",
    description:
      "One perfect moment, beautifully preserved. No credit card needed.",
    features: [
      "1 story to cherish forever",
      "Up to 20 photos & videos",
      "Netflix-style cinematic theme",
      "Beautiful public sharing link",
      "Your memories. Your privacy.",
    ],
    cta: "Start Free",
    href: "/templates",
    highlighted: false,
    cardClass: "border border-white/10 bg-white/[0.03]",
    ctaClass:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
    checkColor: "text-zinc-400",
    badge: null,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For every chapter of your life",
    price: "$9",
    priceNote: "per month",
    description:
      "Every memory, every moment. Unlimited stories for the life you love.",
    features: [
      "Unlimited stories, always",
      "Unlimited photos & videos",
      "All premium templates",
      "Priority support",
      "AI features — coming soon ✦",
    ],
    cta: "Upgrade to Premium",
    href: "/templates",
    highlighted: true,
    cardClass:
      "border border-transparent bg-gradient-to-b from-rose-500/10 via-purple-500/5 to-transparent relative",
    ctaClass:
      "bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-400 hover:to-purple-500 shadow-lg shadow-rose-600/30",
    checkColor: "text-rose-400",
    badge: "Most Loved",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function PricingSection() {
  return (
    <section className="bg-[#080808] py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.04]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-500/6 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="text-center mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/60" />
            <span className="text-xs uppercase tracking-[0.32em] text-purple-400/80 font-semibold">
              Simple pricing
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400/60" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
          >
            Every love story
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
              deserves a home.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-zinc-400 text-lg max-w-md mx-auto"
          >
            Start free. Upgrade when your story grows.
          </motion.p>
        </div>

        {/* ── Plan cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`rounded-3xl p-8 xl:p-10 relative ${plan.cardClass}`}
            >
              {/* Premium border glow (ring) */}
              {plan.highlighted && (
                <div className="absolute inset-0 rounded-3xl ring-1 ring-rose-500/30 ring-inset pointer-events-none" />
              )}

              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-rose-600/30 whitespace-nowrap">
                  ✦ {plan.badge}
                </span>
              )}

              {/* Plan name + tagline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-zinc-500">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-5xl font-bold text-white tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500 font-medium">
                  /{plan.priceNote}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                {plan.description}
              </p>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full text-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-8 ${plan.ctaClass}`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.checkColor}`}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-zinc-300 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center text-xs text-zinc-600 mt-10"
        >
          No credit card required · Cancel anytime · Your memories stay yours
        </motion.p>
      </div>
    </section>
  );
}
