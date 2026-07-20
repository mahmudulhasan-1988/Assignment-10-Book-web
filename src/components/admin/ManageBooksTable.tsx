"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Search, X, Eye, Pencil } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  available: "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]",
  checked_out: "bg-[var(--rr-wine)]/10 text-[var(--rr-wine)]",
  pending: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
  unpublished: "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "checked_out", label: "Checked Out" },
  { value: "pending", label: "Pending" },
];

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  deliveryFee: number;
  coverImage?: string;
  rating?: number;
  publishedYear?: number;
}

export function ManageBooksTable({ books, onRefresh, setBooks }: { books: Book[]; onRefresh: () => void; setBooks: (books: Book[]) => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleDelete(bookId: string) {
    setLoadingId(bookId);
    try {
      const res = await fetch(`/api/books?id=${bookId}`, { method: "DELETE" });
      if (!res.ok) {
        console.error("Failed to delete book");
        return;
      }
      setDeleteConfirmId(null);
      setBooks(books.filter((b) => b.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    if (!editBook) return;
    e.preventDefault();
    setLoadingId(editBook.id);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editBook.id,
          title: editBook.title,
          author: editBook.author,
          category: editBook.category,
          deliveryFee: editBook.deliveryFee,
          status: editBook.status,
          publishedYear: editBook.publishedYear,
        }),
      });
      if (!res.ok) {
        console.error("Failed to update book");
        return;
      }
      setBooks(books.map((b) => (b.id === editBook.id ? editBook : b)));
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">All Books</h2>
          <span className="rounded-full bg-[var(--rr-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--rr-ink-dim)]">
            {filteredBooks.length} / {books.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
          <input
            type="text"
            placeholder="Search by title, author, or category..."
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Book
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Rating
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
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                  {searchQuery || statusFilter !== "all" ? "No books match your filters" : "No books found"}
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
                  {/* Book with Image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 shrink-0 overflow-hidden rounded bg-[var(--rr-surface-2)]">
                        {book.coverImage ? (
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            width={48}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[8px] text-[var(--rr-ink-dim)]">
                            No Cover
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--rr-ink)] line-clamp-1">{book.title}</p>
                        <p className="text-xs text-[var(--rr-ink-dim)]">{book.publishedYear || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {book.author}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[var(--rr-surface-2)] px-2 py-0.5 text-xs text-[var(--rr-ink-dim)]">
                      {book.category}
                    </span>
                  </td>

                  {/* Fee */}
                  <td className="px-4 py-3 text-sm font-medium text-[var(--rr-gold)]">
                    ${book.deliveryFee.toFixed(2)}
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink)]">
                    {book.rating ? `${book.rating} / 5` : "N/A"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[book.status] || "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]"}`}>
                      {book.status?.replace("_", " ")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/books/${book.id}`, "_blank")}
                        className="rounded-lg border border-[var(--rr-hairline)] p-1.5 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
                        title="View Book"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditBook(book)}
                        disabled={loadingId === book.id}
                        className="rounded-lg border border-[var(--rr-gold)]/30 p-1.5 text-[var(--rr-gold)] hover:bg-[var(--rr-gold)]/10 disabled:opacity-50"
                        title="Edit Book"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(book.id)}
                        disabled={loadingId === book.id}
                        className="rounded-lg border border-[var(--rr-wine)]/30 p-1.5 text-[var(--rr-wine)] hover:bg-[var(--rr-wine)]/10 disabled:opacity-50"
                        title="Delete Book"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Delete Book</h3>
            <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={loadingId === deleteConfirmId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-wine)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-wine-bright)] transition-colors disabled:opacity-50"
              >
                {loadingId === deleteConfirmId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditBook(null)} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Edit Book</h3>
            <form onSubmit={handleEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Title</label>
                  <input
                    type="text"
                    value={editBook.title}
                    onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Author</label>
                  <input
                    type="text"
                    value={editBook.author}
                    onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Category</label>
                  <input
                    type="text"
                    value={editBook.category}
                    onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editBook.deliveryFee}
                    onChange={(e) => setEditBook({ ...editBook, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Published Year</label>
                  <input
                    type="number"
                    min="1000"
                    max="9999"
                    value={editBook.publishedYear || ""}
                    onChange={(e) => setEditBook({ ...editBook, publishedYear: parseInt(e.target.value) || undefined })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Status</label>
                  <select
                    value={editBook.status}
                    onChange={(e) => setEditBook({ ...editBook, status: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  >
                    <option value="available">Available</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBook(null)}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingId === editBook.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold)]/80 transition-colors disabled:opacity-50"
                >
                  {loadingId === editBook.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Pencil size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
