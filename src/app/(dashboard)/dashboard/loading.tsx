export default function DashboardLoading() {
  return (
    <div className="w-full h-full flex flex-col space-y-12">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-5 w-64 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Cover image area */}
            <div className="aspect-[16/10] bg-white/5" />
            
            {/* Body */}
            <div className="p-4 flex flex-col gap-3">
              <div className="h-3 w-16 bg-white/5 rounded-full" />
              <div className="h-5 w-3/4 bg-white/10 rounded-full" />
              <div className="flex items-center gap-3 mt-1">
                <div className="h-3 w-8 bg-white/5 rounded-full" />
                <div className="h-3 w-8 bg-white/5 rounded-full" />
                <div className="h-3 w-12 bg-white/5 rounded-full" />
              </div>

              {/* Actions row */}
              <div className="mt-4 flex gap-2">
                <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
