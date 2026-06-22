"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  "Every memory deserves a premiere.",
  "Turn moments into movies.",
  "Your story is waiting.",
  "Preserve what matters most."
];

export default function RotatingQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 flex items-center justify-center overflow-hidden mb-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-medium text-rose-500/80 tracking-[0.2em] uppercase"
        >
          {QUOTES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
