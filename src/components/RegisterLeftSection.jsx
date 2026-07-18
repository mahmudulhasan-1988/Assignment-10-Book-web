"use client";

import { BookOpen, Users, Truck } from "lucide-react";

export default function RegisterLeftSection() {
  return (
    <div className="flex h-full flex-col justify-between">

      {/* Top Content */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[6px] text-orange-500">
          Create Account
        </p>

        <h1 className="mt-6 text-5xl font-black leading-tight text-zinc-900 dark:text-white lg:text-7xl">
          Register as a
          <br />
          reader or a
          <br />
          librarian.
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Join <span className="font-semibold">BiblioDrop</span> to discover
          thousands of books, request home delivery, manage your library, and
          enjoy a smarter reading experience.
        </p>
      </div>

      {/* Bottom Features */}
      <div className="mt-16 space-y-6">

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            <BookOpen size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Thousands of Books
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Browse books from multiple libraries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            <Truck size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Home Delivery
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Receive books at your doorstep.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
            <Users size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Reader & Librarian
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Register as a reader or manage books as a librarian.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}