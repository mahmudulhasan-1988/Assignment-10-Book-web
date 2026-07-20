"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  BookOpen,
  Package,
  Truck,
  BarChart3,
  Star,
  Clock,
  Camera,
  Save,
  Lock,
  Bell,
} from "lucide-react";

type Role = "admin" | "librarian" | "reader";

const ROLE_CONFIG: Record<Role, { label: string; color: string; icon: React.ElementType }> = {
  admin: { label: "Administrator", color: "bg-[var(--rr-wine)]/10 text-[var(--rr-wine)]", icon: Shield },
  librarian: { label: "Librarian", color: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]", icon: BookOpen },
  reader: { label: "Reader", color: "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]", icon: BookOpen },
};

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const role = ((user as any)?.role || "reader") as Role;
  const config = ROLE_CONFIG[role];
  const RoleIcon = config.icon;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">My Profile</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Profile Card */}
          <div className="mb-6 flex flex-col items-center gap-5 rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-6">
            <div className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[var(--rr-ink-dim)]">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--rr-gold)] text-white shadow-md hover:bg-[var(--rr-gold-bright)] transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">{user?.name}</h3>
              <p className="text-sm text-[var(--rr-ink-dim)]">{user?.email}</p>
              <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
                <RoleIcon size={12} />
                {config.label}
              </div>
            </div>
          </div>

          {/* Role-Specific Stats */}
          {role === "admin" && <AdminStats />}
          {role === "librarian" && <LibrarianStats />}
          {role === "reader" && <ReaderStats />}

          {/* Personal Info */}
          <div className="mb-6 rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--rr-ink)]">
              <User size={16} />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-[var(--rr-ink-dim)]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-[var(--rr-ink-dim)]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-3 py-2 text-sm text-[var(--rr-ink)] outline-none focus:border-[var(--rr-gold)] disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--rr-ink)]">
              <Lock size={16} />
              Security
            </h4>
            <div className="space-y-2">
              <button className="flex w-full items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-3 py-2.5 text-sm text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors">
                <span>Change Password</span>
                <span className="text-xs text-[var(--rr-ink-dim)]">30 days ago</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-3 py-2.5 text-sm text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors">
                <span>Two-Factor Auth</span>
                <span className="text-xs text-[var(--rr-sage)]">Enabled</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--rr-hairline)] px-6 py-4">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
              >
                <Save size={14} />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminStats() {
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">12,480</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Total Users</div>
      </div>
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">3,204</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Total Books</div>
      </div>
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">$214K</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Revenue</div>
      </div>
    </div>
  );
}

function LibrarianStats() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">156</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Books Listed</div>
      </div>
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">$3,240</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Monthly Earnings</div>
      </div>
    </div>
  );
}

function ReaderStats() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">27</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Books Read</div>
      </div>
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4 text-center">
        <div className="text-xl font-bold text-[var(--rr-ink)]">12</div>
        <div className="text-[11px] text-[var(--rr-ink-dim)]">Reviews</div>
      </div>
    </div>
  );
}
