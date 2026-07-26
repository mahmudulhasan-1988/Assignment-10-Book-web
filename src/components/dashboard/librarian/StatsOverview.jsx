"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Loader2, X, BookOpen, Truck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDeliveries } from "@/lib/delivery-context";
import Link from "next/link";

const PIE_COLORS = ["#c9a45c", "#4d6a48", "#8a4a3f", "#6b8fa3", "#b3903f"];

const STATUS_BADGE = {
  available: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  checked_out: "bg-blue-100 text-blue-700",
};

const DELIVERY_BADGE = {
  Pending: "bg-amber-100 text-amber-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
};

export default function StatsOverview() {
  const { data: session } = useSession();
  const { deliveries } = useDeliveries();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null); // { title, type: 'books'|'deliveries', items }

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          // Handle both paginated and array responses
          const allBooks = data.books || (Array.isArray(data) ? data : []);
          const myBooks = allBooks.filter((book) => book.ownerId === session?.user?.id);
          setBooks(myBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      fetchBooks();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="mt-1 h-3 w-32 animate-pulse rounded bg-[var(--rr-surface-2)]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
              <div className="mb-4 h-4 w-40 animate-pulse rounded bg-[var(--rr-surface-2)]" />
              <div className="flex items-end gap-2 h-[200px]">
                {[45, 72, 58, 85, 63, 78].map((h, j) => (
                  <div key={j} className="flex-1 animate-pulse rounded bg-[var(--rr-surface-2)]" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Derive stats
  const totalBooks = books.length;
  const publishedBooks = books.filter((b) => b.status === "available").length;

  const myDeliveries = deliveries.filter((d) =>
    books.some((b) => b.id === d.bookId)
  );
  const deliveredCount = myDeliveries.filter((d) => d.status === "Delivered").length;
  const dispatchedCount = myDeliveries.filter((d) => d.status === "Dispatched").length;
  const pendingDeliveries = myDeliveries.filter((d) => d.status === "Pending").length;
  const totalEarnings = myDeliveries
    .filter((d) => d.status === "Delivered")
    .reduce((sum, d) => sum + (d.deliveryFee || 0), 0);

  // Books by category
  const categoryMap = {};
  books.forEach((b) => {
    categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Delivery status
  const deliveryStatusData = [
    { status: "Pending", count: pendingDeliveries },
    { status: "Dispatched", count: dispatchedCount },
    { status: "Delivered", count: deliveredCount },
  ];

  // Monthly deliveries
  const now = new Date();
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthDeliveries = myDeliveries.filter((dl) => {
      const dlDate = new Date(dl.date || dl.createdAt);
      return dlDate.getMonth() === month && dlDate.getFullYear() === year;
    });
    monthlyData.push({ month: monthLabel, deliveries: monthDeliveries.length, _month: month, _year: year });
  }

  const spineData = [
    {
      label: "Total Books",
      value: totalBooks.toString(),
      foot: `${publishedBooks} published`,
      gradient: "from-[#4d6a48] to-[#33472f]",
    },
    {
      label: "Total Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      foot: `${deliveredCount} completed deliveries`,
      gradient: "from-[#b3903f] to-[#7c5e26]",
    },
    {
      label: "Pending Requests",
      value: pendingDeliveries.toString(),
      foot: "awaiting dispatch",
      gradient: "from-[#8a4a3f] to-[#602f28]",
    },
  ];

  // Chart click handlers
  function handleMonthlyBarClick(data) {
    if (!data || data.deliveries === 0) return;
    const monthDeliveries = myDeliveries.filter((dl) => {
      const dlDate = new Date(dl.date || dl.createdAt);
      return dlDate.getMonth() === data._month && dlDate.getFullYear() === data._year;
    });
    setDetail({ title: `Deliveries in ${data.month}`, type: "deliveries", items: monthDeliveries });
  }

  function handleCategorySliceClick(data) {
    if (!data) return;
    const categoryBooks = books.filter((b) => b.category === data.name);
    setDetail({ title: `${data.name} Books`, type: "books", items: categoryBooks });
  }

  function handleDeliveryStatusClick(data) {
    if (!data || data.count === 0) return;
    const filtered = myDeliveries.filter((d) => d.status === data.status);
    setDetail({ title: `${data.status} Deliveries`, type: "deliveries", items: filtered });
  }

  return (
    <>
      {/* Stat Cards */}
      <div className="relative mb-10 flex flex-col items-stretch gap-3.5 border-b-[3px] border-[#3c2e1c] px-1.5 pb-[18px] sm:flex-row sm:items-end">
        {spineData.map((spine) => (
          <div
            key={spine.label}
            className={`relative flex h-[120px] flex-row items-center justify-between gap-3 rounded-[4px_4px_2px_2px] bg-gradient-to-br px-4 py-4 shadow-[inset_3px_0_0_rgba(0,0,0,0.18),0_10px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1.5 sm:h-[172px] sm:min-w-[150px] sm:flex-1 sm:flex-col sm:items-stretch sm:justify-between ${spine.gradient}`}
          >
            <span className="absolute right-3 top-3 h-[7px] w-[7px] rounded-full bg-[var(--rr-gold-bright)] shadow-[0_0_8px_var(--rr-gold-bright)]" />
            <div className="font-mono-label self-start text-[10.5px] uppercase text-white/80 sm:[writing-mode:vertical-rl] sm:rotate-180">
              {spine.label}
            </div>
            <div>
              <div className="font-display text-3xl leading-none text-[#fbf6e8] sm:text-[38px]">
                {spine.value}
              </div>
              <div className="text-[11px] text-white/70">{spine.foot}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2">
        {/* Monthly Deliveries Chart */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <p className="font-mono-label mb-4 text-[11px] uppercase text-[var(--rr-gold)]">
            Monthly Deliveries
          </p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(201,169,92,0.08)" }}
                  formatter={(value) => [value, "Deliveries"]}
                  contentStyle={{
                    background: "#26402f",
                    border: "1px solid rgba(201,169,92,0.16)",
                    borderRadius: 8,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    color: "#eee6d4",
                  }}
                />
                <Bar
                  dataKey="deliveries"
                  fill="#c9a45c"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                  onClick={handleMonthlyBarClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--rr-ink-dim)]">Click a bar to see details</p>
        </div>

        {/* Books by Category Pie Chart */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <p className="font-mono-label mb-4 text-[11px] uppercase text-[var(--rr-gold)]">
            Books by Category
          </p>
          {categoryData.length > 0 ? (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                    onClick={(_, index) => handleCategorySliceClick(categoryData[index])}
                    style={{ cursor: "pointer" }}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#26402f",
                      border: "1px solid rgba(201,169,92,0.16)",
                      borderRadius: 8,
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 12,
                      color: "#eee6d4",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11, fontFamily: "IBM Plex Mono, monospace" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-sm text-[var(--rr-ink-dim)]">
              No books yet
            </div>
          )}
          <p className="mt-2 text-center text-[10px] text-[var(--rr-ink-dim)]">Click a slice to see books</p>
        </div>

        {/* Delivery Status Chart */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <p className="font-mono-label mb-4 text-[11px] uppercase text-[var(--rr-gold)]">
            Delivery Status
          </p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryStatusData} layout="vertical">
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                />
                <YAxis
                  type="category"
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "rgba(201,169,92,0.08)" }}
                  formatter={(value) => [value, "Count"]}
                  contentStyle={{
                    background: "#26402f",
                    border: "1px solid rgba(201,169,92,0.16)",
                    borderRadius: 8,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    color: "#eee6d4",
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                  onClick={handleDeliveryStatusClick}
                  cursor="pointer"
                >
                  {deliveryStatusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#c9a45c", "#6b8fa3", "#4d6a48"][index]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--rr-ink-dim)]">Click a bar to see deliveries</p>
        </div>

        {/* Top Books */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <p className="font-mono-label mb-4 text-[11px] uppercase text-[var(--rr-gold)]">
            Your Books
          </p>
          {books.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {books.slice(0, 5).map((book, i) => (
                <li key={book._id || book.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-label flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[10px] text-[var(--rr-gold-bright)]">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-display text-[14px]">{book.title}</span>
                      <span className="ml-2 text-[11px] text-[var(--rr-ink-dim)]">
                        {book.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono-label shrink-0 text-[11px] text-[var(--rr-gold)]">
                    ${book.deliveryFee.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-[100px] items-center justify-center text-sm text-[var(--rr-ink-dim)]">
              No books added yet
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative z-10 mx-4 w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--rr-hairline)] px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-[var(--rr-ink)]">
                {detail.title}
              </h3>
              <button
                onClick={() => setDetail(null)}
                className="rounded-lg p-1.5 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              {detail.items.length === 0 ? (
                <p className="text-center text-sm text-[var(--rr-ink-dim)]">No items found</p>
              ) : detail.type === "books" ? (
                <ul className="space-y-3">
                  {detail.items.map((book) => (
                    <li
                      key={book._id || book.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-[var(--rr-gold)]" />
                        <div>
                          <Link
                            href={`/books/${book._id || book.id}`}
                            className="font-display text-sm font-medium text-[var(--rr-ink)] hover:text-[var(--rr-gold)] transition-colors"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-[var(--rr-ink-dim)]">{book.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[book.status] || "bg-gray-100 text-gray-600"}`}>
                          {book.status?.replace("_", " ")}
                        </span>
                        <span className="font-mono-label text-xs text-[var(--rr-gold)]">
                          ${book.deliveryFee.toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3">
                  {detail.items.map((dl) => (
                    <li
                      key={dl._id || dl.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Truck size={16} className="text-[var(--rr-gold)]" />
                        <div>
                          <p className="font-display text-sm font-medium text-[var(--rr-ink)]">
                            {dl.bookTitle}
                          </p>
                          <p className="text-xs text-[var(--rr-ink-dim)]">
                            {dl.userName || "Customer"} &middot;{" "}
                            {new Date(dl.date || dl.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${DELIVERY_BADGE[dl.status] || "bg-gray-100 text-gray-600"}`}>
                          {dl.status}
                        </span>
                        <span className="font-mono-label text-xs text-[var(--rr-gold)]">
                          ${(dl.deliveryFee || 0).toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
