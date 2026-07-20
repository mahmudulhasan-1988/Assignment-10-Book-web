"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Truck,
  BookOpen,
  Calendar,
  Hash,
  ShoppingCart,
  MessageSquare,
  BookMarked,
  Check,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useReadingList } from "@/lib/reading-list-context";
import type { BookItem } from "@/lib/books-data";
import DeliveryRequestModal from "./DeliveryRequestModal";
import ReviewModal from "./ReviewModal";
import ReviewList from "./ReviewList";

interface BookDetailModalProps {
  book: BookItem;
  onClose: () => void;
}

const STATUS_CONFIG = {
  available: { label: "Available", color: "text-[var(--rr-sage)]" },
  checked_out: { label: "Checked Out", color: "text-[var(--rr-wine)]" },
  pending: { label: "Coming Soon", color: "text-[var(--rr-gold)]" },
};

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  const { data: session } = useSession();
  const { isInReadingList, addToReadingList, removeFromReadingList } = useReadingList();
  const [imageError, setImageError] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const statusConfig = STATUS_CONFIG[book.status];

  const isLoggedIn = !!session?.user;
  const inReadingList = isInReadingList(book.id);

  async function handleReadingListToggle() {
    if (!isLoggedIn) return;
    setAddingToList(true);
    if (inReadingList) {
      await removeFromReadingList(book.id);
    } else {
      await addToReadingList({
        userId: session!.user!.id,
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.coverImage,
        category: book.category,
      });
    }
    setAddingToList(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="flex-1 text-lg font-semibold text-[var(--rr-ink)]">
            Book Details
          </h2>
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Cover Image */}
            <div className="shrink-0 sm:w-48">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--rr-surface-2)]">
                {!imageError ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4 text-center">
                    <div>
                      <BookOpen size={32} className="mx-auto text-[var(--rr-ink-dim)]" />
                      <p className="mt-2 text-xs text-[var(--rr-ink-dim)]">
                        {book.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold text-[var(--rr-ink)]">
                {book.title}
              </h3>
              <p className="mt-1 text-[var(--rr-ink-dim)]">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(book.rating)
                          ? "fill-[var(--rr-gold)] text-[var(--rr-gold)]"
                          : "text-[var(--rr-ink-dim)]"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-[var(--rr-ink)]">
                  {book.rating}
                </span>
                <span className="text-sm text-[var(--rr-ink-dim)]">
                  ({book.totalReviews.toLocaleString()} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-[var(--rr-ink-dim)]">
                {book.description}
              </p>

              {/* Meta Info */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5">
                  <Truck size={14} className="text-[var(--rr-gold)]" />
                  <div>
                    <p className="text-[10px] text-[var(--rr-ink-dim)]">Delivery Fee</p>
                    <p className="text-sm font-semibold text-[var(--rr-ink)]">
                      ${book.deliveryFee.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5">
                  <Calendar size={14} className="text-[var(--rr-slate)]" />
                  <div>
                    <p className="text-[10px] text-[var(--rr-ink-dim)]">Published</p>
                    <p className="text-sm font-semibold text-[var(--rr-ink)]">
                      {book.publishedYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5">
                  <BookOpen size={14} className="text-[var(--rr-sage)]" />
                  <div>
                    <p className="text-[10px] text-[var(--rr-ink-dim)]">Category</p>
                    <p className="text-sm font-semibold text-[var(--rr-ink)]">
                      {book.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-3 py-2.5">
                  <Hash size={14} className="text-[var(--rr-wine)]" />
                  <div>
                    <p className="text-[10px] text-[var(--rr-ink-dim)]">ISBN</p>
                    <p className="text-sm font-semibold text-[var(--rr-ink)]">
                      {book.isbn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t border-[var(--rr-hairline)] pt-6">
            <ReviewList bookId={book.id} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--rr-hairline)] px-6 py-4">
          <div className="flex gap-3">
            {book.status === "available" && (
              <button
                disabled={!isLoggedIn}
                onClick={() => isLoggedIn && setShowRequestModal(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--rr-gold-bright)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                {isLoggedIn ? "Request Delivery" : "Login to Request"}
              </button>
            )}
            {book.status === "checked_out" && (
              <button
                disabled
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-surface-2)] px-4 py-3 text-sm font-medium text-[var(--rr-ink-dim)] cursor-not-allowed"
              >
                <Truck size={16} />
                Currently Unavailable
              </button>
            )}
            {book.status === "pending" && (
              <button
                disabled
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-surface-2)] px-4 py-3 text-sm font-medium text-[var(--rr-ink-dim)] cursor-not-allowed"
              >
                <BookOpen size={16} />
                Coming Soon
              </button>
            )}

            {/* Reading List Button */}
            <button
              disabled={!isLoggedIn || addingToList}
              onClick={handleReadingListToggle}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                inReadingList
                  ? "border-[var(--rr-sage)]/30 bg-[var(--rr-sage)]/10 text-[var(--rr-sage)] hover:bg-[var(--rr-sage)]/20"
                  : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-surface)]"
              }`}
            >
              {addingToList ? (
                <Loader2 size={16} className="animate-spin" />
              ) : inReadingList ? (
                <Check size={16} />
              ) : (
                <BookMarked size={16} />
              )}
              {!isLoggedIn
                ? "Login to Save"
                : inReadingList
                ? "In Reading List"
                : "Add to List"}
            </button>

            <button
              disabled={!isLoggedIn}
              onClick={() => isLoggedIn && setShowReviewModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm font-medium text-[var(--rr-ink)] transition-colors hover:bg-[var(--rr-surface)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageSquare size={16} />
              {isLoggedIn ? "Write Review" : "Login to Review"}
            </button>
          </div>
          {!isLoggedIn && (
            <p className="mt-3 text-center text-xs text-[var(--rr-ink-dim)]">
              <Link href="/login" className="text-[var(--rr-gold)] hover:underline">
                Log in
              </Link>{" "}
              to request delivery, save to reading list, or write a review
            </p>
          )}
        </div>
      </div>

      {/* Delivery Request Modal */}
      {showRequestModal && (
        <DeliveryRequestModal
          book={book}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          bookId={book.id}
          bookTitle={book.title}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
