"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, color = "text-[var(--rr-gold)]" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
            {label}
          </span>
          <span className="text-3xl font-bold text-[var(--rr-ink)] tabular-nums">
            {value}
          </span>
        </div>
        <div className={`rounded-full bg-[var(--rr-surface-2)] p-2.5 ${color}`}>
          <Icon size={20} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
