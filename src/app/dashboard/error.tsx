"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-[var(--rr-ink)]">Dashboard Error</h2>
        <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
          Failed to load dashboard data. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 rounded-lg bg-[var(--rr-surface)] px-3 py-2 font-mono text-xs text-[var(--rr-ink-dim)]">
            {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    </div>
  );
}
