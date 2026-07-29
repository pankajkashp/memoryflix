import { useRef } from "react";
import { LayoutItem } from "../../ChapterLayoutRenderer";
import { usePolaroidAnimation } from "../../LayoutAnimations";

export default function PolaroidLayout({ items, renderItem }: { items: LayoutItem[], renderItem: (i: LayoutItem) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  usePolaroidAnimation(containerRef);
  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-6 md:gap-12 py-12">
      {items.map((item, idx) => (
        <div 
          key={item.item.id}
          data-polaroid-item
          style={{ willChange: "transform, opacity" }}
          className={`w-48 md:w-64 aspect-square bg-white p-3 pb-12 shadow-2xl transition-transform hover:z-20 hover:scale-110 
            ${idx % 3 === 0 ? '-rotate-6' : idx % 3 === 1 ? 'rotate-3' : '-rotate-2'}
          `}
        >
          <div className="w-full h-full bg-zinc-100 overflow-hidden">
            {renderItem(item)}
          </div>
        </div>
      ))}
    </div>
  );
}
