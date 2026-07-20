"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Search, X } from "lucide-react";

const ROLE_OPTIONS = [
  { key: "admin", label: "Admin" },
  { key: "librarian", label: "Librarian" },
  { key: "reader", label: "Reader" },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-[var(--rr-wine)]/10 text-[var(--rr-wine)]",
  librarian: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
  reader: "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]",
};

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt?: string;
}

export function ManageUsersTable({ users, onRefresh }: { users: User[]; onRefresh: () => void }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleRoleChange(user: User, nextRole: string) {
    if (nextRole === user.role) return;
    setLoadingId(user.id);
    try {
      await fetch(`/api/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(userId: string) {
    setLoadingId(userId);
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      onRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoadingId(null);
    }
  }

  function formatDate(iso?: string) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">Manage Users</h2>
          <span className="rounded-full bg-[var(--rr-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--rr-ink-dim)]">
            {filteredUsers.length} / {users.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--rr-ink-dim)]">
                  {searchQuery ? "No users match your search" : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[var(--rr-hairline)] last:border-0 hover:bg-[var(--rr-bg)]/50">
                  {/* User with Image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[var(--rr-ink-dim)]">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--rr-ink)]">{user.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ROLE_COLORS[user.role] || "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]"}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3 text-sm text-[var(--rr-ink-dim)]">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={loadingId === user.id}
                        className="rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-2 py-1 text-xs text-[var(--rr-ink)] disabled:opacity-50"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setDeleteConfirmId(user.id)}
                        disabled={loadingId === user.id}
                        className="rounded-lg border border-[var(--rr-wine)]/30 p-1.5 text-[var(--rr-wine)] hover:bg-[var(--rr-wine)]/10 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--rr-ink)]">Delete User</h3>
            <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={loadingId === deleteConfirmId}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-wine)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-wine-bright)] transition-colors disabled:opacity-50"
              >
                {loadingId === deleteConfirmId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
