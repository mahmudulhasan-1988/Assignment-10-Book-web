"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookDetails from "@/components/books/BookDetails";
import BookSkeleton from "@/components/books/BookSkeleton";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          setError("Book not found");
        }
      } catch {
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--rr-bg)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <BookSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[var(--rr-bg)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl text-center py-20">
            <h1 className="text-2xl font-bold text-[var(--rr-ink)]">Book Not Found</h1>
            <p className="mt-2 text-[var(--rr-ink-dim)]">{error || "The book you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push("/books")}
              className="mt-6 rounded-lg bg-[var(--rr-gold)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <BookDetails book={book} />;
}
