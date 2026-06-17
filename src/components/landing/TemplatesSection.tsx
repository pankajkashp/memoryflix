"use client";

import { motion } from "framer-motion";

const templates = [
  {
    id: "netflix",
    name: "Cinematic",
    description: "Our signature Netflix-inspired dark mode format.",
    color: "from-red-600 to-black",
  },
  {
    id: "classic",
    name: "Classic Album",
    description: "A clean, white aesthetic perfect for weddings and baby showers.",
    color: "from-zinc-200 to-white",
  },
  {
    id: "journal",
    name: "Travel Journal",
    description: "Editorial style layout emphasizing storytelling and dates.",
    color: "from-amber-100 to-orange-50",
  }
];

export default function TemplatesSection() {
  return (
    <section className="bg-black py-24 sm:py-32 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Designed for every occasion
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            More templates arriving soon. Pro users get early access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:bg-zinc-800 transition-colors"
            >
              <div className={`aspect-video w-full rounded-lg bg-gradient-to-br ${template.color} mb-6 opacity-80 group-hover:opacity-100 transition-opacity`} />
              <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-zinc-400 text-sm">{template.description}</p>
              
              {i === 0 && (
                <span className="absolute top-4 right-4 bg-red-600/20 text-red-500 text-xs font-bold px-2 py-1 rounded-full border border-red-500/20">
                  POPULAR
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
