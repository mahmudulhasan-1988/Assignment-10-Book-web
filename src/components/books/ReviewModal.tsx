"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Star, Loader2, CheckCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useReviews } from "@/lib/review-context";

interface ReviewModalProps {
  bookId: string;
  bookTitle: string;
  onClose: () => void;
}

export default function ReviewModal({ bookId, bookTitle, onClose }: ReviewModalProps) {
  const { data: session } = useSession();
  const { addReview } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"form" | "loading" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  const user = session?.user;
  const displayRating = hoverRating || rating;

  async function handleSubmit() {
    if (!rating) {
      setErrorMsg("Please select a rating");
      setStep("error");
      return;
    }

    setStep("loading");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name || "Anonymous",
          userEmail: user?.email || "",
          userImage: user?.image || "",
          bookId,
          bookTitle,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        const review = await res.json();
        addReview(review);
        setStep("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit review");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">
            Write a Review
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "form" && (
            <>
              {/* Book Title */}
              <p className="mb-4 text-sm text-[var(--rr-ink-dim)]">
                Reviewing: <span className="font-medium text-[var(--rr-ink)]">{bookTitle}</span>
              </p>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[var(--rr-ink)]">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= displayRating
                            ? "fill-[var(--rr-gold)] text-[var(--rr-gold)]"
                            : "text-[var(--rr-ink-dim)]"
                        }
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-xs text-[var(--rr-ink-dim)]">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[var(--rr-ink)]">
                  Your Review <span className="text-[var(--rr-ink-dim)]">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 resize-none transition-all"
                />
              </div>

              {/* User Info */}
              {user && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[var(--rr-ink-dim)]">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--rr-ink)]">{user.name}</p>
                    <p className="text-xs text-[var(--rr-ink-dim)]">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!rating}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Star size={16} />
                  Submit Review
                </button>
              </div>
            </>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center py-12">
              <Loader2 size={40} className="animate-spin text-[var(--rr-gold)]" />
              <p className="mt-4 text-sm text-[var(--rr-ink-dim)]">
                Submitting your review...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-sage)]/10">
                <CheckCircle size={32} className="text-[var(--rr-sage)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">
                Review Submitted!
              </h3>
              <p className="mt-2 text-center text-sm text-[var(--rr-ink-dim)]">
                Thank you for reviewing{" "}
                <span className="font-medium text-[var(--rr-ink)]">{bookTitle}</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-[var(--rr-gold)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-wine)]/10">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">
                Submission Failed
              </h3>
              <p className="mt-2 text-center text-sm text-[var(--rr-ink-dim)]">
                {errorMsg}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
