import { motion } from "framer-motion";

export const STEPS = [
  { id: 1, name: "Template" },
  { id: 2, name: "Details" },
  { id: 3, name: "Media" },
  { id: 4, name: "Cover" },
  { id: 5, name: "Typography" },
  { id: 6, name: "Preview" },
  { id: 7, name: "Publish" },
];

export default function WizardTimeline({ currentStep, setCurrentStep }: { currentStep: number; setCurrentStep: (step: number) => void }) {
  return (
    <div className="mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 rounded-full hidden sm:block" />
      <motion.div 
        className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-rose-500 to-purple-600 -translate-y-1/2 rounded-full hidden sm:block shadow-[0_0_15px_rgba(244,63,94,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <div className="flex justify-between relative z-10 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 hide-scrollbar gap-2 sm:gap-0">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isPast = step.id < currentStep;
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center gap-1.5 min-w-[48px] sm:min-w-[60px] cursor-pointer group"
              onClick={() => setCurrentStep(step.id)}
            >
              <motion.div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-lg border-2 relative ${
                  isActive 
                    ? "bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-110" 
                    : isPast 
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30 group-hover:bg-rose-500/30" 
                    : "bg-black/50 text-zinc-500 border-white/10 group-hover:border-white/30 group-hover:bg-white/5"
                }`}
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              >
                {isPast ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
                {isActive && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-rose-400"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" : isPast ? "text-zinc-400" : "text-zinc-600 group-hover:text-zinc-400"
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
