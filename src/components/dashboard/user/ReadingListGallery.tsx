"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Trash2 } from "lucide-react";
import { useReadingList } from "@/lib/reading-list-context";
import Link from "next/link";

const BOOK_COLORS = [
  "from-emerald-600 to-emerald-800",
  "from-rose-600 to-rose-800",
  "from-amber-600 to-amber-800",
  "from-blue-600 to-blue-800",
  "from-purple-600 to-purple-800",
  "from-teal-600 to-teal-800",
];

export default function ReadingListGallery() {
  const { items, loading, removeFromReadingList } = useReadingList();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] overflow-hidden">
            <div className="h-48 animate-pulse bg-[var(--rr-surface-2)]" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--rr-surface-2)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--rr-ink-dim)]">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--rr-surface)]">
          <BookOpen size={36} className="opacity-30" />
        </div>
        <p className="text-sm font-medium">Your reading list is empty</p>
        <p className="mt-1 text-xs opacity-60">Browse books and click "Add to List" to save them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item, index) => (
        <ReadingListCard
          key={item._id}
          item={item}
          index={index}
          onRemove={removeFromReadingList}
        />
      ))}
    </div>
  );
}

function ReadingListCard({ item, index, onRemove }: {
  item: any;
  index: number;
  onRemove: (bookId: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasCover = item.bookCover && !imgError;
  const colorClass = BOOK_COLORS[index % BOOK_COLORS.length];

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        {/* Book Cover */}
        <div className="relative h-48 overflow-hidden">
          {hasCover ? (
            <Image
              src={item.bookCover}
              alt={item.bookTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`flex h-full w-full bg-gradient-to-br ${colorClass} p-4`}>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
              <div className="absolute left-0 top-0 h-full w-2 bg-black/20" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20">
                    <BookOpen size={12} className="text-white" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                    {item.bookAuthor || "Unknown"}
                  </span>
                </div>
                <p className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                  {item.bookTitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.bookId)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          title="Remove from reading list"
        >
          <Trash2 size={12} className="text-red-500" />
        </button>

        {/* Bottom Info */}
        <div className="px-4 py-3">
          <Link
            href={`/books/${item.bookId}`}
            className="line-clamp-1 text-sm font-semibold text-[var(--rr-ink)] hover:text-[var(--rr-gold)] transition-colors"
          >
            {item.bookTitle}
          </Link>
          <p className="mt-0.5 text-xs text-[var(--rr-ink-dim)]">{item.bookAuthor || "Unknown"}</p>
          <p className="mt-1 text-[10px] font-medium text-[var(--rr-ink-dim)]">{item.category || "Book"}</p>
        </div>
      </div>
    </div>
  );
}
