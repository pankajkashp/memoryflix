"use client";

import { motion } from "framer-motion";
import { Shield, Smartphone, Zap, PlaySquare } from "lucide-react";

const features = [
  {
    name: 'Private by Default',
    description: 'Your memories are yours. Stories are only accessible via secure, unguessable links.',
    icon: Shield,
  },
  {
    name: 'Perfect on Any Device',
    description: 'Whether viewed on an iPhone or a 4K TV, your story adapts perfectly to the screen.',
    icon: Smartphone,
  },
  {
    name: 'Lightning Fast',
    description: 'Global CDN delivery ensures your videos and photos load instantly anywhere in the world.',
    icon: Zap,
  },
  {
    name: 'Distraction Free',
    description: 'No ads, no infinite scrolling feeds, no comments. Just pure storytelling.',
    icon: PlaySquare,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-red-500">Premium Experience</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need, nothing you don't
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                    <feature.icon className="h-6 w-6 text-zinc-400" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-zinc-400">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
