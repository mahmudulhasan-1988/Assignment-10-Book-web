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
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  available: { label: "Published", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pending: { label: "Pending Approval", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  checked_out: { label: "Checked Out", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

const ITEMS_PER_PAGE = 10;

export default function ManageInventoryTable() {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [unpublishing, setUnpublishing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMyBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books?page=1&limit=1000");
      if (res.ok) {
        const data = await res.json();
        // Handle both paginated and array responses
        const allBooks = data.books || (Array.isArray(data) ? data : []);
        // Filter books owned by this librarian
        const myBooks = allBooks.filter((book) => book.ownerId === session?.user?.id);
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

  // Filter books
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalFiltered = filteredBooks.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  function goToPage(page) {
    setCurrentPage(page);
  }

  // Generate page numbers
  function getPageNumbers() {
    const pages = [];
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }

    return pages;
  }

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--rr-ink-dim)]">
            {filteredBooks.length} books in your inventory
          </span>
          <button
            onClick={fetchMyBooks}
            className="flex items-center gap-1.5 text-xs text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)] transition-colors"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] py-2 pl-9 pr-8 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
            >
              <X size={14} />
            </button>
          )}
        </div>
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
            {paginatedBooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                  {searchQuery ? "No books match your search" : "No books found"}
                </td>
              </tr>
            ) : (
              paginatedBooks.map((book) => {
                const status = STATUS_CONFIG[book.status] || STATUS_CONFIG.pending;
                const isConfirming = confirmDeleteId === (book._id || book.id);

                return (
                  <tr
                    key={book._id || book.id}
                    className="transition-colors hover:bg-[var(--rr-bg)]/50"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/books/${book._id || book.id}`}
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
                        ${(book.deliveryFee || 0).toFixed(2)}
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
                              onClick={() => handleDelete(book._id || book.id, book.title)}
                              disabled={deleting === book._id || book.id}
                              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {deleting === (book._id || book.id) ? (
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
                            <Link
                              href={`/books/${book._id || book.id}`}
                              className="flex items-center gap-1 rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                              title="View/Edit book"
                            >
                              <Edit size={12} />
                              Edit
                            </Link>

                            <button
                              onClick={() => setConfirmDeleteId(book._id || book.id)}
                              className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete book"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>

                            {book.status === "available" && (
                              <button
                                onClick={() => handleUnpublish(book._id || book.id, book.title)}
                                disabled={unpublishing === book._id || book.id}
                                className="flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-colors disabled:opacity-50"
                                title="Unpublish book"
                              >
                                {unpublishing === (book._id || book.id) ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <EyeOff size={12} />
                                )}
                                Unpublish
                              </button>
                            )}

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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[var(--rr-hairline)] px-4 py-3 gap-3">
          <p className="text-sm text-[var(--rr-ink-dim)]">
            Showing <span className="font-medium text-[var(--rr-ink)]">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-[var(--rr-ink)]">{Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered)}</span> of{" "}
            <span className="font-medium text-[var(--rr-ink)]">{totalFiltered}</span> books
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                currentPage === 1
                  ? "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                  : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)]"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-[var(--rr-ink-dim)]">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? "border-[var(--rr-gold)] bg-[var(--rr-gold)] text-white"
                      : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)]"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                currentPage === totalPages
                  ? "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                  : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)]"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
