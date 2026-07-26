export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[var(--rr-surface-2)] ${className}`} style={style} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#4d6a48]/20 to-[#33472f]/20 p-6">
      <div className="mb-4 h-10 w-10 rounded-lg bg-white/10" />
      <div className="h-3 w-20 rounded bg-white/10" />
      <div className="mt-2 h-8 w-16 rounded bg-white/20" />
      <div className="mt-1 h-3 w-24 rounded bg-white/10" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
      <div className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="border-b border-[var(--rr-hairline)] last:border-0 px-4 py-4">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, col) => (
              <Skeleton key={col} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
      <div className="mb-4 h-4 w-32 rounded bg-[var(--rr-surface-2)]" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

const chartHeights = [45, 72, 58, 85, 63, 78];

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
      <div className="mb-4 h-4 w-40 rounded bg-[var(--rr-surface-2)]" />
      <div className="flex items-end gap-2 h-[200px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${chartHeights[i]}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <ChartSkeleton />
    </div>
  );
}
