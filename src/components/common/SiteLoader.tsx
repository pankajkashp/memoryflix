"use client";

/**
 * SiteLoader — Premium cinematic preloader for MemoryFlix.
 *
 * • Dark, elegant, emotional theme
 * • GSAP timeline animations with power4/expo easing
 * • Custom text reveal and glowing progress line
 * • Seamless slide-up curtain exit
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-utils";
import { prefersReducedMotion } from "@/lib/gsap-utils";

const SESSION_KEY = "mf_loader_shown_v3";

export default function SiteLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const loader = loaderRef.current;
    const logoContainer = logoContainerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const progressLine = progressLineRef.current;
    const sparkle = sparkleRef.current;
    const bgElements = bgElementsRef.current;
    const overlay = overlayRef.current;

    if (!loader || !logoContainer || !progressLine || !overlay) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        onComplete: () => setIsVisible(false),
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial states
      gsap.set(logoContainer, { scale: 0.85, opacity: 0, y: 15 });
      gsap.set(title, { opacity: 0, y: 10 });
      gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(sparkle, { opacity: 0, x: "-10px" });
      
      const letters = subtitle?.querySelectorAll("span");
      if (letters) {
        gsap.set(letters, { opacity: 0, filter: "blur(4px)" });
      }

      // Background elements floating
      if (bgElements) {
        const items = bgElements.querySelectorAll(".float-item");
        items.forEach((item, i) => {
          gsap.set(item, { 
            opacity: 0, 
            y: gsap.utils.random(10, 40), 
            x: gsap.utils.random(-20, 20), 
            rotation: gsap.utils.random(-10, 10) 
          });
          
          gsap.to(item, {
            y: "-=40",
            x: "+=15",
            rotation: "+=5",
            duration: gsap.utils.random(6, 10),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3
          });
        });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Exit Animation
          const exitTl = gsap.timeline({
            onComplete: () => setIsVisible(false)
          });
          
          // Elements fade and scale out smoothly
          exitTl.to(logoContainer, { scale: 1.15, filter: "blur(8px)", opacity: 0, duration: 0.7, ease: "power4.inOut" }, 0);
          exitTl.to([title, subtitle, progressLine.parentElement], { opacity: 0, y: -20, duration: 0.5, ease: "power3.in" }, 0);
          
          // Blur background
          exitTl.to(loader, { backdropFilter: "blur(20px)", duration: 0.4 }, 0);
          
          // Curtain slide up
          exitTl.to(overlay, { y: "-100%", duration: 1.2, ease: "expo.inOut" }, 0.2);
          
          // Final container fade out
          exitTl.to(loader, { opacity: 0, duration: 0.5 }, 0.9);
        }
      });

      // Background fade in
      if (bgElements) {
        tl.to(bgElements.querySelectorAll(".float-item"), { opacity: 0.04, duration: 1.5, stagger: 0.2 }, 0);
      }

      // Logo entrance
      tl.to(logoContainer, { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "expo.out" }, 0.2);
      
      // Gentle breathing glow
      gsap.to(logoContainer, {
        filter: "drop-shadow(0 0 20px rgba(244,63,94,0.3)) drop-shadow(0 0 35px rgba(168,85,247,0.15))",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Title & Progress
      tl.to(title, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, 0.5);
      tl.to(progressLine, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0.6);
      
      // Subtitle letter reveal
      if (letters) {
        tl.to(letters, { 
          opacity: 1, 
          filter: "blur(0px)", 
          duration: 0.5, 
          stagger: 0.04, 
          ease: "power2.out" 
        }, 0.8);
      }

      // Sparkle travels at 100%
      tl.to(sparkle, { opacity: 1, duration: 0.1 }, 2.4);
      tl.to(sparkle, { x: "100%", duration: 0.6, ease: "power4.out" }, 2.4);
      tl.to(sparkle, { opacity: 0, duration: 0.3 }, 2.7);

      // Brief hold before exit
      tl.to({}, { duration: 0.3 }); 

    }, loader);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  const subtitleText = "Preserving your beautiful moments...";

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Dark background overlay sliding curtain */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-[#09090B] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
        style={{ willChange: "transform" }}
      >
        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090B_100%)] opacity-90" />
        
        {/* Subtle animated gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Floating Background Elements */}
        <div ref={bgElementsRef} className="absolute inset-0 overflow-hidden">
          {/* Polaroids / Frames */}
          <div className="float-item absolute top-[15%] left-[20%] w-32 h-40 border-[3px] border-white/5 rounded-sm bg-white/[0.02] backdrop-blur-[2px]" />
          <div className="float-item absolute top-[60%] right-[15%] w-24 h-32 border-[3px] border-white/5 rounded-sm bg-white/[0.02] backdrop-blur-[2px]" />
          <div className="float-item absolute bottom-[20%] left-[30%] w-28 h-36 border-[3px] border-white/5 rounded-sm bg-white/[0.02] backdrop-blur-[2px]" />
          
          {/* Tiny sparkles */}
          <div className="float-item absolute top-[30%] right-[35%] w-[3px] h-[3px] rounded-full bg-white/40 blur-[1px]" />
          <div className="float-item absolute bottom-[40%] left-[45%] w-1 h-1 rounded-full bg-white/30 blur-[1px]" />
          <div className="float-item absolute top-[50%] left-[10%] w-[2px] h-[2px] rounded-full bg-rose-300/40 blur-[1px]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center mt-[-5%]">
        {/* Logo */}
        <div
          ref={logoContainerRef}
          className="relative mb-8"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/icon.png" 
            alt="MemoryFlix Logo" 
            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-[1.25rem] shadow-2xl border border-white/5" 
          />
        </div>

        {/* Text */}
        <div 
          ref={titleRef} 
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3" 
          style={{ willChange: "transform, opacity" }}
        >
          Memory<span className="text-rose-400">Flix</span>
        </div>

        <div 
          ref={subtitleRef} 
          className="text-sm sm:text-base text-zinc-400 font-medium tracking-wide mb-14 flex space-x-[2px]" 
          style={{ willChange: "transform, opacity" }}
        >
          {subtitleText.split("").map((char, i) => (
            <span key={i} className={char === " " ? "w-1.5" : ""} style={{ willChange: "opacity, filter" }}>
              {char}
            </span>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="relative w-48 sm:w-64 h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
          <div 
            ref={progressLineRef}
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full"
            style={{ 
              willChange: "transform", 
              boxShadow: "0 0 12px rgba(244,63,94,0.6), 0 0 20px rgba(168,85,247,0.4)" 
            }}
          />
          <div
            ref={sparkleRef}
            className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-white rounded-full blur-[3px]"
            style={{ 
              willChange: "transform, opacity", 
              boxShadow: "0 0 15px white, 0 0 30px rgba(255,255,255,0.5)",
              opacity: 0
            }}
          />
        </div>
      </div>
    </div>
  );
}
