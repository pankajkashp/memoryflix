import { useRef } from "react";
import { LayoutItem } from "../../../ChapterLayoutRenderer";
import { useMasonryAnimation } from "../../LayoutAnimations";

export default function MasonryLayout({ items, renderItem }: { items: LayoutItem[], renderItem: (i: LayoutItem) => React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useMasonryAnimation(containerRef);
  const count = items.length;

  if (count === 4) {
    // 2x2 Collage
    return (
      <div ref={containerRef} className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.item.id} className="aspect-square w-full h-full" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count === 6) {
    // Masonry Collage
    return (
      <div ref={containerRef} className="columns-2 md:columns-3 gap-4 space-y-4">
        {items.map(item => (
          <div key={item.item.id} className="break-inside-avoid" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count === 9) {
    // Premium memory collage (1 hero, 8 smaller)
    return (
      <div ref={containerRef} className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <div className="col-span-3 md:col-span-2 row-span-2 md:row-span-2 aspect-square md:aspect-auto" data-masonry-item style={{ willChange: "transform, opacity" }}>
          {renderItem(items[0])}
        </div>
        {items.slice(1).map(item => (
          <div key={item.item.id} className="aspect-square w-full h-full" data-masonry-item style={{ willChange: "transform, opacity" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  if (count >= 15) {
    // Large cinematic collage
    return (
      <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {items.map((item, idx) => {
          // Make every 5th item large
          const isLarge = idx % 5 === 0;
          return (
            <div key={item.item.id} className={`${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} aspect-square w-full h-full`} data-masonry-item style={{ willChange: "transform, opacity" }}>
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback simple staggered masonry
  return (
    <div ref={containerRef} className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {items.map(item => (
        <div key={item.item.id} className="break-inside-avoid" data-masonry-item style={{ willChange: "transform, opacity" }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
