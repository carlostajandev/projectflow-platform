export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-16 bg-white/10 rounded-full" />
        <div className="h-5 w-12 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}