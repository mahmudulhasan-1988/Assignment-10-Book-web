"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Loader2, Trash2, Search, X, Eye, Pencil, ChevronLeft, ChevronRight, Plus } from "lucide-react";

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
  _id?: string;
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ITEMS_PER_PAGE = 10;

export function ManageBooksTable({ books: initialBooks, onRefresh, setBooks }: { books: Book[]; onRefresh: () => void; setBooks: (books: Book[]) => void }) {
  const [books, setBooksState] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [viewBook, setViewBook] = useState<Book | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "Fiction",
    deliveryFee: 0,
    publishedYear: new Date().getFullYear(),
    coverImage: "",
    status: "pending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: initialBooks.length,
    totalPages: Math.ceil(initialBooks.length / ITEMS_PER_PAGE),
    hasNext: initialBooks.length > ITEMS_PER_PAGE,
    hasPrev: false,
  });

  // Client-side pagination
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination for filtered results
  const totalFiltered = filteredBooks.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Update books when initialBooks changes
  useEffect(() => {
    setBooksState(initialBooks);
    setPagination({
      page: 1,
      limit: ITEMS_PER_PAGE,
      total: initialBooks.length,
      totalPages: Math.ceil(initialBooks.length / ITEMS_PER_PAGE),
      hasNext: initialBooks.length > ITEMS_PER_PAGE,
      hasPrev: false,
    });
  }, [initialBooks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  function goToPage(page: number) {
    setCurrentPage(page);
  }

  // Generate page numbers
  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
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
      setBooksState(books.filter((b) => b.id !== bookId));
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
      const updatedBooks = books.map((b) => (b.id === editBook.id ? editBook : b));
      setBooks(updatedBooks);
      setBooksState(updatedBooks);
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      if (!res.ok) {
        console.error("Failed to create book");
        return;
      }
      const createdBook = await res.json();
      setBooks([...books, createdBook]);
      setBooksState([...books, createdBook]);
      setShowCreateModal(false);
      setNewBook({
        title: "",
        author: "",
        category: "Fiction",
        deliveryFee: 0,
        publishedYear: new Date().getFullYear(),
        coverImage: "",
        status: "pending",
      });
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">All Books</h2>
          <span className="rounded-full bg-[var(--rr-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--rr-ink-dim)]">
            {filteredBooks.length} books
          </span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold)]/80 transition-colors"
        >
          <Plus size={16} />
          Create New Book
        </button>
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
            {paginatedBooks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                  {searchQuery || statusFilter !== "all" ? "No books match your filters" : "No books found"}
                </td>
              </tr>
            ) : (
              paginatedBooks.map((book) => (
                <tr key={book._id || book.id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
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
                        onClick={() => setViewBook(book)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--rr-ink-dim)]">
            Showing <span className="font-medium text-[var(--rr-ink)]">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-[var(--rr-ink)]">{Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered)}</span> of{" "}
            <span className="font-medium text-[var(--rr-ink)]">{totalFiltered}</span> books
          </p>

          <div className="flex items-center gap-1">
            {/* Previous */}
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

            {/* Page Numbers */}
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

            {/* Next */}
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

      {/* View Book Modal */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewBook(null)} />
          <div className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Book Details</h3>
              <button
                onClick={() => setViewBook(null)}
                className="rounded-lg p-1 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Book Cover */}
              <div className="w-full sm:w-48 shrink-0">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[var(--rr-surface-2)]">
                  {viewBook.coverImage ? (
                    <Image
                      src={viewBook.coverImage}
                      alt={viewBook.title}
                      width={192}
                      height={256}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[var(--rr-ink-dim)]">
                      No Cover Image
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[var(--rr-ink)]">{viewBook.title}</h4>
                  <p className="text-sm text-[var(--rr-ink-dim)]">by {viewBook.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--rr-ink-dim)] uppercase">Category</p>
                    <p className="text-sm text-[var(--rr-ink)]">{viewBook.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--rr-ink-dim)] uppercase">Published</p>
                    <p className="text-sm text-[var(--rr-ink)]">{viewBook.publishedYear || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--rr-ink-dim)] uppercase">Delivery Fee</p>
                    <p className="text-sm font-medium text-[var(--rr-gold)]">${viewBook.deliveryFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--rr-ink-dim)] uppercase">Rating</p>
                    <p className="text-sm text-[var(--rr-ink)]">{viewBook.rating ? `${viewBook.rating} / 5` : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--rr-ink-dim)] uppercase">Status</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[viewBook.status] || "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]"}`}>
                      {viewBook.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setViewBook(null);
                      setEditBook(viewBook);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold)]/80 transition-colors"
                  >
                    <Pencil size={14} />
                    Edit Book
                  </button>
                  <button
                    onClick={() => setViewBook(null)}
                    className="rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Book Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Create New Book</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Title *</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Author *</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Category</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Children's">Children's</option>
                    <option value="Academic">Academic</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Self-Help">Self-Help</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBook.deliveryFee}
                    onChange={(e) => setNewBook({ ...newBook, deliveryFee: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Published Year</label>
                  <input
                    type="number"
                    min="1000"
                    max="9999"
                    value={newBook.publishedYear}
                    onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--rr-ink-dim)]">Cover Image URL</label>
                  <input
                    type="url"
                    value={newBook.coverImage}
                    onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold)]/80 transition-colors disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Create Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
