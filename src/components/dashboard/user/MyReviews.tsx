"use client";

import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { Star, Edit3, Trash2, MessageSquare } from "lucide-react";
import { useReviews, type Review } from "@/lib/review-context";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyReviews() {
  const { reviews, loading, updateReview, deleteReview } = useReviews();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [draftRating, setDraftRating] = useState(5);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function startEdit(review: Review) {
    setEditingId(review._id);
    setDraft(review.comment);
    setDraftRating(review.rating);
  }

  async function saveEdit(reviewId: string) {
    await updateReview(reviewId, { rating: draftRating, comment: draft.trim() });
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
    setDraftRating(5);
  }

  async function handleDelete(id: string) {
    await deleteReview(id);
    setConfirmDeleteId(null);
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <Card.Content className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <div key={s} className="h-4 w-4 animate-pulse rounded bg-[var(--rr-surface-2)]" />
                  ))}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-[var(--rr-surface-2)]" />
                  <div className="h-5 w-48 animate-pulse rounded bg-[var(--rr-surface-2)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--rr-surface-2)]" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--rr-surface-2)]" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--rr-ink-dim)]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--rr-surface)]">
              <MessageSquare size={36} className="opacity-30" />
            </div>
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="mt-1 text-xs opacity-60">Once you review a delivered book, it will show up here</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rr-hairline)]">
            {reviews.map((review) => {
              const isEditing = editingId === review._id;
              const isConfirming = confirmDeleteId === review._id;

              return (
                <div
                  key={review._id}
                  className="group transition-colors hover:bg-[var(--rr-surface)]/50"
                >
                  <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      {/* Header */}
                      <div className="mb-2 flex items-center gap-3">
                        <Stars rating={review.rating} />
                        <span className="text-xs text-[var(--rr-ink-dim)]">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      {/* Book Title */}
                      <h4 className="font-display text-base font-semibold text-[var(--rr-ink)]">
                        {review.bookTitle}
                      </h4>

                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          {/* Rating Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--rr-ink-dim)]">Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setDraftRating(star)}
                                  className="transition-transform hover:scale-110"
                                >
                                  <Star
                                    size={20}
                                    className={star <= draftRating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300 dark:text-gray-600 hover:text-amber-200"}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Comment Textarea */}
                          <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={3}
                            className="w-full max-w-[520px] resize-none rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-3 text-sm text-[var(--rr-ink)] shadow-sm outline-none transition-colors focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20"
                            placeholder="Write your review..."
                          />
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="primary" 
                              onPress={() => saveEdit(review._id)}
                              className="bg-[var(--rr-gold)] hover:bg-[var(--rr-gold-bright)]"
                            >
                              Save Changes
                            </Button>
                            <Button size="sm" variant="ghost" onPress={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-[var(--rr-ink-dim)]">
                          {review.comment}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                      <div className="flex shrink-0 items-center gap-2">
                        {isConfirming ? (
                          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2">
                            <span className="text-xs text-red-600">Delete?</span>
                            <Button 
                              size="sm" 
                              variant="danger" 
                              onPress={() => handleDelete(review._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Confirm
                            </Button>
                            <Button size="sm" variant="ghost" onPress={() => setConfirmDeleteId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => startEdit(review)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] transition-colors hover:bg-[var(--rr-surface)] hover:text-[var(--rr-gold)]"
                              title="Edit review"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(review._id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                              title="Delete review"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
