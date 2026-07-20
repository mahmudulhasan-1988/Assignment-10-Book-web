"use client";

import { useState } from "react";
import { Check, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  submittedAt?: string;
  createdAt?: string;
}

export function BookApprovalQueue({ books, onRefresh }: { books: Book[]; onRefresh: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleApprove(book: Book) {
    setLoadingId(book.id);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: book.id, status: "available" }),
      });

      if (res.ok) {
        toast.success(`"${book.title}" has been approved and published!`);
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve book");
      }
    } catch (error) {
      console.error("Error approving book:", error);
      toast.error("Failed to approve book. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReject(book: Book) {
    setLoadingId(book.id);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: book.id, status: "checked_out" }),
      });

      if (res.ok) {
        toast.success(`"${book.title}" has been rejected.`);
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to reject book");
      }
    } catch (error) {
      console.error("Error rejecting book:", error);
      toast.error("Failed to reject book. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--rr-ink)]">
          Book Approvals
        </h2>
        <span className="text-sm text-[var(--rr-ink-dim)]">
          {books.length} pending
        </span>
      </div>

      {books.length === 0 ? (
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] py-12 text-center">
          <p className="text-[var(--rr-ink-dim)]">No books pending approval</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--rr-ink)]">
                    {book.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {book.author}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {book.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {formatDate(book.submittedAt || book.createdAt || "")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApprove(book)}
                        disabled={loadingId === book.id}
                        className="flex items-center gap-1 rounded-lg bg-[var(--rr-sage)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--rr-sage)]/80 disabled:opacity-50 transition-colors"
                      >
                        {loadingId === book.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(book)}
                        disabled={loadingId === book.id}
                        className="flex items-center gap-1 rounded-lg border border-[var(--rr-wine)]/30 px-3 py-1.5 text-xs font-medium text-[var(--rr-wine)] hover:bg-[var(--rr-wine)]/10 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 size={12} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
