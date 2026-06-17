"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: "heart" | "sparkle" | "circle";
  rotation: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate a mix of hearts, sparkles, and ambient circles
    const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => {
      const rand = Math.random();
      const type = rand > 0.7 ? "heart" : rand > 0.4 ? "sparkle" : "circle";
      
      return {
        id: i,
        x: Math.random() * 100, // percentage of screen width
        size: Math.random() * (type === "circle" ? 4 : 16) + (type === "circle" ? 1 : 8), 
        duration: Math.random() * 25 + 15, // 15s to 40s to float up
        delay: Math.random() * 10, // random start delay
        type,
        rotation: Math.random() * 360,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {particles.map((p) => {
        return (
          <motion.div
            key={p.id}
            className="absolute bottom-0 flex items-center justify-center"
            style={{
              left: `${p.x}%`,
            }}
            initial={{ y: "100%", opacity: 0, rotate: p.rotation }}
            animate={{
              y: "-110vh",
              opacity: [0, 0.6, 0.8, 0.6, 0],
              rotate: p.rotation + (Math.random() > 0.5 ? 180 : -180),
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {p.type === "circle" && (
              <div 
                className="rounded-full bg-white/40 blur-[1px]"
                style={{ width: p.size, height: p.size }}
              />
            )}
            
            {p.type === "heart" && (
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="text-red-500/30"
                style={{ width: p.size, height: p.size, filter: "drop-shadow(0px 0px 4px rgba(239, 68, 68, 0.3))" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )}

            {p.type === "sparkle" && (
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="text-amber-100/40"
                style={{ width: p.size, height: p.size, filter: "drop-shadow(0px 0px 3px rgba(254, 243, 199, 0.4))" }}
              >
                <path d="M12 2L14.09 9.91L22 12L14.09 14.09L12 22L9.91 14.09L2 12L9.91 9.91L12 2Z"/>
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
