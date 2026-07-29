import { useRef } from "react";
import { LayoutItem } from "../../ChapterLayoutRenderer";
import { useTimelineAnimation } from "../../LayoutAnimations";

export default function TimelineLayout({ items, renderItem }: { items: LayoutItem[], renderItem: (i: LayoutItem) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useTimelineAnimation(containerRef);
  return (
    <div
      ref={containerRef}
      className="relative max-w-3xl mx-auto space-y-12 before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:w-0.5 before:w-0.5 before:bg-white/10"
      data-timeline-line
    >
      {items.map((item, idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <div key={item.item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group" data-timeline-item style={{ willChange: "transform, opacity" }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f0f0f] bg-rose-500 absolute left-0 md:left-1/2 -translate-x-1/2 shadow flex-shrink-0 z-10" />
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] ml-auto md:ml-0 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="w-full aspect-video md:aspect-square mb-4 bg-black overflow-hidden rounded-lg">
                {renderItem(item)}
              </div>
              <div className="text-sm font-medium text-zinc-400">Memory {idx + 1}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
