"use client";

import { useState } from "react";
import { Button, Card } from "@heroui/react";
import { reviews as initialReviews, type Review } from "@/lib/dashboard-data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-1 text-xs tracking-[1px] text-[var(--rr-gold-bright)]">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function startEdit(review: Review) {
    setEditingId(review.id);
    setDraft(review.comment);
  }

  function saveEdit(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comment: draft.trim() || r.comment } : r))
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  function deleteReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <Card className="p-2">
      {reviews.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-[var(--rr-ink-dim)]">
          No reviews yet. Once you review a delivered book, it will show up here.
        </div>
      ) : (
        reviews.map((review, i) => {
          const isEditing = editingId === review.id;
          const isConfirming = confirmDeleteId === review.id;

          return (
            <div
              key={review.id}
              className={`flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-start sm:justify-between ${
                i !== reviews.length - 1 ? "border-b border-[var(--rr-hairline)]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <Stars rating={review.rating} />
                <div className="font-display text-[15px]">{review.bookTitle}</div>

                {isEditing ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      className="w-full max-w-[520px] resize-none rounded-md border border-[var(--rr-hairline)] bg-[var(--rr-surface-2)] p-2.5 text-[13px] text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onPress={() => saveEdit(review.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onPress={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 max-w-[520px] text-[13px] leading-relaxed text-[var(--rr-ink-dim)]">
                    {review.comment}
                  </p>
                )}
              </div>

              {!isEditing && (
                <div className="flex shrink-0 items-start gap-2 self-start">
                  {isConfirming ? (
                    <>
                      <span className="self-center text-[11px] text-[var(--rr-ink-dim)]">
                        Delete this review?
                      </span>
                      <Button size="sm" variant="danger" onPress={() => deleteReview(review.id)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" onPress={() => setConfirmDeleteId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onPress={() => startEdit(review)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => setConfirmDeleteId(review.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </Card>
  );
}
