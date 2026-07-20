"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rr-bg)] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle size={36} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--rr-ink)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 rounded-lg bg-[var(--rr-surface)] px-3 py-2 font-mono text-xs text-[var(--rr-ink-dim)]">
            Error: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-6 py-3 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface)] transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
