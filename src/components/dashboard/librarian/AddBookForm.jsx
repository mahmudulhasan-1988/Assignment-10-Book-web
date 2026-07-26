"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/books-data";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { useSession } from "@/lib/auth-client";

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "All");

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    deliveryFee: "",
    category: "Fiction",
    isbn: "",
    publishedYear: new Date().getFullYear().toString(),
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [errorMsg, setErrorMsg] = useState("");

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image must be less than 5MB");
        setStatus("error");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setErrorMsg("");

    try {
      let coverImage = "";

      // Upload image to imgBB if selected
      if (imageFile) {
        setUploading(true);
        try {
          coverImage = await uploadImageToImgBB(imageFile);
        } catch (err) {
          setErrorMsg("Failed to upload image. Please try again.");
          setStatus("error");
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Create book via API
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description,
          deliveryFee: parseFloat(formData.deliveryFee) || 0,
          category: formData.category,
          coverImage,
          isbn: formData.isbn,
          publishedYear: parseInt(formData.publishedYear) || new Date().getFullYear(),
          status: "pending",
          ownerId: session?.user?.id || "",
          ownerName: session?.user?.name || "",
        }),
      });

      if (res.ok) {
        setStatus("success");
        // Reset form
        setFormData({
          title: "",
          author: "",
          description: "",
          deliveryFee: "",
          category: "Fiction",
          isbn: "",
          publishedYear: new Date().getFullYear().toString(),
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to add book");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--rr-ink)]">Add New Book</h2>
        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
          Add a new book to the library. It will be pending approval until an admin reviews it.
        </p>
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
          <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Book added successfully!
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              It will appear on the Browse page after admin approval.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-300">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
            Book Cover Image
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <div className="relative h-48 w-32 overflow-hidden rounded-xl border border-[var(--rr-hairline)]">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-[var(--rr-hairline)] bg-[var(--rr-surface)] hover:bg-[var(--rr-surface-2)] transition-colors">
              <Upload size={32} className="mb-2 text-[var(--rr-ink-dim)]" />
              <span className="text-sm text-[var(--rr-ink-dim)]">
                Click to upload image
              </span>
              <span className="text-xs text-[var(--rr-ink-dim)] opacity-60 mt-1">
                PNG, JPG up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter book title"
            className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
            Author *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            placeholder="Enter author name"
            className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Enter book description"
            className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all resize-none"
          />
        </div>

        {/* Delivery Fee & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Delivery Fee */}
          <div>
            <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
              Delivery Fee ($) *
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              required
              min="0"
              step="0.50"
              placeholder="0.00"
              className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ISBN & Published Year Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="978-0000000000"
              className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
            />
          </div>

          {/* Published Year */}
          <div>
            <label className="block text-sm font-medium text-[var(--rr-ink)] mb-2">
              Published Year
            </label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleInputChange}
              min="1000"
              max={new Date().getFullYear()}
              className="w-full rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] focus:ring-2 focus:ring-[var(--rr-gold)]/20 transition-all"
            />
          </div>
        </div>

        {/* Status Note */}
        <div className="rounded-xl bg-[var(--rr-surface)] border border-[var(--rr-hairline)] p-4">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="mt-0.5 text-[var(--rr-gold)]" />
            <div>
              <p className="text-sm font-medium text-[var(--rr-ink)]">
                Pending Approval
              </p>
              <p className="text-xs text-[var(--rr-ink-dim)] mt-1">
                This book will be set to &quot;Pending Approval&quot; status. It will not appear on the
                public Browse page until an admin approves it.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--rr-gold)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--rr-gold-bright)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {uploading ? "Uploading Image..." : "Adding Book..."}
              </>
            ) : (
              <>
                <BookOpen size={16} />
                Add Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
