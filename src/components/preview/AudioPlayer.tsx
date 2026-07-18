"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { MUSIC_TRACKS } from "@/lib/music";
import { Chapter } from "@prisma/client";

export default function AudioPlayer({ 
  chapters,
  activeChapterId 
}: { 
  chapters: Chapter[];
  activeChapterId: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userManuallyPaused, setUserManuallyPaused] = useState(false);
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Determine current chapter's music
  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const effectiveType = activeChapter?.musicType || "NONE";
  const trackId = activeChapter?.musicTrack;
  const musicUrl = activeChapter?.musicUrl;
  
  const track = effectiveType === "BUILT_IN" ? MUSIC_TRACKS.find(t => t.id === trackId) : null;
  const finalUrl = effectiveType === "BUILT_IN" ? track?.url : (effectiveType === "CUSTOM" ? musicUrl : null);

  const title = effectiveType === "BUILT_IN" ? track?.title : (effectiveType === "CUSTOM" ? "Custom Soundtrack" : "");
  const subtitle = effectiveType === "BUILT_IN" ? "MemoryFlix Originals" : (effectiveType === "CUSTOM" ? "Your Audio" : "");

  const fadeOut = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    const fadeAudio = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = 0;
        clearInterval(fadeAudio);
      }
    }, 100);
  };

  const fadeIn = (audio: HTMLAudioElement) => {
    audio.volume = 0;
    const fadeAudio = setInterval(() => {
      if (audio.volume < 0.45) {
        audio.volume += 0.05;
      } else {
        audio.volume = 0.5;
        clearInterval(fadeAudio);
      }
    }, 100);
  };

  // Handle active chapter changes and crossfading
  useEffect(() => {
    if (!finalUrl) {
      if (currentAudioRef.current) {
        fadeOut(currentAudioRef.current);
        currentAudioRef.current = null;
      }
      return;
    }

    if (currentAudioRef.current && currentAudioRef.current.src.includes(finalUrl)) {
      return; // Already playing this track
    }

    const newAudio = new Audio(finalUrl);
    newAudio.loop = true;
    newAudio.volume = 0;
    newAudio.muted = isMuted;

    if (isPlaying && !userManuallyPaused) {
      newAudio.play().then(() => {
        fadeIn(newAudio);
        fadeOut(currentAudioRef.current);
        fadingAudioRef.current = currentAudioRef.current;
        currentAudioRef.current = newAudio;
      }).catch(() => {
        // Autoplay often fails if user hasn't interacted, safe to ignore
      });
    } else {
      fadeOut(currentAudioRef.current);
      currentAudioRef.current = newAudio;
    }

    // Cleanup on unmount
    return () => {
      // Don't pause here otherwise crossfade breaks on re-renders, 
      // but we need to ensure we don't leak.
      // We will let the audio play and be garbage collected or paused in fadeOut
    };
  }, [finalUrl, isPlaying, userManuallyPaused, isMuted]);

  // Global play listener for "Play Story" or "Play" buttons
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') && target.closest('button')?.textContent?.toLowerCase().includes('play')) {
        if (!isPlaying && !userManuallyPaused && currentAudioRef.current) {
          setIsPlaying(true);
          currentAudioRef.current.play().then(() => {
            fadeIn(currentAudioRef.current!);
          }).catch(() => {});
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isPlaying, userManuallyPaused]);

  // If no chapter has music, don't show the player at all
  const hasAnyMusic = chapters.some(c => c.musicType && c.musicType !== "NONE");
  if (!hasAnyMusic) return null;

  const togglePlay = () => {
    if (isPlaying) {
      setUserManuallyPaused(true);
      setIsPlaying(false);
      fadeOut(currentAudioRef.current);
    } else {
      setUserManuallyPaused(false);
      setIsPlaying(true);
      if (currentAudioRef.current) {
        currentAudioRef.current.play().then(() => {
          fadeIn(currentAudioRef.current!);
        }).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.muted = !isMuted;
    }
    if (fadingAudioRef.current) {
      fadingAudioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Only show the player if there's actually a title to show, or if we have finalUrl
  if (!title) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl group hover:bg-black/80 transition-colors">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-gradient-to-tr from-rose-500 to-purple-600 animate-pulse' : 'bg-white/10'}`}>
          <Music className={`w-5 h-5 ${isPlaying ? 'text-white' : 'text-zinc-400'}`} />
        </div>
        
        <div className="flex flex-col w-32 md:w-48 overflow-hidden">
          <span className="text-white font-bold text-sm truncate">{title}</span>
          <span className="text-zinc-400 text-xs truncate">{subtitle}</span>
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 pl-3">
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button 
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            title="Volume"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
