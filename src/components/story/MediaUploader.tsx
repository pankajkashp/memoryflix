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
  console.log(
    "Cloud Name:",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );

  return (
    <div className="mt-4">
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        onSuccess={handleSuccess}
        options={{
          folder: "memoryflix",
          resourceType: "auto",
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              disabled={isUploading}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? "Saving..." : "Upload Photos & Videos"}
            </button>
          );
        }}
      </CldUploadWidget>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
