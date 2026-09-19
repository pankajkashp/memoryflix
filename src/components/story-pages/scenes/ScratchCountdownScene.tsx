"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SceneProps } from "./types";

/**
 * Scratch-to-reveal card that, once scratched away, plays a 3-2-1 countdown
 * burst instead of revealing text (unlike SCRATCH_REVEAL in
 * ../ScratchRevealPage.tsx). Reuses that component's destination-out canvas
 * scratch technique rather than its (non-branching) layout/props contract.
 */
export default function ScratchCountdownScene({ fixedConfig, fieldValues, onExit }: SceneProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [countdownValue, setCountdownValue] = useState<number | "go" | null>(null);
  const [isScratching, setIsScratching] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRevealedRef = useRef(false);

  const { backgroundColor = "#0b0817", textColor = "#f8fafc", accentColor = "#06b6d4" } = fixedConfig;
  const title = fieldValues.title || "Scratch to start the countdown";
  const subtitle = fieldValues.subtitle || "Drag or tap anywhere to uncover";

  const triggerReveal = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    if (width === 0 || height === 0) return;
    canvas.width = width;
    canvas.height = height;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#22d3ee");
    grad.addColorStop(0.4, "#a855f7");
    grad.addColorStop(0.7, "#ec4899");
    grad.addColorStop(1, "#4ade80");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [isRevealed]);

  const handleScratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealedRef.current) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() > 0.4) {
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imgData.data;
          let transparentCount = 0;
          const sampleStep = 32;
          const totalSampled = pixels.length / (4 * sampleStep);
          for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
            if (pixels[i] < 128) transparentCount++;
          }
          const percent = Math.round((transparentCount / totalSampled) * 100);
          setScratchPercent(percent);
          if (percent > 24) triggerReveal();
        } catch {
          triggerReveal();
        }
      }
    },
    [triggerReveal]
  );

  // Once revealed, run the 3-2-1-GO countdown then exit.
  useEffect(() => {
    if (!isRevealed) return;
    const sequence: Array<number | "go"> = [3, 2, 1, "go"];
    let i = 0;
    setCountdownValue(sequence[0]);
    const interval = setInterval(() => {
      i += 1;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => onExit("default"), 500);
        return;
      }
      setCountdownValue(sequence[i]);
    }, 700);
    return () => clearInterval(interval);
  }, [isRevealed]);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    handleScratch(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) handleScratch(e.clientX, e.clientY);
  };
  const onMouseUp = () => setIsScratching(false);
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      setIsScratching(true);
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) handleScratch(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchEnd = () => setIsScratching(false);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 py-6 select-none overflow-y-auto" style={{ backgroundColor }}>
      {!isRevealed ? (
        <>
          <div className="text-center space-y-1 max-w-sm">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight" style={{ color: textColor }}>
              {title}
            </h1>
          </div>
          <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl cursor-pointer touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs sm:text-sm font-mono" style={{ color: `${accentColor}cc` }}>
            {scratchPercent > 0 ? `Scratched ${scratchPercent}%` : subtitle}
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <span
            key={String(countdownValue)}
            className="text-7xl sm:text-8xl font-black tabular-nums"
            style={{
              color: accentColor,
              textShadow: `0 0 40px ${accentColor}88`,
              animation: "mflx-countdown-pop 0.7s ease-out",
            }}
          >
            {countdownValue === "go" ? "GO! 🎉" : countdownValue}
          </span>
        </div>
      )}

      <style>{`
        @keyframes mflx-countdown-pop {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
