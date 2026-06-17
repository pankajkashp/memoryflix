"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, CalendarHeart, Plane, Baby } from "lucide-react";

const experiences = [
  {
    id: "wedding",
    title: "The Wedding Day",
    description: "From the first look to the last dance. Preserve every laugh, tear, and toast.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop",
    color: "from-rose-500/80 to-transparent",
  },
  {
    id: "travel",
    title: "The Big Trip",
    description: "That summer in Italy, or backpacking across Japan. Relive the adventure.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
    color: "from-sky-500/80 to-transparent",
  },
  {
    id: "anniversary",
    title: "Anniversaries",
    description: "Celebrate another year together with a beautiful timeline of your favorite moments.",
    icon: CalendarHeart,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=2000&auto=format&fit=crop",
    color: "from-red-500/80 to-transparent",
  },
  {
    id: "family",
    title: "Growing Up",
    description: "Baby's first steps, birthdays, and the everyday magic of family life.",
    icon: Baby,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2000&auto=format&fit=crop",
    color: "from-amber-500/80 to-transparent",
  },
];

export default function StoryExperiences() {
  return (
    <section className="bg-black py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Any memory. <br className="sm:hidden" />
            <span className="text-zinc-500">Every emotion.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-400"
          >
            Don't let your best moments get buried in a group chat or forgotten in your camera roll. Bring them back to life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative aspect-[4/3] sm:aspect-video overflow-hidden rounded-3xl bg-zinc-900"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${exp.image})` }}
              />
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-60" />
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40 bg-gradient-to-t ${exp.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                    <exp.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-zinc-300 line-clamp-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <Link href="/demo" className="text-sm font-semibold leading-6 text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            See how it looks <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
