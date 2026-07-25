"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  bookId: string;
  bookTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewContextValue {
  reviews: Review[];
  loading: boolean;
  avgRating: number;
  totalReviews: number;
  fetchReviews: (bookId: string) => Promise<void>;
  fetchUserReviews: (userId: string) => Promise<void>;
  addReview: (review: Review) => void;
  updateReview: (reviewId: string, data: { rating?: number; comment?: string }) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextValue>({
  reviews: [],
  loading: false,
  avgRating: 0,
  totalReviews: 0,
  fetchReviews: async () => {},
  fetchUserReviews: async () => {},
  addReview: () => {},
  updateReview: async () => {},
  deleteReview: async () => {},
});

export function useReviews() {
  return useContext(ReviewContext);
}

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { data: session } = useSession();

  const fetchReviews = useCallback(async (bookId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?bookId=${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserReviews = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        // Filter out old anonymous entries
        const reviews = (data.reviews || []).filter(
          (r: Review) => r.userId && r.userId !== "anonymous"
        );
        setReviews(reviews);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(reviews.length);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch user reviews when session loads (handles page refresh)
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserReviews(session.user.id);
    }
  }, [session?.user?.id, fetchUserReviews]);

  const addReview = useCallback((review: Review) => {
    setReviews((prev) => {
      const exists = prev.find((r) => r.userId === review.userId);
      if (exists) {
        return prev.map((r) => (r.userId === review.userId ? review : r));
      }
      return [review, ...prev];
    });
    // Recalculate avg
    setReviews((current) => {
      const total = current.length;
      const sum = current.reduce((acc, r) => acc + r.rating, 0);
      setAvgRating(total > 0 ? sum / total : 0);
      setTotalReviews(total);
      return current;
    });
  }, []);

  const updateReview = useCallback(async (reviewId: string, data: { rating?: number; comment?: string }) => {
    // Find existing review to preserve user data
    const existing = reviews.find((r) => r._id === reviewId);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          userId: existing?.userId,
          userName: existing?.userName,
          userEmail: existing?.userEmail,
          userImage: existing?.userImage,
          bookId: existing?.bookId,
          bookTitle: existing?.bookTitle,
          ...data,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => {
          const next = prev.map((r) => (r._id === reviewId ? { ...r, ...updated } : r));
          const total = next.length;
          const sum = next.reduce((acc, r) => acc + r.rating, 0);
          setAvgRating(total > 0 ? sum / total : 0);
          setTotalReviews(total);
          return next;
        });
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => {
          const filtered = prev.filter((r) => r._id !== id);
          const total = filtered.length;
          const sum = filtered.reduce((acc, r) => acc + r.rating, 0);
          setAvgRating(total > 0 ? sum / total : 0);
          setTotalReviews(total);
          return filtered;
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }, []);

  return (
    <ReviewContext.Provider
      value={{ reviews, loading, avgRating, totalReviews, fetchReviews, fetchUserReviews, addReview, updateReview, deleteReview }}
    >
      {children}
    </ReviewContext.Provider>
  );
}
