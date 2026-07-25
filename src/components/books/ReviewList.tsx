"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Star, MessageSquare, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useReviews, type Review } from "@/lib/review-context";

interface ReviewListProps {
  bookId: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating
              ? "fill-[var(--rr-gold)] text-[var(--rr-gold)]"
              : "text-[var(--rr-ink-dim)]"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { data: session } = useSession();
  const { deleteReview } = useReviews();
  const isOwner = session?.user?.id === review.userId;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
            {review.userImage ? (
              <Image
                src={review.userImage}
                alt={review.userName}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[var(--rr-ink-dim)]">
                {review.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--rr-ink)]">{review.userName}</p>
            <p className="text-[10px] text-[var(--rr-ink-dim)]">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--rr-ink-dim)]">
          {review.comment}
        </p>
      )}
      {isOwner && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => deleteReview(review._id)}
            className="flex items-center gap-1 text-xs text-[var(--rr-wine)] hover:text-[var(--rr-wine-bright)] transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReviewList({ bookId }: ReviewListProps) {
  const { reviews: rawReviews, loading, avgRating, totalReviews, fetchReviews } = useReviews();
  const reviews = rawReviews || [];

  useEffect(() => {
    fetchReviews(bookId);
  }, [bookId, fetchReviews]);

  return (
    <div>
      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--rr-ink)]">
          <MessageSquare size={16} />
          Reviews
        </h4>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-xs text-[var(--rr-ink-dim)]">
              {avgRating.toFixed(1)} ({totalReviews})
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-8 text-center text-sm text-[var(--rr-ink-dim)]">
          Loading reviews...
        </div>
      )}

      {/* Empty */}
      {!loading && reviews.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--rr-hairline)] py-8 text-center">
          <MessageSquare size={24} className="mx-auto mb-2 text-[var(--rr-ink-dim)]" />
          <p className="text-sm text-[var(--rr-ink-dim)]">
            No reviews yet. Be the first to review this book!
          </p>
        </div>
      )}

      {/* Reviews */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
