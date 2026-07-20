"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rr-bg)] px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--rr-surface)]">
            <BookOpen size={40} className="text-[var(--rr-ink-dim)] opacity-40" />
          </div>
        </div>
        <h1 className="font-display text-6xl font-bold text-[var(--rr-ink)]">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-[var(--rr-ink)]">Page Not Found</h2>
        <p className="mt-2 max-w-sm text-sm text-[var(--rr-ink-dim)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
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
