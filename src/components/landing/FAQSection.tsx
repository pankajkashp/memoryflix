"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I share my story?",
    answer: "Once you publish your story, you'll get a unique, secure URL (like memoryflix.com/s/your-story-id) that you can send to anyone via text, email, or social media.",
  },
  {
    question: "Do my friends need an account to view?",
    answer: "No! Anyone with the link can view your story instantly in their browser, with no app downloads or sign-ups required.",
  },
  {
    question: "What happens if I exceed the photo limit on the Free plan?",
    answer: "You'll be prompted to either remove some photos to stay under the 50 photo limit, or you can easily upgrade to the Pro plan for unlimited uploads.",
  },
  {
    question: "Can I download the final video?",
    answer: "MemoryFlix is an interactive web experience, not a standard video file. However, you can screen record it, or use our upcoming 'Export to MP4' feature (coming soon to Pro users).",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-black py-24 sm:py-32 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-zinc-800">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-white mb-8">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-zinc-800">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="pt-6">
                <dt>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-start justify-between text-left text-white focus:outline-none"
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDown
                        className={`h-6 w-6 transform transition-transform duration-200 ${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        } text-zinc-400`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </dt>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.dd
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 pr-12 overflow-hidden"
                    >
                      <p className="text-base leading-7 text-zinc-400">{faq.answer}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
