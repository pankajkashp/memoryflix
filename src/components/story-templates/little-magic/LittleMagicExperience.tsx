"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

interface MemorySpot {
  id: string;
  title: string;
  note: string;
  date?: string;
  location?: string;
  image?: string;
  accent: string;
  x: number;
  y: number;
}

interface LittleMagicExperienceProps {
  fieldValues?: Record<string, unknown>;
}

const decorativePalette = [
  { symbol: "✦", opacity: 0.18, color: "#F9D7AA" },
  { symbol: "✧", opacity: 0.14, color: "#C9B7FF" },
  { symbol: "❋", opacity: 0.16, color: "#B9F3D9" },
  { symbol: "✺", opacity: 0.12, color: "#F3B7D8" },
  { symbol: "☾", opacity: 0.14, color: "#DCE7FF" },
  { symbol: "✦", opacity: 0.12, color: "#FFD6A5" },
];

const seedMemories = (fieldValues?: Record<string, unknown>): MemorySpot[] => {
  const values = fieldValues ?? {};
  const entries: Array<{ key: string; label: string; value?: unknown }> = [
    { key: "memory1Image", label: "First Memory Photo", value: values.memory1Image },
    { key: "memory2Image", label: "Second Memory Photo", value: values.memory2Image },
    { key: "memory3Image", label: "Third Memory Photo", value: values.memory3Image },
    { key: "memory4Image", label: "Fourth Memory Photo", value: values.memory4Image },
    { key: "memory5Image", label: "Fifth Memory Photo", value: values.memory5Image },
  ];

  const picked = entries
    .filter((entry) => typeof entry.value === "string" && entry.value.trim().length > 0)
    .map((entry, index) => ({
      id: entry.key,
      title: String(values[`${entry.key}Title`] ?? `Memory ${index + 1}`),
      note: String(values[`${entry.key}Note`] ?? "A little wonder we made together."),
      date: String(values[`${entry.key}Date`] ?? ""),
      location: String(values[`${entry.key}Location`] ?? ""),
      image: String(entry.value ?? ""),
      accent: ["#F9B7D2", "#B8E4FF", "#D8F7C9", "#F7D9A7", "#CFC4FF"][index % 5],
      x: 16 + ((index * 17) % 68),
      y: 16 + ((index * 23) % 58),
    }));

  if (picked.length === 0) {
    return [
      {
        id: "fallback-1",
        title: "Our first little wonder",
        note: "A tiny memory that became a beautiful story.",
        date: "This chapter",
        location: "Everywhere",
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
        accent: "#F9B7D2",
        x: 30,
        y: 40,
      },
      {
        id: "fallback-2",
        title: "Moonlit laughter",
        note: "The kind of night that made us feel like the whole world was glowing.",
        date: "A warm evening",
        location: "Under the stars",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
        accent: "#B8E4FF",
        x: 60,
        y: 30,
      },
      {
        id: "fallback-3",
        title: "Tiny miracles",
        note: "The smallest moments became magical when we were together.",
        date: "A little while ago",
        location: "In our favorite place",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        accent: "#D8F7C9",
        x: 45,
        y: 64,
      },
    ];
  }

  return picked;
};

const getSceneMessage = (scene: number, title: string) => {
  const options = [
    "There’s a little something waiting for you...",
    "A tiny constellation of us...",
    "A little world is turning around your memory...",
    "Pick a star and open the magic...",
    "The garden is growing around us...",
    "The wish tree is waking up...",
    "A paper ribbon has a secret for you...",
    "The sky is raining tiny miracles...",
    "Your little universe is complete...",
  ];

  return `${options[scene - 1] ?? "A little wonder is unfolding..."}`;
};

