"use client";

import { Package, Clock, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDeliveries } from "@/lib/delivery-context";

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Dispatched: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Delivered: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
};

const STATUS_ICON: Record<string, string> = {
  Pending: "⏳",
  Dispatched: "🚚",
  Delivered: "✓",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DeliveryHistoryTable() {
  const { data: session } = useSession();
  const { deliveries, loading } = useDeliveries();

  const userDeliveries = deliveries.filter(
    (d) => d.userId === session?.user?.id
  );

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 flex-1 animate-pulse rounded bg-[var(--rr-surface-2)]" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="border-b border-[var(--rr-hairline)] last:border-0 px-4 py-4">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, col) => (
                <div key={col} className="h-4 flex-1 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
              Book Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
              Delivery Fee
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
              Request Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {userDeliveries.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center px-4 py-16 text-[var(--rr-ink-dim)]">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-bg)]">
                    <Package size={28} className="opacity-40" />
                  </div>
                  <p className="text-sm font-medium">No delivery requests yet</p>
                  <p className="mt-1 text-xs opacity-60">Your delivery history will appear here</p>
                </div>
              </td>
            </tr>
          ) : (
            userDeliveries.map((delivery) => (
              <tr key={delivery._id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--rr-bg)]">
                      <span className="text-sm">{STATUS_ICON[delivery.status]}</span>
                    </div>
                    <span className="font-display text-sm font-medium text-[var(--rr-ink)]">
                      {delivery.bookTitle}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-[var(--rr-gold)]">
                    ${(delivery.deliveryFee || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--rr-ink-dim)]">
                    <Clock size={14} className="opacity-50" />
                    {formatDate(delivery.requestDate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[delivery.status] || "bg-gray-100 text-gray-600"}`}>
                    {delivery.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
