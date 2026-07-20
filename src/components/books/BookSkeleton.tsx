export default function BookSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] animate-pulse bg-[var(--rr-surface-2)]" />

      {/* Content Skeleton */}
      <div className="p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--rr-surface-2)]" />
        <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-[var(--rr-surface-2)]" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-3 w-12 animate-pulse rounded bg-[var(--rr-surface-2)]" />
          <div className="h-3 w-14 animate-pulse rounded bg-[var(--rr-surface-2)]" />
        </div>
      </div>
    </div>
  );
}
