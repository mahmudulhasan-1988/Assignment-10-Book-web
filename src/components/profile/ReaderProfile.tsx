"use client";

import Image from "next/image";
import { useState } from "react";
import {
  User,
  Mail,
  BookOpen,
  Calendar,
  Camera,
  Save,
  Clock,
  Star,
  Truck,
} from "lucide-react";

interface ProfileProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export default function ReaderProfile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--rr-ink)]">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
          Manage your account and track your reading journey.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mb-8 rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--rr-ink-dim)]">
                  {user.name?.charAt(0)?.toUpperCase() || "R"}
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rr-gold)] text-white shadow-lg hover:bg-[var(--rr-gold-bright)] transition-colors">
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-[var(--rr-ink)]">
              {user.name}
            </h2>
            <p className="text-sm text-[var(--rr-ink-dim)]">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--rr-sage)]/10 px-3 py-1 text-xs font-medium text-[var(--rr-sage)]">
              <BookOpen size={12} />
              Reader
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg border border-[var(--rr-hairline)] px-4 py-2 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Reader Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-gold)]">
            <BookOpen size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">27</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Books Read</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-slate)]">
            <Truck size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">3</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Pending Deliveries</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-sage)]">
            <Star size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">12</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Reviews Written</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-wine)]">
            <Clock size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">$84</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Total Spent</div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <User size={18} />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-4 flex justify-end">
              <button className="flex items-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors">
                <Save size={14} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Reading Preferences */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <BookOpen size={18} />
            Reading Preferences
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">
                Favorite Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {["Fiction", "Sci-Fi", "Biography", "History"].map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-[var(--rr-gold)]/10 px-3 py-1 text-xs font-medium text-[var(--rr-gold)]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <Clock size={18} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: "Borrowed", book: "The Midnight Library", date: "2 hours ago" },
              { action: "Reviewed", book: "Klara and the Sun", date: "1 day ago" },
              { action: "Returned", book: "Educated", date: "3 days ago" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-4 py-3"
              >
                <div>
                  <span className="text-sm font-medium text-[var(--rr-ink)]">
                    {item.action}
                  </span>{" "}
                  <span className="text-sm text-[var(--rr-ink-dim)]">{item.book}</span>
                </div>
                <span className="text-xs text-[var(--rr-ink-dim)]">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
