"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Truck, Eye } from "lucide-react";
import type { BookItem } from "@/lib/books-data";
import BookDetailModal from "./BookDetailModal";

interface BookCardProps {
  book: BookItem;
}

const STATUS_CONFIG = {
  available: { label: "Available", color: "bg-[var(--rr-sage)] text-white" },
  checked_out: { label: "Unavailable", color: "bg-[var(--rr-wine)] text-white" },
  pending: { label: "Coming Soon", color: "bg-[var(--rr-gold)] text-white" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Fiction: "bg-[var(--rr-slate)]/10 text-[var(--rr-slate)]",
  "Non-Fiction": "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]",
  "Sci-Fi & Fantasy": "bg-purple-500/10 text-purple-600",
  Biography: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
  "Children's": "bg-pink-500/10 text-pink-600",
  Academic: "bg-[var(--rr-slate)]/10 text-[var(--rr-slate)]",
  Poetry: "bg-indigo-500/10 text-indigo-600",
  History: "bg-amber-500/10 text-amber-600",
  "Self-Help": "bg-emerald-500/10 text-emerald-600",
};

export default function BookCard({ book }: BookCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [imageError, setImageError] = useState(false);
  const statusConfig = STATUS_CONFIG[book.status];

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="group cursor-pointer overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] transition-all hover:shadow-lg hover:shadow-[var(--rr-gold)]/5 hover:-translate-y-1"
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--rr-surface-2)]">
          {!imageError ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <div>
                <p className="font-display text-lg font-bold text-[var(--rr-ink)]">
                  {book.title}
                </p>
                <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">
                  {book.author}
                </p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <span
            className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>

          {/* Category Badge */}
          <span
            className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm ${
              CATEGORY_COLORS[book.category] || "bg-[var(--rr-surface)]/80 text-[var(--rr-ink-dim)]"
            }`}
          >
            {book.category}
          </span>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rr-surface)]/90 opacity-0 transition-all group-hover:opacity-100 group-hover:scale-100 scale-75 shadow-lg">
              <Eye size={18} className="text-[var(--rr-ink)]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="line-clamp-1 font-display text-sm font-semibold text-[var(--rr-ink)]">
            {book.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--rr-ink-dim)]">
            {book.author}
          </p>

          {/* Rating & Fee */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-[var(--rr-gold)] text-[var(--rr-gold)]" />
              <span className="text-xs font-medium text-[var(--rr-ink)]">
                {book.rating > 0 ? book.rating.toFixed(1) : "New"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[var(--rr-gold)]">
              <Truck size={12} />
              <span className="text-xs font-semibold">
                ${book.deliveryFee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <BookDetailModal book={book} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
