"use client";

import { useState } from "react";
import { Search, X, Loader2, ChevronUp, ClipboardCopy, Check } from "lucide-react";
import { useDeliveries } from "@/lib/delivery-context";
import toast from "react-hot-toast";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
  Dispatched: "bg-[var(--rr-slate)]/10 text-[var(--rr-slate)]",
  Delivered: "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Dispatched", label: "Dispatched" },
  { value: "Delivered", label: "Delivered" },
];

const NEXT_STATUS: Record<string, string> = {
  Pending: "Dispatched",
  Dispatched: "Delivered",
};

interface Transaction {
  _id?: string;
  id?: string;
  bookTitle: string;
  bookAuthor?: string;
  bookCover?: string;
  userName?: string;
  userEmail?: string;
  deliveryFee?: number;
  status: string;
  paymentStatus?: string;
  category?: string;
  requestDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TransactionsTable({ transactions, onRefresh }: { transactions: Transaction[]; onRefresh?: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { updateDeliveryStatus, fetchDeliveries } = useDeliveries();

  async function handleCopyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // fallback: select text
    }
  }

  const filtered = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const txId = tx._id || tx.id || "";
    const matchesSearch =
      txId.toLowerCase().includes(q) ||
      tx.bookTitle?.toLowerCase().includes(q) ||
      tx.userName?.toLowerCase().includes(q) ||
      tx.userEmail?.toLowerCase().includes(q) ||
      tx.status?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = filtered.reduce((sum, tx) => sum + (tx.deliveryFee || 0), 0);
  const pendingCount = filtered.filter((tx) => tx.status === "Pending").length;
  const dispatchedCount = filtered.filter((tx) => tx.status === "Dispatched").length;
  const deliveredCount = filtered.filter((tx) => tx.status === "Delivered").length;

  async function handleAdvanceStatus(tx: Transaction) {
    const nextStatus = NEXT_STATUS[tx.status];
    if (!nextStatus) return;

    const txId = tx._id || tx.id;
    setLoadingId(txId);
    try {
      await updateDeliveryStatus(txId, nextStatus as any);
      toast.success(`"${tx.bookTitle}" marked as ${nextStatus}`);
      fetchDeliveries();
      onRefresh?.();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update delivery status");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Transactions</h2>
          <span className="rounded-full bg-[var(--rr-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--rr-ink-dim)]">
            {filtered.length} / {transactions.length}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-3 text-center">
          <p className="text-lg font-bold text-[var(--rr-gold)]">${totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-[var(--rr-ink-dim)]">Total Revenue</p>
        </div>
        <div className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-3 text-center">
          <p className="text-lg font-bold text-[var(--rr-gold)]">{pendingCount}</p>
          <p className="text-[10px] text-[var(--rr-ink-dim)]">Pending</p>
        </div>
        <div className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-3 text-center">
          <p className="text-lg font-bold text-[var(--rr-slate)]">{dispatchedCount}</p>
          <p className="text-[10px] text-[var(--rr-ink-dim)]">Dispatched</p>
        </div>
        <div className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-3 text-center">
          <p className="text-lg font-bold text-[var(--rr-sage)]">{deliveredCount}</p>
          <p className="text-[10px] text-[var(--rr-ink-dim)]">Delivered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
          <input
            type="text"
            placeholder="Search by ID, book, user, email, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Book
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Date
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                  {searchQuery || statusFilter !== "all" ? "No transactions match your filters" : "No transactions yet"}
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const txId = tx._id || tx.id;
                const nextStatus = NEXT_STATUS[tx.status];
                return (
                  <tr key={txId} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
                    {/* Transaction ID */}
                    <td className="px-4 py-3">
                      {txId ? (
                        <button
                          onClick={() => handleCopyId(txId)}
                          className="group flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-mono text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors cursor-pointer"
                          title="Click to copy full ID"
                        >
                          {copiedId === txId ? (
                            <>
                              <Check size={12} className="text-[var(--rr-sage)]" />
                              <span className="text-[var(--rr-sage)]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <ClipboardCopy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span>{txId.slice(-8)}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-[var(--rr-ink-dim)]">N/A</span>
                      )}
                    </td>

                    {/* Book */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--rr-ink)]">{tx.bookTitle}</p>
                      {tx.bookAuthor && (
                        <p className="text-xs text-[var(--rr-ink-dim)]">{tx.bookAuthor}</p>
                      )}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-[var(--rr-ink)]">{tx.userName || "Anonymous"}</p>
                      {tx.userEmail && (
                        <p className="text-xs text-[var(--rr-ink-dim)]">{tx.userEmail}</p>
                      )}
                    </td>

                    {/* Fee */}
                    <td className="px-4 py-3 text-sm font-medium text-[var(--rr-gold)]">
                      ${tx.deliveryFee?.toFixed(2) || "0.00"}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-[var(--rr-ink-dim)]">{formatDate(tx.requestDate || tx.createdAt || "")}</p>
                      {tx.updatedAt && tx.updatedAt !== tx.requestDate && (
                        <p className="text-[10px] text-[var(--rr-ink-dim)]">Updated: {formatDateTime(tx.updatedAt)}</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[tx.status] || "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]"}`}>
                        {tx.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      {nextStatus ? (
                        <button
                          onClick={() => handleAdvanceStatus(tx)}
                          disabled={loadingId === txId}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] disabled:opacity-50 transition-colors"
                        >
                          {loadingId === txId ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <ChevronUp size={12} />
                          )}
                          Mark as {nextStatus}
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--rr-ink-dim)]">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
