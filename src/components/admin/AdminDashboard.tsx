"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { BookApprovalQueue } from "./BookApprovalQueue";
import { ManageUsersTable } from "./ManageUsersTable";
import { ManageBooksTable } from "./ManageBooksTable";
import { TransactionsTable } from "./TransactionsTable";
import {
  Users,
  BookOpen,
  Truck,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";

type SectionKey = "overview" | "approvals" | "users" | "books" | "transactions";

export function AdminDashboard() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [loading, setLoading] = useState(true);

  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, usersRes, deliveriesRes] = await Promise.all([
        fetch("/api/books?page=1&limit=1000"),
        fetch("/api/users"),
        fetch("/api/deliveries"),
      ]);

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        // Handle both paginated and array responses
        setBooks(booksData.books || (Array.isArray(booksData) ? booksData : []));
      }
      if (usersRes.ok) setUsers(await usersRes.json());
      if (deliveriesRes.ok) setDeliveries(await deliveriesRes.json());
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "") as SectionKey;
      if (hash && ["overview", "approvals", "users", "books", "transactions"].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("overview");
      }
    }
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const pendingBooks = books.filter((b) => b.status === "pending");
  const availableBooks = books.filter((b) => b.status === "available");
  const totalRevenue = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
  const avgRating = books.length > 0 ? (books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.length).toFixed(1) : "0";

  // Category breakdown
  const categoryCount: Record<string, number> = {};
  books.forEach((b) => {
    categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Status breakdown
  const statusCount: Record<string, number> = {};
  deliveries.forEach((d) => {
    statusCount[d.status] = (statusCount[d.status] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--rr-surface-2)]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-[var(--rr-surface-2)]" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-[var(--rr-surface-2)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Overview */}
      {activeSection === "overview" && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[var(--rr-ink)]">Dashboard Overview</h2>
            <p className="text-sm text-[var(--rr-ink-dim)]">Welcome to BiblioDrop Admin</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={users.length} icon={Users} color="text-[var(--rr-gold)]" bg="bg-[var(--rr-gold)]/10" trend="+12%" />
            <StatCard label="Total Books" value={books.length} icon={BookOpen} color="text-[var(--rr-sage)]" bg="bg-[var(--rr-sage)]/10" trend="+8%" />
            <StatCard label="Total Deliveries" value={deliveries.length} icon={Truck} color="text-[var(--rr-slate)]" bg="bg-[var(--rr-slate)]/10" trend="+24%" />
            <StatCard label="Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={DollarSign} color="text-[var(--rr-wine)]" bg="bg-[var(--rr-wine)]/10" trend="+18%" />
          </div>

          {/* Second Row Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniStat label="Pending Approvals" value={pendingBooks.length} icon={Clock} color="text-[var(--rr-gold)]" />
            <MiniStat label="Available Books" value={availableBooks.length} icon={BookOpen} color="text-[var(--rr-sage)]" />
            <MiniStat label="Avg. Rating" value={avgRating} icon={Star} color="text-[var(--rr-gold)]" />
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Category Distribution */}
            <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
                <BarChart3 size={18} />
                Books by Category
              </h3>
              <div className="space-y-3">
                {topCategories.map(([category, count]) => {
                  const percentage = books.length > 0 ? (count / books.length) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-[var(--rr-ink)]">{category}</span>
                        <span className="text-[var(--rr-ink-dim)]">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                        <div
                          className="h-full rounded-full bg-[var(--rr-gold)] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Status */}
            <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
                <Truck size={18} />
                Delivery Status
              </h3>
              <div className="space-y-4">
                {["Pending", "Dispatched", "Delivered"].map((status) => {
                  const count = statusCount[status] || 0;
                  const percentage = deliveries.length > 0 ? (count / deliveries.length) * 100 : 0;
                  const colors: Record<string, string> = {
                    Pending: "bg-[var(--rr-gold)]",
                    Dispatched: "bg-[var(--rr-slate)]",
                    Delivered: "bg-[var(--rr-sage)]",
                  };
                  return (
                    <div key={status}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-[var(--rr-ink)]">{status}</span>
                        <span className="text-[var(--rr-ink-dim)]">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${colors[status]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--rr-ink)]">
              <TrendingUp size={18} />
              Recent Activity
            </h3>
            {deliveries.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--rr-ink-dim)]">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {deliveries.slice(0, 5).map((d) => (
                  <div key={d._id} className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rr-surface-2)]">
                        <Truck size={16} className="text-[var(--rr-ink-dim)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--rr-ink)]">{d.bookTitle}</p>
                        <p className="text-xs text-[var(--rr-ink-dim)]">
                          {d.userName || "Anonymous"} • ${d.deliveryFee?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book Approvals */}
      {activeSection === "approvals" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[var(--rr-ink)]">Book Approvals</h2>
          <BookApprovalQueue books={pendingBooks} onRefresh={fetchData} />
        </div>
      )}

      {/* Manage Users */}
      {activeSection === "users" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[var(--rr-ink)]">Manage Users</h2>
          <ManageUsersTable users={users} onRefresh={fetchData} />
        </div>
      )}

      {/* All Books */}
      {activeSection === "books" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[var(--rr-ink)]">All Books</h2>
          <ManageBooksTable books={books} onRefresh={fetchData} setBooks={setBooks} />
        </div>
      )}

      {/* Transactions */}
      {activeSection === "transactions" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[var(--rr-ink)]">Transactions</h2>
          <TransactionsTable transactions={deliveries} onRefresh={fetchData} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg, trend }: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
  trend?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--rr-ink-dim)]">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[var(--rr-ink)]">{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-[var(--rr-sage)]">
              <TrendingUp size={12} className="mr-1 inline" />
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${bg}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color }: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${color.replace("text-", "bg-")}/10`}>
          <Icon size={18} className={color} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--rr-ink)]">{value}</p>
          <p className="text-xs text-[var(--rr-ink-dim)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
    Dispatched: "bg-[var(--rr-slate)]/10 text-[var(--rr-slate)]",
    Delivered: "bg-[var(--rr-sage)]/10 text-[var(--rr-sage)]",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] || "bg-[var(--rr-surface-2)] text-[var(--rr-ink-dim)]"}`}>
      {status}
    </span>
  );
}
