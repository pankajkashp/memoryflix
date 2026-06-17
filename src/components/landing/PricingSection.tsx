"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    href: "/register",
    price: "$0",
    description: "Perfect for a single special occasion.",
    features: ["1 Published Story", "Up to 50 photos", "1080p Video Support", "Standard Themes", "Community Support"],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "/register",
    price: "$9",
    description: "For creators and memory hoarders.",
    features: ["Unlimited Stories", "Unlimited photos", "4K Video Support", "Premium Themes", "Custom Domains", "Priority Support"],
    mostPopular: true,
  },
];

export default function PricingSection({ ctaHref, ctaText }: { ctaHref: string, ctaText: string }) {
  return (
    <section className="bg-black py-24 sm:py-32 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-red-500">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pricing plans for memories of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
          Start for free, upgrade when you need more storage and premium features.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`rounded-3xl p-8 xl:p-10 ${
                tier.mostPopular ? "bg-white/5 ring-2 ring-red-500" : "ring-1 ring-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={`text-lg font-semibold leading-8 ${tier.mostPopular ? "text-red-400" : "text-white"}`}>
                  {tier.name}
                </h3>
                {tier.mostPopular && (
                  <p className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-red-400">
                    Most popular
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
                <span className="text-sm font-semibold leading-6 text-zinc-400">/month</span>
              </p>
              <Link
                href={ctaHref}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? "bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-500"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                }`}
              >
                {ctaText}
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-400">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-red-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
