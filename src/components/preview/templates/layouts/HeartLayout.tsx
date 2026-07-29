"use client";

import { motion } from "framer-motion";

import { LayoutItem } from "../../ChapterLayoutRenderer";

export default function HeartLayout({
  items,
  renderItem,
}: {
  items: LayoutItem[];
  renderItem: (i: LayoutItem) => React.ReactNode;
}) {
  const images = items.filter((m) => m.item.type === "IMAGE");
  
  if (images.length < 12) {
    return (
      <div className="w-full max-w-4xl mx-auto aspect-square md:aspect-video rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 backdrop-blur-sm shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
          <span className="text-4xl drop-shadow-lg">❤️</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3 text-center">
          Heart Layout Locked
        </h3>
        <p className="text-zinc-400 text-center text-lg max-w-md">
          Add <strong className="text-rose-400">{12 - images.length} more photos</strong> to this chapter to unlock the premium Heart Layout.
        </p>
      </div>
    );
  }

  // We only use the first 12 images for the heart shape
  const heartPhotos = images.slice(0, 12);

  // Grid configuration for a 7x5 checkerboard heart
  const gridPositions = [
    { row: 1, col: 2, rotate: -8 },
    { row: 1, col: 6, rotate: 10 },
    { row: 2, col: 1, rotate: -12 },
    { row: 2, col: 3, rotate: -4 },
    { row: 2, col: 5, rotate: 6 },
    { row: 2, col: 7, rotate: 14 },
    { row: 3, col: 2, rotate: -6 },
    { row: 3, col: 4, rotate: 0 },
    { row: 3, col: 6, rotate: 8 },
    { row: 4, col: 3, rotate: -10 },
    { row: 4, col: 5, rotate: 12 },
    { row: 5, col: 4, rotate: 0 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-12 py-12">
      <div className="relative w-full aspect-[7/5] sm:aspect-[7/6] max-w-4xl mx-auto">
        <div 
          className="absolute inset-0 grid gap-2 sm:gap-4 md:gap-6"
          style={{
            gridTemplateColumns: "repeat(7, 1fr)",
            gridTemplateRows: "repeat(5, 1fr)",
          }}
        >
          {heartPhotos.map((photo, i) => {
            const pos = gridPositions[i];
            return (
              <motion.div
                key={photo.item.id}
                initial={{ opacity: 0, scale: 0.5, rotate: pos.rotate - 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: pos.rotate }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                style={{
                  gridColumn: pos.col,
                  gridRow: pos.row,
                }}
                className="relative group z-10 hover:z-50"
              >
                {/* Photo Frame Container */}
                <div className="w-full h-full relative rounded-xl sm:rounded-2xl bg-white p-1 sm:p-2 shadow-xl shadow-black/50 transition-all duration-500 group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-rose-500/20">
                  <div className="w-full h-full relative overflow-hidden rounded-lg sm:rounded-xl bg-zinc-100">
                    {renderItem(photo)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none -z-10 scale-150" />
      </div>

      {/* Render remaining media if there are more than 12 */}
      {items.length > 12 && (
        <div className="mt-32">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((m) => {
               // Render only if it's not in the first 12 images
               const isHeartPhoto = heartPhotos.some(hp => hp.item.id === m.item.id);
               if (isHeartPhoto) return null;
               return (
                  <div key={m.item.id} className="aspect-square w-full h-full rounded-xl overflow-hidden shadow-lg border border-white/10">
                    {renderItem(m)}
                  </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
