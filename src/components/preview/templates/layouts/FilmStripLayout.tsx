import { useRef } from "react";
import { LayoutItem } from "../../ChapterLayoutRenderer";
import { useFilmStripAnimation } from "../../LayoutAnimations";

export default function FilmStripLayout({ items, renderItem }: { items: LayoutItem[], renderItem: (i: LayoutItem) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFilmStripAnimation(containerRef);
  return (
    <div ref={containerRef} className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory hide-scrollbar">
      {items.map(item => (
        <div key={item.item.id} className="snap-center shrink-0 w-72 md:w-96 aspect-video" data-filmstrip-item style={{ willChange: "transform, opacity" }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
