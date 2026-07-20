"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  LayoutGrid,
  BookCheck,
  Users,
  Receipt,
  Package,
  Truck,
  BarChart3,
  PlusCircle,
  BookMarked,
  History,
  Star,
  ChevronLeft,
  LogOut,
  Settings,
} from "lucide-react";
import { useAppTheme } from "@/app/providers";
import { authClient } from "@/lib/auth-client";

type Role = "admin" | "librarian" | "reader";

interface NavItem {
  label: string;
  hash: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: "Overview", hash: "overview", icon: LayoutGrid },
    { label: "Book Approvals", hash: "approvals", icon: BookCheck },
    { label: "Manage Users", hash: "users", icon: Users },
    { label: "All Books", hash: "books", icon: BookOpen },
    { label: "Transactions", hash: "transactions", icon: Receipt },
  ],
  librarian: [
    { label: "Overview", hash: "overview", icon: BarChart3 },
    { label: "Add Book", hash: "add-book", icon: PlusCircle },
    { label: "Inventory", hash: "inventory", icon: Package },
    { label: "Deliveries", hash: "deliveries", icon: Truck },
  ],
  reader: [
    { label: "Overview", hash: "overview", icon: LayoutGrid },
    { label: "Delivery History", hash: "deliveries", icon: History },
    { label: "Reading List", hash: "reading-list", icon: BookMarked },
    { label: "My Reviews", hash: "reviews", icon: Star },
  ],
};

const ROLE_BASE_PATH: Record<Role, string> = {
  admin: "/dashboard/admin",
  librarian: "/dashboard/librarian",
  reader: "/dashboard/reader",
};

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  librarian: "Librarian",
  reader: "Reader",
};

const ROLE_COLORS: Record<Role, string> = {
  admin: "bg-[var(--rr-wine)] text-white",
  librarian: "bg-[var(--rr-gold)] text-white",
  reader: "bg-[var(--rr-sage)] text-white",
};

interface DashboardSidebarProps {
  role: Role;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  onCollapse?: (collapsed: boolean) => void;
}

export default function DashboardSidebar({ role, user, onCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useAppTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [activeHash, setActiveHash] = useState("overview");

  const basePath = ROLE_BASE_PATH[role];

  useEffect(() => {
    function readHash() {
      const hash = window.location.hash.replace("#", "") || "overview";
      setActiveHash(hash);
    }

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  }

  function handleNavClick(hash: string) {
    window.location.hash = hash;
    setActiveHash(hash);
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      setCollapsed(true);
      onCollapse?.(true);
    }
  }

  const navItems = NAV_ITEMS[role] || [];

  function handleLogout() {
    authClient.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleCollapse}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r border-[var(--rr-hairline)] bg-[var(--rr-surface)] transition-all duration-300 ${
          collapsed ? "-translate-x-full md:translate-x-0 md:w-[72px]" : "w-64"
        }`}
      >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--rr-hairline)] px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--rr-ink)] text-[var(--rr-bg)]">
                <BookOpen size={18} />
              </div>
              <span className="font-bold text-sm tracking-wider text-[var(--rr-ink)]">
                BIBLIODROP
              </span>
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${ROLE_COLORS[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeHash === item.hash;

              return (
                <li key={item.hash}>
                  <button
                    onClick={() => handleNavClick(item.hash)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]"
                        : "text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)]"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--rr-hairline)] p-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
            title={collapsed ? "Toggle theme" : undefined}
          >
            {resolvedTheme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            {!collapsed && <span>Theme</span>}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
            title={collapsed ? "Settings" : undefined}
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>

          {/* User Info */}
          {!collapsed && user && (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[var(--rr-ink-dim)]">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--rr-ink)]">
                  {user.name || "User"}
                </p>
                <p className="truncate text-[10px] text-[var(--rr-gold)]">
                  {ROLE_LABELS[role]}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--rr-wine)] hover:bg-[var(--rr-wine)]/10 transition-colors"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
