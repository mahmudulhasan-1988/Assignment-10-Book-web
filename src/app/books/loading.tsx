import { GallerySkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <div className="border-b border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mb-6 space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--rr-surface-2)]" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-[var(--rr-surface-2)]" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-xl bg-[var(--rr-surface-2)]" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 sm:px-6">
        <GallerySkeleton count={8} />
      </div>
    </div>
  );
}
