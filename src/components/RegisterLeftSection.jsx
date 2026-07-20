"use client";

import { BookOpen, Users, Truck } from "lucide-react";

export default function RegisterLeftSection() {
  return (
    <div className="flex h-full flex-col justify-between">

      {/* Top Content */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[6px] text-[var(--rr-gold)]">
          Create Account
        </p>

        <h1 className="mt-6 text-5xl font-black leading-tight text-[var(--rr-ink)] lg:text-7xl">
          Register as a
          <br />
          reader or a
          <br />
          librarian.
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-8 text-[var(--rr-ink-dim)]">
          Join <span className="font-semibold">BiblioDrop</span> to discover
          thousands of books, request home delivery, manage your library, and
          enjoy a smarter reading experience.
        </p>
      </div>

      {/* Bottom Features */}
      <div className="mt-16 space-y-6">

        <div className="flex items-center gap-4 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--rr-ink)] text-[var(--rr-bg)]">
            <BookOpen size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-[var(--rr-ink)]">
              Thousands of Books
            </h3>

            <p className="text-sm text-[var(--rr-ink-dim)]">
              Browse books from multiple libraries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--rr-ink)] text-[var(--rr-bg)]">
            <Truck size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-[var(--rr-ink)]">
              Home Delivery
            </h3>

            <p className="text-sm text-[var(--rr-ink-dim)]">
              Receive books at your doorstep.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--rr-ink)] text-[var(--rr-bg)]">
            <Users size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-[var(--rr-ink)]">
              Reader & Librarian
            </h3>

            <p className="text-sm text-[var(--rr-ink-dim)]">
              Register as a reader or manage books as a librarian.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
