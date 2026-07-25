"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  CheckCheck,
  Trash2,
  Truck,
  BookOpen,
  Star,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";
import { useNotifications } from "@/lib/notification-context";

type Role = "admin" | "librarian" | "reader";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  librarian: "Librarian",
  reader: "Reader",
};

const NOTIF_ICONS: Record<string, typeof Bell> = {
  delivery_request: Truck,
  delivery_update: Truck,
  book_approved: BookOpen,
  book_rejected: BookOpen,
  review: Star,
};

interface DashboardNavbarProps {
  role: Role;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  sidebarCollapsed?: boolean;
  onProfileClick?: () => void;
}

export default function DashboardNavbar({
  role,
  user,
  sidebarCollapsed = false,
  onProfileClick,
}: DashboardNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, clearAll, clearNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    authClient.signOut();
    router.push("/");
  }

  function formatTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const pageTitle = pathname.includes("/dashboard/admin")
    ? "Admin Console"
    : pathname.includes("/dashboard/librarian")
    ? "Librarian Dashboard"
    : "My Dashboard";

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)]/80 backdrop-blur-md transition-all duration-300 ${
        sidebarCollapsed ? "pl-0 md:pl-[72px]" : "pl-0 md:pl-64"
      }`}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* Left: Hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Toggle sidebar on mobile
              const sidebar = document.querySelector("aside");
              if (sidebar) {
                sidebar.classList.toggle("-translate-x-full");
                sidebar.classList.toggle("md:translate-x-0");
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-[var(--rr-ink)]">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rr-ink-dim)]"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] pl-9 pr-4 text-sm text-[var(--rr-ink)] placeholder-[var(--rr-ink-dim)] outline-none focus:border-[var(--rr-gold)] focus:ring-1 focus:ring-[var(--rr-gold)]/30 transition-colors"
            />
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (session?.user?.id) {
                    fetchNotifications(session.user.id, role);
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] hover:text-[var(--rr-ink)] transition-colors"
                title="Refresh notifications"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setDropdownOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--rr-hairline)] text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] hover:text-[var(--rr-ink)] transition-colors"
              >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--rr-wine)] px-1 text-[9px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            </div>

            {/* Notification Panel */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--rr-hairline)] px-4 py-3">
                  <h3 className="text-sm font-semibold text-[var(--rr-ink)]">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-[var(--rr-wine)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--rr-wine)]">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-[10px] text-[var(--rr-gold)] hover:text-[var(--rr-gold-bright)] transition-colors"
                    >
                      <CheckCheck size={12} />
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-[10px] text-[var(--rr-wine)] hover:text-[var(--rr-wine-bright)] transition-colors"
                    >
                      <Trash2 size={12} />
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-[var(--rr-ink-dim)]">
                      <Bell size={24} className="mb-2 opacity-30" />
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif) => {
                      const Icon = NOTIF_ICONS[notif.type] || Bell;
                      return (
                        <div
                          key={notif._id}
                          className={`group relative flex items-start gap-3 border-b border-[var(--rr-hairline)] px-4 py-3 transition-colors hover:bg-[var(--rr-bg)] ${
                            !notif.read ? "bg-[var(--rr-gold)]/5" : ""
                          }`}
                        >
                          <button
                            onClick={() => {
                              clearNotification(notif._id);
                            }}
                            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-[var(--rr-ink-dim)] opacity-0 transition-opacity hover:bg-red-100 hover:text-red-500 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 size={10} />
                          </button>
                          <button
                            onClick={() => {
                              markAsRead(notif._id);
                              setNotifOpen(false);
                              if (notif.link) router.push(notif.link);
                            }}
                            className="flex min-w-0 flex-1 items-start gap-3 text-left"
                          >
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              !notif.read ? "bg-[var(--rr-gold)]/10" : "bg-[var(--rr-surface-2)]"
                            }`}>
                              <Icon size={14} className={!notif.read ? "text-[var(--rr-gold)]" : "text-[var(--rr-ink-dim)]"} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs ${!notif.read ? "font-semibold text-[var(--rr-ink)]" : "text-[var(--rr-ink-dim)]"}`}>
                                {notif.title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-[var(--rr-ink-dim)] line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="mt-1 text-[10px] text-[var(--rr-ink-dim)] opacity-60">
                                {formatTime(notif.createdAt)}
                              </p>
                            </div>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-[var(--rr-hairline)] px-4 py-2.5 text-center">
                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        router.push(role === "admin" ? "/dashboard/admin#transactions" : role === "librarian" ? "/dashboard/librarian#deliveries" : "/dashboard/reader#deliveries");
                      }}
                      className="text-xs font-medium text-[var(--rr-gold)] hover:text-[var(--rr-gold-bright)] transition-colors"
                    >
                      View all activity
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg border border-[var(--rr-hairline)] px-3 py-1.5 hover:bg-[var(--rr-surface)] transition-colors"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[var(--rr-ink-dim)]">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium text-[var(--rr-ink)] leading-tight">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] text-[var(--rr-ink-dim)] leading-tight">
                  {ROLE_LABELS[role]}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-[var(--rr-ink-dim)] transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] shadow-xl">
                {/* User Info */}
                <div className="border-b border-[var(--rr-hairline)] p-4">
                  <p className="text-sm font-medium text-[var(--rr-ink)]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-[var(--rr-ink-dim)]">
                    {user?.email || ""}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-[var(--rr-gold)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--rr-gold)]">
                    {ROLE_LABELS[role]}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onProfileClick?.();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--rr-wine)] hover:bg-[var(--rr-wine)]/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
