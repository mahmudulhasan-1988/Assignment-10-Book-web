"use client";

import Image from "next/image";
import { useState } from "react";
import {
  User,
  Mail,
  BookOpen,
  Camera,
  Save,
  Package,
  Truck,
  BarChart3,
  Clock,
  Star,
} from "lucide-react";

interface ProfileProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export default function LibrarianProfile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--rr-ink)]">
          Librarian Profile
        </h1>
        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
          Manage your account and library operations.
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
                  {user.name?.charAt(0)?.toUpperCase() || "L"}
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
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--rr-gold)]/10 px-3 py-1 text-xs font-medium text-[var(--rr-gold)]">
              <BookOpen size={12} />
              Librarian
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

      {/* Librarian Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-gold)]">
            <Package size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">156</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Books Listed</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-sage)]">
            <Truck size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">42</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Active Deliveries</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-slate)]">
            <BarChart3 size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">$3,240</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Monthly Earnings</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="flex items-center gap-2 text-[var(--rr-wine)]">
            <Star size={16} />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">4.8</div>
          <div className="text-xs text-[var(--rr-ink-dim)]">Avg. Rating</div>
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

        {/* Library Info */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <BookOpen size={18} />
            Library Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">
                Library Name
              </label>
              <input
                type="text"
                defaultValue="BiblioDrop Central"
                disabled={!isEditing}
                className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--rr-ink-dim)]">
                Location
              </label>
              <input
                type="text"
                defaultValue="Dhaka, Bangladesh"
                disabled={!isEditing}
                className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-4 py-2.5 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
              />
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
              { action: "Added", book: "The Quiet Cartographer", date: "1 hour ago" },
              { action: "Shipped", book: "Harbor Lights", date: "3 hours ago" },
              { action: "Updated", book: "Klara and the Sun", date: "1 day ago" },
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
