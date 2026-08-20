"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Memory {
  photo: string;
  caption: string;
}

interface Scene08Props {
  data: {
    photo1: string; caption1: string;
    photo2?: string; caption2?: string;
    photo3?: string; caption3?: string;
    photo4?: string; caption4?: string;
    collageNote: string;
    recipientName: string;
    senderName: string;
  };
  onNext: () => void;
}

const ROTATIONS = [-4, 3, -2, 5];
const POSITIONS = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1 mt-8",
  "col-start-1 row-start-2 -mt-4",
  "col-start-2 row-start-2 mt-2",
];

export default function Scene08LetterCollage({ data, onNext }: Scene08Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const signoffRef = useRef<HTMLDivElement>(null);

  const memories: Memory[] = [
    { photo: data.photo1, caption: data.caption1 },
    ...(data.photo2 ? [{ photo: data.photo2, caption: data.caption2 || "" }] : []),
    ...(data.photo3 ? [{ photo: data.photo3, caption: data.caption3 || "" }] : []),
    ...(data.photo4 ? [{ photo: data.photo4, caption: data.caption4 || "" }] : []),
  ].slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // Paper rises from below
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(paperRef.current,
          { y: 120, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.1"
        )
        // Title
        .fromTo(titleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
        // Photos appear sequentially
        .fromTo(photoRefs.current.filter(Boolean),
          { opacity: 0, scale: 0.8, rotation: 0, y: 20 },
          {
            opacity: 1,
            scale: 1,
            rotation: (i) => ROTATIONS[i % ROTATIONS.length],
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.3)",
          },
          "-=0.1"
        )
        // Handwritten note reveals
        .fromTo(noteRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power2.inOut" },
          "-=0.1"
        )
        // Sign off
        .fromTo(signoffRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 via-amber-50 to-rose-50 px-4 py-8 overflow-hidden cursor-pointer select-none"
      onClick={onNext}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNext()}
      aria-label="Continue"
    >
      {/* Cork board texture hint */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* Paper */}
      <div
        ref={paperRef}
        className="relative w-full max-w-sm sm:max-w-md bg-[#fdfaf6] p-6 sm:p-8 shadow-2xl rounded-sm overflow-hidden"
        style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)" }}
      >
        {/* Paper grain */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        {/* Title */}
        <div ref={titleRef} className="mb-5">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-rose-400/70 mb-1">memories</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-700 italic">
            For {data.recipientName},
          </h2>
        </div>

        {/* Photos grid */}
        {memories.length > 0 && (
          <div className={`grid gap-3 mb-5 ${memories.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {memories.map((mem, idx) => (
              <div
                key={idx}
                ref={(el) => { photoRefs.current[idx] = el; }}
                className="relative bg-white p-2 shadow-md"
                style={{
                  transform: `rotate(${ROTATIONS[idx]}deg)`,
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.12)"
                }}
              >
                {/* Photo */}
                <div className="w-full aspect-square bg-zinc-100 overflow-hidden">
                  <img
                    src={mem.photo || "/1.png"}
                    alt={mem.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Caption below photo (polaroid style) */}
                <p className="mt-1.5 text-center font-serif text-xs text-zinc-600 italic truncate">
                  {mem.caption}
                </p>
                {/* Tape */}
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 bg-amber-100/80 border border-amber-200/60 shadow-sm rounded-sm"
                  style={{ transform: `translateX(-50%) rotate(${-ROTATIONS[idx] * 0.5}deg)` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Handwritten note */}
        <p
          ref={noteRef}
          className="font-serif text-base sm:text-lg text-zinc-600 leading-relaxed italic border-t border-zinc-200/60 pt-4 mb-4"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {data.collageNote}
        </p>

        {/* Sign off */}
        <div ref={signoffRef} className="flex items-center justify-end gap-2">
          <div className="h-px flex-1 bg-zinc-200" />
          <p className="font-serif text-lg text-rose-500 italic">
            {data.senderName} ♡
          </p>
        </div>

        {/* Corner star sticker */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md rotate-12 text-lg">
          ⭐
        </div>
      </div>

      <p className="absolute bottom-6 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400/50 animate-pulse">
        tap to continue
      </p>
    </div>
  );
}
