import { MediaAsset, Chapter } from "@prisma/client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableMediaItem from "./SortableMediaItem";

export default function DroppableSection({ 
  id, 
  title, 
  emoji, 
  items, 
  storyId, 
  coverMediaId, 
  chapters,
  activeAssetId,
  selectedMediaIds,
  onSelectToggle
}: { 
  id: string; 
  title: string; 
  emoji?: string | null; 
  items: MediaAsset[]; 
  storyId?: string;
  coverMediaId?: string | null;
  chapters?: Chapter[];
  activeAssetId: string | null;
  selectedMediaIds: string[];
  onSelectToggle: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4 px-2">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="bg-white/10 text-zinc-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className={`min-h-[160px] p-4 sm:p-6 rounded-3xl border-2 transition-all duration-300 ${
          isOver ? "bg-rose-500/10 border-rose-500 border-dashed" : "bg-black/20 border-white/5 border-solid"
        }`}
      >
        {items.length === 0 ? (
          <div className="w-full h-32 flex items-center justify-center">
            <p className="text-zinc-500 font-medium">Drop photos here</p>
          </div>
        ) : (
          <SortableContext
            id={id}
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((asset, index) => (
                <SortableMediaItem
                  key={asset.id}
                  asset={asset}
                  storyId={storyId}
                  coverMediaId={coverMediaId}
                  chapters={chapters}
                  position={index + 1}
                  isBeingDragged={activeAssetId === asset.id}
                  isSelected={selectedMediaIds.includes(asset.id)}
                  onSelectToggle={onSelectToggle}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
