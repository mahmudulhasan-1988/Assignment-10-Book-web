"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Truck,
  BookOpen,
  Calendar,
  Hash,
  ShoppingCart,
  MessageSquare,
  Edit,
  Trash2,
  EyeOff,
  Loader2,
  CheckCircle,
  CreditCard,
  BookMarked,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDeliveries } from "@/lib/delivery-context";
import { useReadingList } from "@/lib/reading-list-context";
import ReviewList from "./ReviewList";
import ReviewModal from "./ReviewModal";
import RequestDeliveryModal from "./RequestDeliveryModal";

interface Book {
  _id?: string;
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  deliveryFee: number;
  coverImage: string;
  status: "available" | "checked_out" | "pending";
  rating: number;
  totalReviews: number;
  isbn: string;
  publishedYear: number;
  ownerId?: string;
  ownerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_CONFIG = {
  available: { label: "Available", color: "text-[var(--rr-sage)]", bg: "bg-[var(--rr-sage)]/10" },
  checked_out: { label: "Checked Out", color: "text-[var(--rr-wine)]", bg: "bg-[var(--rr-wine)]/10" },
  pending: { label: "Pending", color: "text-[var(--rr-gold)]", bg: "bg-[var(--rr-gold)]/10" },
};

export default function BookDetails({ book: initialBook }: { book: Book }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasExistingDelivery } = useDeliveries();
  const { isInReadingList, addToReadingList, removeFromReadingList } = useReadingList();
  const [book, setBook] = useState(initialBook);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [addingToList, setAddingToList] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Re-fetch book data to get updated rating
  async function refreshBook() {
    try {
      const res = await fetch(`/api/books/${book.id}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data);
      }
    } catch {}
  }

  const user = session?.user;
  const isLoggedIn = !!user;
  const statusConfig = STATUS_CONFIG[book.status] || STATUS_CONFIG.available;
  const inReadingList = isInReadingList(book.id);

  // Check if current user is the librarian who owns this book or an admin
  const isOwner = isLoggedIn && user?.id && book.ownerId && user.id === book.ownerId;
  const isAdmin = isLoggedIn && (user as any)?.role === "admin";
  const isLibrarianOwner = isOwner || isAdmin;
  const existingDelivery = hasExistingDelivery(book._id || book.id);

  function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleRequestDelivery() {
    if (!isLoggedIn || book.status !== "available" || existingDelivery) return;
    setShowRequestModal(true);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/books?id=${book.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/books");
      }
    } catch {
      setDeleting(false);
    }
  }

  async function handleUnpublish() {
    setUnpublishing(true);
    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: book.id, status: "pending" }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      setUnpublishing(false);
    }
  }

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
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            href="/books"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Books
          </Link>

          {/* Main Content */}
          <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row">
              {/* Cover Image */}
              <div className="shrink-0 sm:w-72">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--rr-surface-2)]">
                  {!imageError ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="288px"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center">
                      <div>
                        <BookOpen size={48} className="mx-auto text-[var(--rr-ink-dim)]" />
                        <p className="mt-3 font-display text-lg font-bold text-[var(--rr-ink)]">
                          {book.title}
                        </p>
                        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1">
                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Title & Author */}
                <h1 className="font-display text-3xl font-bold text-[var(--rr-ink)] sm:text-4xl">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg text-[var(--rr-ink-dim)]">
                  by {book.author}
                </p>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <= Math.floor(book.rating)
                            ? "fill-[var(--rr-gold)] text-[var(--rr-gold)]"
                            : "text-[var(--rr-ink-dim)]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-[var(--rr-ink)]">
                    {book.rating}
                  </span>
                  <span className="text-sm text-[var(--rr-ink-dim)]">
                    ({book.totalReviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="mt-6 text-[var(--rr-ink-dim)] leading-relaxed">
                  {book.description}
                </p>

                {/* Meta Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-4">
                    <Truck size={18} className="mb-2 text-[var(--rr-gold)]" />
                    <p className="text-xs text-[var(--rr-ink-dim)]">Delivery Fee</p>
                    <p className="text-lg font-bold text-[var(--rr-ink)]">
                      ${book.deliveryFee.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-4">
                    <Calendar size={18} className="mb-2 text-[var(--rr-slate)]" />
                    <p className="text-xs text-[var(--rr-ink-dim)]">Published</p>
                    <p className="text-lg font-bold text-[var(--rr-ink)]">
                      {book.publishedYear}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-4">
                    <BookOpen size={18} className="mb-2 text-[var(--rr-sage)]" />
                    <p className="text-xs text-[var(--rr-ink-dim)]">Category</p>
                    <p className="text-lg font-bold text-[var(--rr-ink)]">
                      {book.category}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-4">
                    <Hash size={18} className="mb-2 text-[var(--rr-wine)]" />
                    <p className="text-xs text-[var(--rr-ink-dim)]">ISBN</p>
                    <p className="text-sm font-bold text-[var(--rr-ink)]">
                      {book.isbn}
                    </p>
                  </div>
                </div>

                {/* Date Added */}
                {book.createdAt && (
                  <p className="mt-4 text-xs text-[var(--rr-ink-dim)]">
                    Added on {formatDate(book.createdAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 border-t border-[var(--rr-hairline)] pt-6">
              {/* Payment Success/Error Messages */}
              {paymentStep === "success" && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-[var(--rr-sage)]/10 px-4 py-3 text-sm text-[var(--rr-sage)]">
                  <CheckCircle size={16} />
                  Payment successful! Your delivery is now pending.
                </div>
              )}
              {paymentStep === "error" && (
                <div className="mb-4 rounded-lg bg-[var(--rr-wine)]/10 px-4 py-3 text-sm text-[var(--rr-wine)]">
                  Payment failed. Please try again.
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {/* Existing Delivery Warning */}
                {existingDelivery && book.status === "available" && (
                  <div className="mb-2 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="font-medium text-amber-800 dark:text-amber-300">
                        You already have this book
                      </p>
                    </div>
                    <p className="mt-1 ml-6 text-xs text-amber-600 dark:text-amber-400">
                      This book is already in your delivery list with status{" "}
                      <span className="font-medium">{existingDelivery.status}</span>.
                    </p>
                  </div>
                )}

                {/* Request Delivery Button */}
                {book.status === "available" && !existingDelivery && (
                  <button
                    disabled={!isLoggedIn || paymentStep === "processing"}
                    onClick={handleRequestDelivery}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--rr-gold-bright)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    {paymentStep === "processing" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Pay ${book.deliveryFee.toFixed(2)} — Request Delivery
                      </>
                    )}
                  </button>
                )}

                {book.status === "checked_out" && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-surface-2)] px-6 py-3 text-sm font-medium text-[var(--rr-ink-dim)] cursor-not-allowed sm:flex-none"
                  >
                    <Truck size={16} />
                    Currently Unavailable
                  </button>
                )}

                {book.status === "pending" && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-surface-2)] px-6 py-3 text-sm font-medium text-[var(--rr-ink-dim)] cursor-not-allowed sm:flex-none"
                  >
                    <BookOpen size={16} />
                    Coming Soon
                  </button>
                )}

                {/* Review Button */}
                <button
                  disabled={!isLoggedIn}
                  onClick={() => isLoggedIn && setShowReviewModal(true)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-6 py-3 text-sm font-medium text-[var(--rr-ink)] transition-colors hover:bg-[var(--rr-surface-2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageSquare size={16} />
                  {isLoggedIn ? "Write Review" : "Login to Review"}
                </button>

                {/* Reading List Button */}
                <button
                  disabled={!isLoggedIn || addingToList}
                  onClick={handleReadingListToggle}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    inReadingList
                      ? "border-[var(--rr-sage)]/30 bg-[var(--rr-sage)]/10 text-[var(--rr-sage)] hover:bg-[var(--rr-sage)]/20"
                      : "border-[var(--rr-hairline)] text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)]"
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

                {/* Librarian Controls */}
                {isLibrarianOwner && (
                  <div className="w-full">
                    <div className="mb-3 flex items-center gap-2 text-xs text-[var(--rr-ink-dim)]">
                      <Edit size={12} />
                      <span>Librarian Controls</span>
                      {book.ownerName && <span>— Added by {book.ownerName}</span>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/books/${book.id}/edit`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-6 py-3 text-sm font-medium text-[var(--rr-ink)] transition-colors hover:bg-[var(--rr-surface-2)]"
                      >
                        <Edit size={16} />
                        Edit Book
                      </Link>
                      <button
                        disabled={unpublishing}
                        onClick={handleUnpublish}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[var(--rr-hairline)] px-6 py-3 text-sm font-medium text-[var(--rr-gold)] transition-colors hover:bg-[var(--rr-gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {unpublishing ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <EyeOff size={16} />
                        )}
                        Unpublish
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[var(--rr-wine)]/30 px-6 py-3 text-sm font-medium text-[var(--rr-wine)] transition-colors hover:bg-[var(--rr-wine)]/10"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isLoggedIn && (
                <p className="mt-4 text-center text-xs text-[var(--rr-ink-dim)]">
                  <Link href="/login" className="text-[var(--rr-gold)] hover:underline">
                    Log in
                  </Link>{" "}
                  to request delivery, save to reading list, or write a review
                </p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 sm:p-8">
            <ReviewList bookId={book.id} />
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          bookId={book.id}
          bookTitle={book.title}
          onClose={() => {
            setShowReviewModal(false);
            refreshBook();
          }}
        />
      )}

      {/* Request Delivery Modal */}
      {showRequestModal && (
        <RequestDeliveryModal
          book={book}
          onClose={() => setShowRequestModal(false)}
          onConfirm={() => {
            setShowRequestModal(false);
            setPaymentStep("success");
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Delete Book</h3>
            <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
              Are you sure you want to delete &quot;{book.title}&quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-wine)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-wine-bright)] transition-colors disabled:opacity-50"
              >
                {deleting ? (
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
    </div>
  );
}
