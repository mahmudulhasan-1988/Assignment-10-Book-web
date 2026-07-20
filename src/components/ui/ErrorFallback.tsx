"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-[var(--rr-ink)]">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-[var(--rr-ink-dim)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}
