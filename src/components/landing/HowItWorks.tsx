"use client";

import { motion } from "framer-motion";
import { Upload, Wand2, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Memories",
    description: "Drag and drop your photos and videos. We handle the optimization and secure storage automatically."
  },
  {
    icon: Wand2,
    title: "Apply Template",
    description: "Choose from our curated collection of cinematic themes like Netflix, Classic, or Journal."
  },
  {
    icon: Share2,
    title: "Share Instantly",
    description: "Publish your story and get a sleek, beautiful URL to share with family and friends."
  }
];

export default function HowItWorks() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-red-500">Fast & Simple</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From camera roll to cinematic masterpiece
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            You don't need to be a video editor. MemoryFlix transforms your media into an elegant experience in seconds.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col rounded-3xl bg-zinc-900/50 p-8 border border-zinc-800/50 transition-colors hover:bg-zinc-900"
              >
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10">
                    <step.icon className="h-6 w-6 text-red-500" aria-hidden="true" />
                  </div>
                  {step.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
