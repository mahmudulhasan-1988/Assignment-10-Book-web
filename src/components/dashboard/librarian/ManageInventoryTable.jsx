"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  EyeOff,
  Loader2,
  AlertCircle,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  available: { label: "Published", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pending: { label: "Pending Approval", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  checked_out: { label: "Checked Out", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function ManageInventoryTable() {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [unpublishing, setUnpublishing] = useState(null);

  const fetchMyBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        // Filter books owned by this librarian
        const myBooks = data.filter((book) => book.ownerId === session?.user?.id);
        setBooks(myBooks);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyBooks();
    }
  }, [session?.user?.id, fetchMyBooks]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.user?.id) {
        fetchMyBooks();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [session?.user?.id, fetchMyBooks]);

  async function handleDelete(bookId, bookTitle) {
    setDeleting(bookId);
    try {
      const res = await fetch(`/api/books?id=${bookId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`"${bookTitle}" has been deleted.`);
        await fetchMyBooks();
        setConfirmDeleteId(null);
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    } finally {
      setDeleting(null);
    }
  }

  async function handleUnpublish(bookId, bookTitle) {
    setUnpublishing(bookId);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookId, status: "pending" }),
      });
      if (res.ok) {
        toast.success(`"${bookTitle}" has been unpublished.`);
        await fetchMyBooks();
      } else {
        toast.error("Failed to unpublish book");
      }
    } catch (error) {
      console.error("Error unpublishing book:", error);
      toast.error("Failed to unpublish book");
    } finally {
      setUnpublishing(null);
    }
  }

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

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <BookOpen size={48} className="mb-4 text-[var(--rr-ink-dim)] opacity-30" />
        <p className="text-[var(--rr-ink-dim)]">You haven&apos;t added any books yet.</p>
        <p className="text-sm text-[var(--rr-ink-dim)] mt-1">Use the Add Book form to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] overflow-hidden">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3">
        <span className="text-sm text-[var(--rr-ink-dim)]">
          {books.length} books in your inventory
        </span>
        <button
          onClick={fetchMyBooks}
          className="flex items-center gap-1.5 text-xs text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)] transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rr-hairline)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--rr-ink-dim)]">
                Book
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--rr-ink-dim)]">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--rr-ink-dim)]">
                Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--rr-ink-dim)]">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--rr-ink-dim)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rr-hairline)]">
            {books.map((book) => {
              const status = STATUS_CONFIG[book.status] || STATUS_CONFIG.pending;
              const isConfirming = confirmDeleteId === book.id;

              return (
                <tr
                  key={book.id}
                  className="transition-colors hover:bg-[var(--rr-bg)]/50"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/books/${book.id}`}
                      className="font-medium text-[var(--rr-ink)] hover:text-[var(--rr-gold)] transition-colors"
                    >
                      {book.title}
                    </Link>
                    <div className="text-xs text-[var(--rr-ink-dim)]">{book.author}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--rr-ink-dim)]">
                    {book.category}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm font-semibold text-[var(--rr-gold)]">
                      ${book.deliveryFee.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {isConfirming ? (
                        <>
                          <span className="text-xs text-[var(--rr-ink-dim)]">Delete?</span>
                          <button
                            onClick={() => handleDelete(book.id, book.title)}
                            disabled={deleting === book.id}
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {deleting === book.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : null}
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Edit */}
                          <Link
                            href={`/books/${book.id}`}
                            className="flex items-center gap-1 rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                            title="View/Edit book"
                          >
                            <Edit size={12} />
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDeleteId(book.id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete book"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>

                          {/* Unpublish - only for Published books */}
                          {book.status === "available" && (
                            <button
                              onClick={() => handleUnpublish(book.id, book.title)}
                              disabled={unpublishing === book.id}
                              className="flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-colors disabled:opacity-50"
                              title="Unpublish book"
                            >
                              {unpublishing === book.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <EyeOff size={12} />
                              )}
                              Unpublish
                            </button>
                          )}

                          {/* Pending - show awaiting approval message */}
                          {book.status === "pending" && (
                            <span
                              className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                              title="A librarian cannot publish a pending book — an admin must approve it first."
                            >
                              <AlertCircle size={12} />
                              Awaiting Approval
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
