"use client";

import { motion, Variants } from "framer-motion";
import { Play } from "lucide-react";

const features = [
  { icon: "❤️", text: "Beautiful Cover Images" },
  { icon: "🎬", text: "Cinematic Story Player" },
  { icon: "📸", text: "Photos & Videos" },
  { icon: "🔗", text: "Shareable Public Links" },
  { icon: "📱", text: "Mobile Friendly" },
  { icon: "✨", text: "Multiple Story Experiences" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProductShowcase() {
  return (
    <section className="bg-zinc-950 py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Browser Frame & Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative group"
          >
            {/* Decorative backing glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            
            {/* macOS Browser Frame */}
            <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
              
              {/* Browser Header */}
              <div className="flex items-center px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto bg-zinc-800/50 rounded-md px-32 py-1 text-[10px] text-zinc-500 font-medium hidden sm:block">
                  memoryflix.com/s/summer-in-italy
                </div>
              </div>

              {/* High-Fidelity Internal Mockup */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black overflow-hidden flex flex-col justify-end">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516483638261-f40af5ff13f0?q=80&w=2000&auto=format&fit=crop')" }}
                ></div>
                
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Internal Mockup Content */}
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ORIGINAL</span>
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Travel</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
                    Swiss Alps
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm max-w-sm mb-4 line-clamp-2 drop-shadow">
                    A breathtaking journey through the snow-capped peaks and hidden valleys of Switzerland.
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-white text-black px-4 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold hover:bg-zinc-200 transition">
                      <Play className="w-3 h-3 fill-black" />
                      Play
                    </button>
                    <button className="bg-zinc-500/50 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-zinc-500/70 transition backdrop-blur-md">
                      Gallery
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Side: Features List */}
          <div className="order-1 lg:order-2 lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                See Your Memories<br/>Come To Life
              </h2>
              <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                Turn photos and videos into cinematic stories that feel like a Netflix premiere. No editing skills required.
              </p>
            </motion.div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {features.map((feature, i) => (
                <motion.li 
                  key={i} 
                  variants={itemVariants}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors shadow-inner">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

        </div>
      </div>
    </section>
  );
}
