"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Settings,
  Bell,
  Lock,
  Camera,
  Save,
} from "lucide-react";

interface ProfileProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

export default function AdminProfile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--rr-ink)]">
          Admin Profile
        </h1>
        <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
          Manage your account settings and preferences.
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
                  {user.name?.charAt(0)?.toUpperCase() || "A"}
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
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--rr-wine)]/10 px-3 py-1 text-xs font-medium text-[var(--rr-wine)]">
              <Shield size={12} />
              Administrator
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

      {/* Admin Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="text-sm text-[var(--rr-ink-dim)]">Total Users</div>
          <div className="mt-1 text-2xl font-bold text-[var(--rr-ink)]">12,480</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="text-sm text-[var(--rr-ink-dim)]">Total Books</div>
          <div className="mt-1 text-2xl font-bold text-[var(--rr-ink)]">3,204</div>
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="text-sm text-[var(--rr-ink-dim)]">Revenue</div>
          <div className="mt-1 text-2xl font-bold text-[var(--rr-ink)]">$214,380</div>
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

        {/* Security */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <Lock size={18} />
            Security
          </h3>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors">
              <span>Change Password</span>
              <span className="text-[var(--rr-ink-dim)]">Last changed 30 days ago</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors">
              <span>Two-Factor Authentication</span>
              <span className="text-[var(--rr-sage)]">Enabled</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
            <Bell size={18} />
            Notifications
          </h3>
          <div className="space-y-3">
            {["Email notifications", "Push notifications", "Weekly reports"].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm text-[var(--rr-ink)]">
                <span>{item}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-[var(--rr-hairline)] text-[var(--rr-gold)] accent-[var(--rr-gold)]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
