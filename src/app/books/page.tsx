"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, SORT_OPTIONS, type BookItem } from "@/lib/books-data";
import BookCard from "@/components/books/BookCard";
import BookSkeleton from "@/components/books/BookSkeleton";

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    router.push("/books");
  }

  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      {/* Hero Header */}
      <div className="border-b border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-[var(--rr-ink)] sm:text-4xl">
              Browse Books
            </h1>
            <p className="mt-2 text-[var(--rr-ink-dim)]">
              Discover thousands of books from local libraries
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]"
            />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] py-3 pl-11 pr-4 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-4 py-2 text-sm text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] sm:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--rr-gold)] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 sm:px-6">
        <div className="flex gap-6">
          {/* Sidebar Filters (Desktop) */}
          <aside
            className={`w-64 shrink-0 ${
              showFilters ? "block" : "hidden"
            } sm:block`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4">
                <h3 className="mb-3 text-sm font-semibold text-[var(--rr-ink)]">
                  Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-[var(--rr-gold)]/10 font-medium text-[var(--rr-gold)]"
                          : "text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4">
                <h3 className="mb-3 text-sm font-semibold text-[var(--rr-ink)]">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] px-4 py-2 text-sm text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Book Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[var(--rr-ink-dim)]">
                {loading ? (
                  "Loading books..."
                ) : (
                  <>
                    Showing <span className="font-medium text-[var(--rr-ink)]">{books.length}</span>{" "}
                    {books.length === 1 ? "book" : "books"}
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BookSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && books.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-surface-2)]">
                  <Search size={24} className="text-[var(--rr-ink-dim)]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--rr-ink)]">
                  No books found
                </h3>
                <p className="mb-4 max-w-sm text-sm text-[var(--rr-ink-dim)]">
                  We couldn&apos;t find any books matching your search. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="rounded-lg bg-[var(--rr-gold)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Book Grid */}
            {!loading && books.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                  <BookCard key={book._id || book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
