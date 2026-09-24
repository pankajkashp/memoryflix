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
    cardClass: "border border-[#F0DCE0] bg-white/70",
    ctaClass:
      "border border-[#F0DCE0] bg-white text-[#3B2436] hover:bg-[#FDEFE6] hover:border-[#E85D75]/40",
    checkColor: "text-[#B79FD1]",
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
      "border border-transparent bg-gradient-to-b from-[#F7C9CF]/50 via-[#DDD0EC]/30 to-transparent relative",
    ctaClass:
      "bg-gradient-to-r from-[#E85D75] to-[#B79FD1] text-white hover:from-[#DB4A64] hover:to-[#A78BC4] shadow-magical",
    checkColor: "text-[#E85D75]",
    badge: "Most Loved",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function PricingSection() {
  return (
    <section className="bg-[#FFFBF6] py-24 sm:py-32 relative overflow-hidden border-t border-[#F3DEE2]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#B79FD1]/12 rounded-full blur-[100px]" />
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
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B79FD1]/70" />
            <span className="text-xs uppercase tracking-[0.32em] text-[#8B6FA8] font-semibold">
              Simple pricing
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B79FD1]/70" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-[#3B2436] tracking-tight"
          >
            Every love story
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B9425C] to-[#8B6FA8]">
              deserves a home.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-[#8B6B7A] text-lg max-w-md mx-auto"
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
                <div className="absolute inset-0 rounded-3xl ring-1 ring-[#E85D75]/30 ring-inset pointer-events-none" />
              )}

              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E85D75] to-[#B79FD1] text-white text-xs font-bold px-4 py-1 rounded-full shadow-magical whitespace-nowrap">
                  ✦ {plan.badge}
                </span>
              )}

              {/* Plan name + tagline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#3B2436] mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#B49AA4]">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-5xl font-bold text-[#3B2436] tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-[#B49AA4] font-medium">
                  /{plan.priceNote}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#8B6B7A] mb-8 leading-relaxed">
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
                    <span className="text-sm text-[#6B4C58] leading-snug">
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
          className="text-center text-xs text-[#B49AA4] mt-10"
        >
          No credit card required · Cancel anytime · Your memories stay yours
        </motion.p>
      </div>
    </section>
  );
}
