"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Upload, Image as ImageIcon, Check } from "lucide-react";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

interface FormImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

const SAMPLE_PHOTOS = [
  { label: "Photo 1", url: "/1.png" },
  { label: "Photo 2", url: "/2.png" },
  { label: "Photo 3", url: "/3.png" },
];

export default function FormImageUploader({
  label,
  value,
  onChange,
  required,
}: FormImageUploaderProps) {
  const [customInput, setCustomInput] = useState(false);

  const handleUploadSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setCustomInput(!customInput)}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
        >
          {customInput ? "Choose sample" : "Enter custom URL"}
        </button>
      </div>

      {/* Current Photo Preview and Actions */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-white/10">
        {/* Preview Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          {customInput ? (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
            />
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Cloudinary Upload Button */}
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  onSuccess={handleUploadSuccess}
                  options={{
                    folder: "memoryflix",
                    resourceType: "image",
                    maxFiles: 1,
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                  )}
                </CldUploadWidget>
              ) : null}

              {/* Sample Photo Quick Selectors */}
              <div className="flex items-center gap-1.5">
                {SAMPLE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(sample.url)}
                    className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                      value === sample.url
                        ? "border-rose-500 ring-2 ring-rose-500/50 scale-105"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                    title={sample.label}
                  >
                    <Image
                      src={sample.url}
                      alt={sample.label}
                      fill
                      className="object-cover"
                    />
                    {value === sample.url && (
                      <div className="absolute inset-0 bg-rose-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
