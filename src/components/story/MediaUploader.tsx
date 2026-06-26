"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { saveMediaAsset } from "@/app/actions/media";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

export default function MediaUploader({ storyId, chapterId }: { storyId: string, chapterId?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (result: any) => {
    setIsUploading(true);
    setError(null);
    try {
      const info = result.info;
      const type = info.resource_type === "video" ? "VIDEO" : "IMAGE";

      await saveMediaAsset({
        storyId,
        url: info.secure_url,
        publicId: info.public_id,
        type,
        bytes: info.bytes,
        duration: info.duration,
        chapterId,
      });
    } catch (err: any) {
      setError(err.message || "Failed to save media asset");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        onSuccess={handleSuccess}
        options={{
          folder: "memoryflix",
          resourceType: "auto",
          theme: "minimal",
        }}
      >
        {({ open }) => {
          if (chapterId) {
            // Compact Mode
            return (
              <button
                type="button"
                onClick={() => open()}
                disabled={isUploading}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload Photos"}
              </button>
            );
          }

          // Default Large Mode
          return (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="group relative w-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-[#0a0a0a] py-20 text-center transition-all hover:bg-white/5 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 rounded-full bg-white/5 border border-white/10 p-6 mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="relative z-10 text-2xl font-black text-white mb-2 tracking-tight">
                {isUploading ? "Processing Upload..." : "Select Media"}
              </h3>
              <p className="relative z-10 text-zinc-400 text-lg">
                Drag and drop your photos and videos here
              </p>
            </motion.button>
          );
        }}
      </CldUploadWidget>
      
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center backdrop-blur-md">
          {error}
        </div>
      )}
    </div>
  );
}
