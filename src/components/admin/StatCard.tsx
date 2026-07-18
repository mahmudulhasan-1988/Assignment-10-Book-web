"use client";

import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  growthPct: number;
  icon: LucideIcon;
}

export function StatCard({ label, value, growthPct, icon: Icon }: StatCardProps) {
  const isPositive = growthPct >= 0;

  return (
    <Card variant="default" className="border border-ink-100">
      <Card.Content className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            {label}
          </span>
          <span className="font-serif text-3xl leading-none text-ink-900 tabular-nums">
            {value}
          </span>
          <span
            className={
              "mt-1 text-xs font-medium " +
              (isPositive ? "text-emerald-600" : "text-red-600")
            }
          >
            {isPositive ? "+" : ""}
            {growthPct.toFixed(1)}% vs. last month
          </span>
        </div>
        <div className="rounded-full bg-gold-100 p-2.5 text-gold-700">
          <Icon size={20} strokeWidth={1.75} />
        </div>
      </Card.Content>
    </Card>
  );
}
