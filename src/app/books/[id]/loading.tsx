import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-4 w-32" />
          <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row">
              <Skeleton className="h-80 w-48 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/3" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5 rounded" />
                  ))}
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
