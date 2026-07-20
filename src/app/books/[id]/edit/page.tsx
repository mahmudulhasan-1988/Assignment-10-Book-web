"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [coverImage, setCoverImage] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState(2024);
  const [status, setStatus] = useState("available");

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || "");
          setAuthor(data.author || "");
          setCategory(data.category || "");
          setDescription(data.description || "");
          setDeliveryFee(data.deliveryFee || 0);
          setCoverImage(data.coverImage || "");
          setIsbn(data.isbn || "");
          setPublishedYear(data.publishedYear || 2024);
          setStatus(data.status || "available");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          title,
          author,
          category,
          description,
          deliveryFee,
          coverImage,
          isbn,
          publishedYear,
          status,
        }),
      });

      if (res.ok) {
        router.push(`/books/${params.id}`);
      } else {
        setError("Failed to update book");
      }
    } catch {
      setError("Failed to update book");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--rr-bg)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[var(--rr-gold)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-[var(--rr-bg)]">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-2xl text-center py-20">
            <h1 className="text-2xl font-bold text-[var(--rr-ink)]">Book Not Found</h1>
            <p className="mt-2 text-[var(--rr-ink-dim)]">{error}</p>
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

  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/books/${params.id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Book
          </Link>

          <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6 sm:p-8">
            <h1 className="font-display text-2xl font-bold text-[var(--rr-ink)]">Edit Book</h1>
            <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">Update the book details below.</p>

            {error && (
              <div className="mt-4 rounded-lg bg-[var(--rr-wine)]/10 px-4 py-3 text-sm text-[var(--rr-wine)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Published Year</label>
                  <input
                    type="number"
                    min="1000"
                    max="9999"
                    value={publishedYear}
                    onChange={(e) => setPublishedYear(parseInt(e.target.value) || 2024)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">ISBN</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  >
                    <option value="available">Available</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Cover Image URL</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href={`/books/${params.id}`}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-center text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
