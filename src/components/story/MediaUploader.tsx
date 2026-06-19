"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { saveMediaAsset } from "@/app/actions/media";

export default function MediaUploader({ storyId }: { storyId: string }) {
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
          theme: "minimal", // Try to use minimal theme to blend better
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="group relative w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 py-12 text-center transition-all hover:bg-white/10 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="rounded-full bg-rose-500/20 p-4 mb-4 text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {isUploading ? "Processing Upload..." : "Upload Photos & Videos"}
              </h3>
              <p className="text-sm text-zinc-400">
                Drag and drop or click to browse files
              </p>
            </button>
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