export default function LittleMagicExperience({ fieldValues }: LittleMagicExperienceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<MemorySpot | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<string | null>(null);
  const memories = useMemo(() => seedMemories(fieldValues), [fieldValues]);
  const activeMemory = selectedMemory ?? memories[0] ?? null;

  const goNext = useCallback(() => {
    setSceneIndex((value) => (value + 1) % 9);
  }, []);

  const handleStarSelect = useCallback((memory: MemorySpot) => {
    setSelectedMemory(memory);
    setSceneIndex(1);
  }, []);

  const decorativeItems = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: (index * 11.5) % 100,
        top: (index * 17.3) % 100,
        size: 8 + ((index * 7) % 16),
        delay: index * 0.4,
        ...decorativePalette[index % decorativePalette.length],
      })),
    []
  );

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1 });
      const tl = gsap.timeline();
      tl.fromTo(
        ".magic-scene-shell",
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [sceneIndex]);

  const sceneProps = {
    message: getSceneMessage(sceneIndex + 1, activeMemory?.title ?? "Little Magic"),
    memories,
    activeMemory,
    selectedMemory,
    hoveredMemory,
    setHoveredMemory,
    onStarSelect: handleStarSelect,
    onNext: goNext,
    setSelectedMemory,
  };

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-hidden bg-[#070b14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,180,230,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(109,154,255,0.18),_transparent_35%)]" />

      {decorativeItems.map((item) => (
        <div
          key={item.id}
          className="pointer-events-none absolute select-none"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            opacity: item.opacity,
            color: item.color,
            fontSize: `${item.size}px`,
            textShadow: "0 0 18px rgba(255,255,255,0.35)",
            animation: `floatSoft ${7 + (item.id % 5)}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.symbol}
        </div>
      ))}

      <div className="magic-scene-shell absolute inset-0">
        {sceneIndex === 0 && <Scene01Door {...sceneProps} />}
        {sceneIndex === 1 && <Scene02Constellation {...sceneProps} />}
        {sceneIndex === 2 && <Scene03Planet {...sceneProps} />}
        {sceneIndex === 3 && <Scene04PickStar {...sceneProps} />}
        {sceneIndex === 4 && <Scene05Garden {...sceneProps} />}
        {sceneIndex === 5 && <Scene06WishTree {...sceneProps} />}
        {sceneIndex === 6 && <Scene07Message {...sceneProps} />}
        {sceneIndex === 7 && <Scene08Rain {...sceneProps} />}
        {sceneIndex === 8 && <Scene09Universe {...sceneProps} />}
      </div>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-zinc-200 backdrop-blur-sm"
      >
        next
      </button>
    </div>
  );
}

function Scene01Door({ message, onNext }: any) {
  const doorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([doorRef.current, glowRef.current], { opacity: 0, scale: 0.7 });
      gsap.to(glowRef.current, {
        opacity: 0.9,
        scale: 1.12,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(doorRef.current, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.6)" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle,_rgba(46,31,74,0.25),_rgba(4,4,12,0.98)_60%)]">
      <div ref={glowRef} className="absolute h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(204,168,255,0.26),_rgba(255,210,150,0.12),_transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,10,19,0.3),_rgba(6,8,16,0.96))]" />

      <button
        type="button"
        onClick={onNext}
        className="group relative z-10 flex h-40 w-28 items-center justify-center"
      >
        <div className="absolute h-40 w-28 rounded-[1.75rem] border border-white/20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_rgba(90,76,129,0.7)_35%,_rgba(12,10,22,0.92)_100%)] shadow-[0_0_30px_rgba(189,141,255,0.35)]" />
        <div ref={doorRef} className="relative h-32 w-20 rounded-[1.3rem] border border-[#D8C4FF]/80 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_rgba(252,197,143,0.18),_rgba(15,20,35,0.96))] shadow-[0_0_35px_rgba(255,204,129,0.18)]">
          <div className="absolute inset-x-3 top-3 h-6 rounded-full bg-white/5" />
          <div className="absolute inset-x-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/20" />
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-[radial-gradient(circle,_rgba(255,255,255,0.3),_rgba(161,236,255,0.2),_transparent)]" />
        </div>
      </button>

      <div className="absolute bottom-20 left-1/2 z-10 w-[80%] max-w-md -translate-x-1/2 text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-white/60">Little Magic</p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed text-white/90 md:text-4xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene02Constellation({ memories, activeMemory, onStarSelect, message, setHoveredMemory, hoveredMemory }: any) {
  const nodes = memories.slice(0, 6);
  const pointerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".magic-star-node",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, stagger: 0.12, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(
        ".magic-constellation-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.5, duration: 0.8, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [memories]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(76,63,87,0.38),_rgba(6,9,18,0.94)_58%)]">
      <div ref={pointerRef} className="absolute inset-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="h-full w-full opacity-80">
          {nodes.map((memory: MemorySpot, index: number) => {
            const x = memory.x;
            const y = memory.y;
            const next = nodes[(index + 1) % nodes.length];
            return (
              <g key={memory.id} className="magic-constellation-line">
                <line
                  x1={x}
                  x2={next.x}
                  y1={y}
                  y2={next.y}
                  stroke={memory.accent}
                  strokeWidth="0.28"
                  strokeOpacity="0.75"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {nodes.map((memory: MemorySpot, index: number) => (
        <button
          key={memory.id}
          type="button"
          onMouseEnter={() => setHoveredMemory(memory.id)}
          onMouseLeave={() => setHoveredMemory(null)}
          onClick={() => onStarSelect(memory)}
          className="magic-star-node absolute flex items-center justify-center"
          style={{
            left: `${memory.x}%`,
            top: `${memory.y}%`,
            width: activeMemory?.id === memory.id ? 38 : 22,
            height: activeMemory?.id === memory.id ? 38 : 22,
            transform: `translate(-50%, -50%) scale(${hoveredMemory === memory.id ? 1.2 : 1})`,
            color: memory.accent,
            transition: "all 260ms ease",
          }}
        >
          <span
            className="flex items-center justify-center text-[16px] font-bold"
            style={{
              textShadow: `0 0 18px ${memory.accent}`,
              opacity: activeMemory?.id === memory.id ? 1 : 0.8,
            }}
          >
            ★
          </span>
        </button>
      ))}

      <div className="absolute inset-x-0 bottom-12 z-10 px-4 text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/60">Memory Constellation</p>
        <h2 className="mt-3 text-lg text-white/80 md:text-2xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene03Planet({ activeMemory, message }: any) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, scale: 0.7, rotation: -8 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.1, ease: "power3.out" }
      );
      gsap.to(orbitRef.current, { rotation: 360, duration: 22, ease: "none", repeat: -1 });
    });

    return () => ctx.revert();
  }, [activeMemory]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(90,137,167,0.26),_rgba(8,11,19,0.94)_58%)] px-6">
      <div ref={orbitRef} className="absolute h-[22rem] w-[22rem] rounded-full border border-white/10 md:h-[28rem] md:w-[28rem]" />
      <div className="absolute h-[19rem] w-[19rem] rounded-full border border-white/5 md:h-[24rem] md:w-[24rem]" />

      <div ref={shellRef} className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
        <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/20 shadow-[0_0_45px_rgba(255,220,161,0.18)] md:h-60 md:w-60">
          <img
            src={activeMemory?.image}
            alt={activeMemory?.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%)]" />
        </div>

        <div className="max-w-md text-center md:text-left">
          <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-white/55">Memory Planet</p>
          <h3 className="mt-3 text-2xl font-light text-white md:text-4xl">{activeMemory?.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">“{activeMemory?.note}”</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/55">
            {activeMemory?.location && <span>{activeMemory.location}</span>}
            {activeMemory?.date && <span>•</span>}
            {activeMemory?.date && <span>{activeMemory.date}</span>}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/80">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{message}</p>
      </div>
    </div>
  );
}

function Scene04PickStar({ memories, activeMemory, onStarSelect, message, setHoveredMemory, hoveredMemory }: any) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pick-star-item",
        { opacity: 0, scale: 0.2, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [memories]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(85,54,92,0.35),_rgba(5,9,18,0.96)_60%)] px-4 py-10">
      {memories.slice(0, 5).map((memory: MemorySpot, index: number) => (
        <button
          key={memory.id}
          type="button"
          onMouseEnter={() => setHoveredMemory(memory.id)}
          onMouseLeave={() => setHoveredMemory(null)}
          onClick={() => onStarSelect(memory)}
          className="pick-star-item absolute flex items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_rgba(160,130,255,0.2))]"
          style={{
            left: `${18 + index * 19}%`,
            top: `${30 + (index % 3) * 20}%`,
            width: activeMemory?.id === memory.id ? 92 : 72,
            height: activeMemory?.id === memory.id ? 92 : 72,
            transform: `rotate(${index * 16 - 18}deg) scale(${hoveredMemory === memory.id ? 1.12 : 1})`,
            boxShadow: `0 0 24px ${memory.accent}55`,
            color: memory.accent,
            transition: "all 260ms ease",
          }}
        >
          <span className="text-3xl">★</span>
        </button>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/85">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/50">Pick a Star</p>
        <h2 className="mt-3 text-xl md:text-2xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene05Garden({ memories, activeMemory, message, setSelectedMemory }: any) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".garden-photo",
        { opacity: 0, y: 18, rotation: -8 },
        { opacity: 1, y: 0, rotation: 0, duration: 0.95, stagger: 0.12, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [memories]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(127,195,140,0.2),_rgba(8,12,18,0.94)_50%)] px-4 py-10">
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(circle_at_center,_rgba(134,194,165,0.2),_rgba(67,114,76,0.08),_transparent_68%)]" />

      {memories.slice(0, 6).map((memory: MemorySpot, index: number) => (
        <button
          key={memory.id}
          type="button"
          onClick={() => setSelectedMemory(memory)}
          className="garden-photo absolute overflow-hidden rounded-[1.3rem] border border-white/15 bg-zinc-900/40 shadow-xl"
          style={{
            left: `${12 + (index % 3) * 28}%`,
            top: `${18 + Math.floor(index / 3) * 28}%`,
            width: `${120 + (index % 3) * 36}px`,
            height: `${110 + (index % 2) * 40}px`,
            transform: `rotate(${(index % 2 === 0 ? -1 : 1) * (index + 2)}deg)`,
            boxShadow: `0 0 38px ${memory.accent}30`,
          }}
        >
          <img src={memory.image} alt={memory.title} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/75">{memory.date || "Memory"}</p>
          </div>
        </button>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/85">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/50">Memory Garden</p>
        <h2 className="mt-3 text-xl md:text-2xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene06WishTree({ memories, message, activeMemory }: any) {
  const treeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(treeRef.current, { scaleY: 0.8, opacity: 0.2 });
      gsap.to(treeRef.current, { opacity: 1, scaleY: 1, duration: 1.2, ease: "power2.out" });
      gsap.fromTo(
        ".wish-leaf",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "back.out(1.3)" }
      );
    });

    return () => ctx.revert();
  }, [memories]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(197,206,255,0.18),_rgba(8,10,18,0.96)_60%)] px-6">
      <div ref={treeRef} className="relative z-10 flex h-[68%] w-[60%] max-w-[22rem] items-end justify-center">
        <div className="absolute bottom-0 h-[22%] w-3 rounded-full bg-[linear-gradient(180deg,_rgba(124,85,64,0.9),_rgba(86,62,46,0.8))]" />
        <div className="absolute bottom-[18%] h-[40%] w-[60%] rounded-[50%] bg-[radial-gradient(circle,_rgba(111,171,141,0.8),_rgba(34,55,42,0.9))] shadow-[0_0_40px_rgba(139,223,190,0.12)]" />

        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="wish-leaf absolute bottom-[36%] rounded-full border border-white/10"
            style={{
              left: `${42 + Math.sin(index) * 16}%`,
              width: 18 + (index % 3) * 8,
              height: 18 + (index % 3) * 8,
              background: index % 2 === 0 ? "rgba(255, 214, 165, 0.7)" : "rgba(188, 214, 255, 0.7)",
              transform: `translateY(${index * 2}px) rotate(${index * 25}deg)`,
            }}
          />
        ))}
      </div>

      {activeMemory && (
        <div className="absolute right-8 top-1/3 z-20 w-36 overflow-hidden rounded-[1.2rem] border border-white/15 bg-black/20 p-2 backdrop-blur-sm">
          <img src={activeMemory.image} alt={activeMemory.title} className="h-24 w-full rounded-xl object-cover" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">Forest Memory</p>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/85">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/50">Wish Tree</p>
        <h2 className="mt-3 text-xl md:text-2xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene07Message({ activeMemory, message }: any) {
  const paperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paperRef.current,
        { opacity: 0, y: 30, rotationX: 60 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [activeMemory]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,211,186,0.15),_rgba(8,10,18,0.96)_60%)] px-6">
      <div ref={paperRef} className="relative z-10 w-full max-w-lg rounded-[1.8rem] border border-white/15 bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(255,250,244,0.72))] p-6 text-[#1d1a22] shadow-[0_0_40px_rgba(255,235,188,0.15)]">
        <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.3em] text-[#6d5b6d]">
          <span>little note</span>
          <span>{activeMemory?.date || "forever"}</span>
        </div>
        <p className="font-serif text-2xl italic leading-relaxed">“{activeMemory?.note || "The world is brighter with you in it."}”</p>
        <div className="mt-6 h-px w-full bg-[#d7c8d9]" />
        <p className="mt-5 text-sm leading-7 text-[#443b4a]">{message}</p>
      </div>
    </div>
  );
}

function Scene08Rain({ memories, message }: any) {
  const picks = memories.slice(0, 5);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rain-glow",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [memories]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(180,192,255,0.2),_rgba(8,10,18,0.96)_62%)] px-6">
      {picks.map((memory: MemorySpot, index: number) => (
        <div
          key={memory.id}
          className="rain-glow absolute top-[-10%] overflow-hidden rounded-[1.1rem] border border-white/15 bg-black/20 shadow-xl"
          style={{
            left: `${12 + index * 20}%`,
            width: 110,
            height: 78,
            transform: `translateY(${index * 20}px) rotate(${index * 4 - 8}deg)`,
            opacity: 0.85,
          }}
        >
          <img src={memory.image} alt={memory.title} className="h-full w-full object-cover opacity-80" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-10 text-center text-white/85">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/52">Magic Rain</p>
        <h2 className="mt-3 text-xl md:text-2xl">{message}</h2>
      </div>
    </div>
  );
}

function Scene09Universe({ activeMemory, message }: any) {
  const universeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        universeRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, [activeMemory]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(146,136,255,0.2),_rgba(10,10,18,0.98)_60%)] px-6">
      <div ref={universeRef} className="relative flex h-full w-full max-w-5xl items-center justify-center">
        <div className="absolute h-[18rem] w-[18rem] rounded-full border border-white/10 md:h-[26rem] md:w-[26rem]" />
        <div className="absolute h-[22rem] w-[22rem] rounded-full border border-white/5 md:h-[30rem] md:w-[30rem]" />
        <div className="absolute h-8 w-8 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.8),_rgba(255,212,143,0.35),_transparent)] shadow-[0_0_35px_rgba(255,214,153,0.55)]" />

        {activeMemory && (
          <div className="absolute h-40 w-40 overflow-hidden rounded-full border border-white/20 shadow-[0_0_40px_rgba(255,214,153,0.18)] md:h-56 md:w-56">
            <img src={activeMemory.image} alt={activeMemory.title} className="h-full w-full object-cover" />
          </div>
        )}

        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white/80"
            style={{
              width: 4 + (index % 3),
              height: 4 + (index % 3),
              left: `${50 + Math.cos(index * 0.9) * 32}%`,
              top: `${50 + Math.sin(index * 0.9) * 28}%`,
              opacity: 0.5 + (index % 4) * 0.12,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 w-[86%] max-w-2xl -translate-x-1/2 text-center">
        <p className="text-[11px] font-mono uppercase tracking-[0.36em] text-white/50">Your Little Universe</p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed text-white/90 md:text-4xl">{message}</h2>
        <div className="mt-5 text-[11px] font-mono uppercase tracking-[0.4em] text-white/45">MemoryFlix</div>
      </div>
    </div>
  );
}
