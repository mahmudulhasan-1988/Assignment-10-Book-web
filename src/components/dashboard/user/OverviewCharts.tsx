"use client";

import { useMemo, useState } from "react";
import { BarChart3, PieChart as PieChartIcon, X, Package, Clock, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDeliveries } from "@/lib/delivery-context";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  Delivered: "#7fa37c",
  Dispatched: "#7592ab",
  Pending: "#c9a45c",
};

const STATUS_BADGE: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OverviewCharts() {
  const { deliveries, loading } = useDeliveries();
  const [detail, setDetail] = useState<{ title: string; items: typeof deliveries } | null>(null);

  const monthlyReads = useMemo(() => {
    const counts: Record<string, { count: number; month: number; year: number }> = {};
    deliveries
      .filter((d) => d.status === "Delivered")
      .forEach((d) => {
        const date = new Date(d.requestDate);
        const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
        if (!counts[key]) {
          counts[key] = { count: 0, month: date.getMonth(), year: date.getFullYear() };
        }
        counts[key].count += 1;
      });
    return Object.entries(counts)
      .map(([month, data]) => ({ month, count: data.count, _month: data.month, _year: data.year }))
      .sort((a, b) => a._month - b._month);
  }, [deliveries]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Delivered: 0, Dispatched: 0, Pending: 0 };
    deliveries.forEach((d) => {
      if (counts[d.status] !== undefined) counts[d.status] += 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((entry) => entry.value > 0);
  }, [deliveries]);

  const totalDeliveries = deliveries.length;

  function handleBarClick(data: any) {
    if (!data || data._month === undefined || data.count === 0) return;
    const items = deliveries.filter((d) => {
      if (d.status !== "Delivered") return false;
      const date = new Date(d.requestDate);
      return date.getMonth() === data._month && date.getFullYear() === data._year;
    });
    setDetail({ title: `Books Read in ${data.month}`, items });
  }

  function handleSliceClick(data: { name: string; value: number } | null) {
    if (!data) return;
    const items = deliveries.filter((d) => d.status === data.name);
    setDetail({ title: `${data.name} Deliveries`, items });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Monthly Reads Bar Chart */}
        <div className="overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
          <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--rr-gold)]/10">
              <BarChart3 size={16} className="text-[var(--rr-gold)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--rr-ink)]">Books Read Per Month</p>
          </div>
          <div className="p-6">
            <div className="h-[240px]">
              {loading ? (
                <div className="flex h-full items-end gap-3 px-4">
                  {[35, 65, 50, 80, 45, 70].map((h, i) => (
                    <div key={i} className="flex-1 animate-pulse rounded-t bg-[var(--rr-surface-2)]" style={{ height: `${h}%` }} />
                  ))}
                </div>
              ) : monthlyReads.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-[var(--rr-ink-dim)]">
                  <BarChart3 size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">No delivery data yet</p>
                  <p className="mt-1 text-xs opacity-60">Request a book delivery to see stats</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReads} barCategoryGap="20%">
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8a8a8a", fontSize: 11, fontFamily: "inherit" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8a8a8a", fontSize: 11, fontFamily: "inherit" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(201,169,92,0.08)" }}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#c9a45c"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={32}
                      onClick={handleBarClick}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {monthlyReads.length > 0 && (
              <p className="mt-2 text-center text-[10px] text-[var(--rr-ink-dim)]">Click a bar to see details</p>
            )}
          </div>
        </div>

        {/* Delivery Status Pie Chart */}
        <div className="overflow-hidden rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
          <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] bg-[var(--rr-bg)] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--rr-gold)]/10">
              <PieChartIcon size={16} className="text-[var(--rr-gold)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--rr-ink)]">Delivery Status Split</p>
          </div>
          <div className="p-6">
            <div className="h-[240px]">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-40 w-40 animate-pulse rounded-full border-[16px] border-[var(--rr-surface-2)]" />
                </div>
              ) : statusData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-[var(--rr-ink-dim)]">
                  <PieChartIcon size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">No delivery data yet</p>
                  <p className="mt-1 text-xs opacity-60">Request a book delivery to see stats</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      stroke="#fff"
                      strokeWidth={3}
                      onClick={(_, index) => handleSliceClick(statusData[index])}
                      style={{ cursor: "pointer" }}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: 12,
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} (${totalDeliveries > 0 ? Math.round((value / totalDeliveries) * 100) : 0}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 rounded-full bg-[var(--rr-bg)] px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[entry.name] }} />
                  <span className="text-xs font-medium text-[var(--rr-ink)]">{entry.name}</span>
                  <span className="text-xs text-[var(--rr-ink-dim)]">({entry.value})</span>
                </div>
              ))}
            </div>
            {statusData.length > 0 && (
              <p className="mt-3 text-center text-[10px] text-[var(--rr-ink-dim)]">Click a slice to see details</p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative z-10 mx-4 w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
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
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              {detail.items.length === 0 ? (
                <p className="text-center text-sm text-[var(--rr-ink-dim)]">No items found</p>
              ) : (
                <ul className="space-y-3">
                  {detail.items.map((dl) => (
                    <li
                      key={dl._id}
                      className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} className="text-[var(--rr-gold)]" />
                        <div>
                          <Link
                            href={`/books/${dl.bookId}`}
                            className="font-display text-sm font-medium text-[var(--rr-ink)] hover:text-[var(--rr-gold)] transition-colors"
                          >
                            {dl.bookTitle}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-[var(--rr-ink-dim)]">
                            <Clock size={12} className="opacity-50" />
                            {formatDate(dl.requestDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[dl.status] || "bg-gray-100 text-gray-600"}`}>
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
