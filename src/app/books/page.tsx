"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, SORT_OPTIONS, type BookItem } from "@/lib/books-data";
import BookCard from "@/components/books/BookCard";
import BookSkeleton from "@/components/books/BookSkeleton";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (sortBy) params.set("sort", sortBy);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();

        // Handle server-side paginated response
        if (data.books && data.pagination) {
          setBooks(data.books);
          setPagination(data.pagination);
        } else if (Array.isArray(data)) {
          // Fallback for non-paginated response
          setBooks(data);
          setPagination({
            page: currentPage,
            limit: 12,
            total: data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setCurrentPage(1);
    router.push("/books");
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Generate page numbers to display
  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    const total = pagination.totalPages;
    const current = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }

    return pages;
  }

  const startItem = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

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
                    Showing <span className="font-medium text-[var(--rr-ink)]">{startItem}-{endItem}</span>{" "}
                    of <span className="font-medium text-[var(--rr-ink)]">{pagination.total}</span>{" "}
                    {pagination.total === 1 ? "book" : "books"}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--rr-ink-dim)]">Page</span>
                <span className="font-medium text-[var(--rr-ink)]">{currentPage}</span>
                <span className="text-sm text-[var(--rr-ink-dim)]">of {pagination.totalPages}</span>
              </div>
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

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-10 mb-8">
                {/* Pagination Card */}
                <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 sm:p-6 shadow-sm">
                  {/* Results Info - Mobile */}
                  <div className="flex sm:hidden items-center justify-between mb-4 pb-4 border-b border-[var(--rr-hairline)]">
                    <p className="text-xs text-[var(--rr-ink-dim)]">
                      <span className="font-semibold text-[var(--rr-ink)]">{startItem}-{endItem}</span> of <span className="font-semibold text-[var(--rr-ink)]">{pagination.total}</span>
                    </p>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold">
                      {currentPage}/{pagination.totalPages}
                    </div>
                  </div>

                  {/* Results Info - Desktop */}
                  <div className="hidden sm:flex items-center justify-between mb-5 pb-5 border-b border-[var(--rr-hairline)]">
                    <p className="text-sm text-[var(--rr-ink-dim)]">
                      Showing <span className="font-semibold text-[var(--rr-ink)]">{startItem}</span> to <span className="font-semibold text-[var(--rr-ink)]">{endItem}</span> of <span className="font-semibold text-[var(--rr-ink)]">{pagination.total}</span> books
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold">
                      Page {currentPage} of {pagination.totalPages}
                    </div>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {/* First Page - Desktop only */}
                    <button
                      onClick={() => goToPage(1)}
                      disabled={!pagination.hasPrev}
                      className={`hidden sm:flex h-10 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-medium transition-all duration-200 ${
                        pagination.hasPrev
                          ? "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)]"
                          : "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                      }`}
                    >
                      First
                    </button>

                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className={`flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
                        pagination.hasPrev
                          ? "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)] active:scale-95"
                          : "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mx-1 sm:mx-2">
                      {getPageNumbers().map((pageNum, index) =>
                        pageNum === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="flex h-10 w-10 items-center justify-center text-[var(--rr-ink-dim)] text-sm"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? "border-[var(--rr-gold)] bg-[var(--rr-gold)] text-white shadow-lg shadow-[var(--rr-gold)]/25 active:scale-95"
                                : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-gold)]/10 hover:border-[var(--rr-gold)] hover:text-[var(--rr-gold)] active:scale-95"
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className={`flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-lg border transition-all duration-200 ${
                        pagination.hasNext
                          ? "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)] active:scale-95"
                          : "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                      }`}
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>

                    {/* Last Page - Desktop only */}
                    <button
                      onClick={() => goToPage(pagination.totalPages)}
                      disabled={!pagination.hasNext}
                      className={`hidden sm:flex h-10 items-center justify-center gap-1 rounded-lg border px-3 text-sm font-medium transition-all duration-200 ${
                        pagination.hasNext
                          ? "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)] hover:border-[var(--rr-ink)]"
                          : "border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] opacity-40 cursor-not-allowed"
                      }`}
                    >
                      Last
                    </button>
                  </div>

                  {/* Quick Jump - Desktop only */}
                  <div className="hidden sm:flex items-center justify-center gap-3 mt-5 pt-5 border-t border-[var(--rr-hairline)]">
                    <span className="text-sm text-[var(--rr-ink-dim)]">Go to page</span>
                    <input
                      type="number"
                      min={1}
                      max={pagination.totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= pagination.totalPages) {
                          goToPage(page);
                        }
                      }}
                      className="w-16 h-8 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-2 text-center text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
                    />
                    <span className="text-sm text-[var(--rr-ink-dim)]">of {pagination.totalPages}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
