import { MediaAsset } from "@prisma/client";

export default function DragPreviewCard({ asset, selectedCount }: { asset: MediaAsset, selectedCount: number }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-500 shadow-2xl shadow-rose-500/50 ring-2 ring-rose-400 ring-offset-2 ring-offset-black scale-105 rotate-2 opacity-95">
      {asset.type === "IMAGE" ? (
         
        <img
          src={asset.url}
          alt="Dragging"
          className="object-cover w-full h-full"
        />
      ) : (
        <video src={asset.url} className="object-cover w-full h-full" />
      )}
      <div className="absolute inset-0 bg-rose-500/20" />
      
      {selectedCount > 1 && (
        <div className="absolute -top-3 -right-3 z-50 bg-rose-500 text-white font-black text-sm px-3 py-1.5 rounded-full shadow-lg border-2 border-[#111]">
          {selectedCount} Photos
        </div>
      )}
    </div>
  );
}
