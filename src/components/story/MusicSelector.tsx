"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { MUSIC_TRACKS } from "@/lib/music";
import { updateChapterMusicConfig } from "@/app/actions/chapter";
import { Play, Pause, Check, Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const CldUploadWidget = dynamic(() => import("next-cloudinary").then(mod => mod.CldUploadWidget), { ssr: false });

export default function MusicSelector({ 
  storyId,
  chapterId, 
  currentTrackId,
  currentMusicType,
  currentMusicUrl
}: { 
  storyId: string;
  chapterId: string; 
  currentTrackId: string | null;
  currentMusicType?: string | null;
  currentMusicUrl?: string | null;
}) {
  const [selectedType, setSelectedType] = useState<"BUILT_IN" | "CUSTOM" | "NONE">(
    (currentMusicType as any) || (currentTrackId ? "BUILT_IN" : "NONE")
  );
  const [selectedId, setSelectedId] = useState<string | null>(currentTrackId);
  const [customUrl, setCustomUrl] = useState<string | null>(currentMusicUrl || null);
  const [playingId, setPlayingId] = useState<string | null>(null); // "custom" or track.id
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleSelectNone = () => {
    setSelectedType("NONE");
    setSelectedId(null);
    startTransition(async () => {
      await updateChapterMusicConfig(storyId, chapterId, { type: "NONE" });
    });
  };

  const handleSelectTrack = (id: string) => {
    setSelectedType("BUILT_IN");
    setSelectedId(id);
    startTransition(async () => {
      await updateChapterMusicConfig(storyId, chapterId, { type: "BUILT_IN", trackId: id });
    });
  };

  const handleSelectCustom = () => {
    if (customUrl) {
      setSelectedType("CUSTOM");
      startTransition(async () => {
        await updateChapterMusicConfig(storyId, chapterId, { type: "CUSTOM", url: customUrl });
      });
    }
  };

  const handleUploadSuccess = (result: unknown) => {
    const uploadResult = result as { info: { secure_url: string; public_id: string } };
    const info = uploadResult.info;
    const url = info.secure_url;
    setCustomUrl(url);
    setSelectedType("CUSTOM");
    
    startTransition(async () => {
      await updateChapterMusicConfig(storyId, chapterId, { 
        type: "CUSTOM", 
        url,
        source: info.public_id 
      });
    });
  };

  const handlePlayPause = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation(); // Prevent row selection when clicking play
    
    if (playingId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(url);
      newAudio.play().then(() => {
        setPlayingId(id);
      }).catch(err => {
        console.error("Audio playback failed", err);
      });
      audioRef.current = newAudio;

      newAudio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* ── No Soundtrack ── */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSelectNone}
        className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
          selectedType === "NONE" 
            ? "bg-[#110508] border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]" 
            : "bg-[#0a0a0a] border-white/10 hover:border-white/20 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-xl">
            🔇
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg ${selectedType === "NONE" ? 'text-white' : 'text-zinc-300'}`}>No Soundtrack</span>
            <span className="text-sm text-zinc-500">Keep it quiet, just the memories</span>
          </div>
        </div>
        {isPending && selectedType === "NONE" ? (
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
        ) : selectedType === "NONE" ? (
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-black/50" />
        )}
      </motion.div>

      {/* ── Custom Upload ── */}
      <div className="relative">
        <div className={`rounded-2xl border transition-all overflow-hidden ${
          selectedType === "CUSTOM" 
            ? "bg-[#110508] border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]" 
            : "bg-[#0a0a0a] border-white/10 hover:border-white/20"
        }`}>
          {customUrl ? (
            <div 
              onClick={handleSelectCustom}
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-5 relative z-10">
                <button 
                  onClick={(e) => handlePlayPause(e, "custom", customUrl)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-lg ${
                    playingId === "custom" 
                      ? "bg-rose-500 text-white shadow-rose-500/30 scale-110" 
                      : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {playingId === "custom" ? (
                    <div className="flex gap-1 items-center justify-center h-4">
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                    </div>
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-1" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={`font-bold text-lg flex items-center gap-2 ${selectedType === "CUSTOM" ? 'text-white' : 'text-zinc-300'}`}>
                    <span>🎵</span> Custom Soundtrack
                  </span>
                  <span className="text-sm text-zinc-500">Your uploaded audio file</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  onSuccess={handleUploadSuccess}
                  options={{
                    folder: "memoryflix-audio",
                    resourceType: "video", // Cloudinary processes audio under 'video'
                    clientAllowedFormats: ["mp3", "m4a", "wav"],
                    maxFileSize: 20000000,
                  }}
                >
                  {({ open }) => (
                    <button 
                      onClick={(e) => { e.stopPropagation(); open(); }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      Change File
                    </button>
                  )}
                </CldUploadWidget>

                {isPending && selectedType === "CUSTOM" ? (
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                ) : selectedType === "CUSTOM" ? (
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-black/50" />
                )}
              </div>
            </div>
          ) : (
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign"
              onSuccess={handleUploadSuccess}
              options={{
                folder: "memoryflix-audio",
                resourceType: "video", // Cloudinary processes audio under 'video'
                clientAllowedFormats: ["mp3", "m4a", "wav"],
                maxFileSize: 20000000,
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full flex items-center gap-5 p-5 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white group-hover:bg-rose-500/20 group-hover:border-rose-500/50 transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors">Upload Custom Audio</span>
                    <span className="text-sm text-zinc-500">MP3, WAV, M4A up to 20MB</span>
                  </div>
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MUSIC_TRACKS.map((track) => {
          const isSelected = selectedType === "BUILT_IN" && selectedId === track.id;
          const isPlaying = playingId === track.id;
          
          return (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectTrack(track.id)}
              className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all group overflow-hidden ${
                isSelected 
                  ? "bg-[#110508] border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]" 
                  : "bg-[#0a0a0a] border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {/* Background glow when playing */}
              {isPlaying && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}

              <div className="flex items-center gap-5 relative z-10">
                <button 
                  onClick={(e) => handlePlayPause(e, track.id, track.url)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-lg ${
                    isPlaying 
                      ? "bg-rose-500 text-white shadow-rose-500/30 scale-110" 
                      : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {isPlaying ? (
                    <div className="flex gap-1 items-center justify-center h-4">
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      <motion.div className="w-1 h-full bg-white rounded-full" animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                    </div>
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-1" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span className={`font-bold text-lg flex items-center gap-2 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    <span>{track.emoji}</span> {track.title}
                  </span>
                  <span className="text-sm text-zinc-500">MemoryFlix Originals</span>
                </div>
              </div>
              
              <div className="relative z-10 flex items-center">
                {isPending && isSelected ? (
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                ) : isSelected ? (
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-black/50 group-hover:border-white/30 transition-colors" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
