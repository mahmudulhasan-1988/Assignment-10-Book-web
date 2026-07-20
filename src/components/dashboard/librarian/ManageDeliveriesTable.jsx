"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_BADGE = {
  Pending: "bg-amber-100 text-amber-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
};

const NEXT_STATUS = {
  Pending: "Dispatched",
  Dispatched: "Delivered",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageDeliveriesTable({ deliveries, onAdvanceStatus }) {
  const [advancingId, setAdvancingId] = useState(null);

  async function handleAdvance(deliveryId, newStatus, bookTitle) {
    setAdvancingId(deliveryId);
    try {
      await onAdvanceStatus(deliveryId, newStatus);
      toast.success(`"${bookTitle}" marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update delivery status");
    } finally {
      setAdvancingId(null);
    }
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
              Client
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
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                No delivery requests yet.
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => {
              const upcoming = NEXT_STATUS[delivery.status];
              const isAdvancing = advancingId === delivery._id;
              return (
                <tr key={delivery._id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
                  <td className="px-4 py-3">
                    <span className="font-display text-sm font-medium text-[var(--rr-ink)]">
                      {delivery.bookTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {delivery.userName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-[var(--rr-gold)]">
                      ${(delivery.deliveryFee || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {formatDate(delivery.requestDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[delivery.status] || "bg-gray-100 text-gray-600"}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {upcoming ? (
                      <button
                        onClick={() => handleAdvance(delivery._id, upcoming, delivery.bookTitle)}
                        disabled={isAdvancing}
                        className="flex items-center gap-1 rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors disabled:opacity-50"
                      >
                        {isAdvancing ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : null}
                        Mark as {upcoming}
                      </button>
                    ) : (
                      <span className="font-mono-label text-[10px] uppercase text-[var(--rr-ink-dim)]">
                        Complete
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
