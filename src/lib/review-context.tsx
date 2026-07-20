"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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

  const fetchReviews = useCallback(async (bookId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?bookId=${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
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
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, ...data }),
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
