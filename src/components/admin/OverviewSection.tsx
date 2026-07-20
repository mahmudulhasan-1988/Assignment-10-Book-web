"use client";

import { Card } from "@heroui/react";
import { Users, BookOpen, Truck, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "./StatCard";

interface OverviewSectionProps {
  stats: any;
  totalBooks: number;
  totalUsers: number;
  totalDeliveries: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function OverviewSection({ stats, totalBooks, totalUsers, totalDeliveries }: OverviewSectionProps) {
  const bookStatusData = [
    { name: "Available", value: totalBooks - (stats?.pendingBooks || 0) },
    { name: "Pending", value: stats?.pendingBooks || 0 },
  ];

  const deliveryStatusData = [
    { name: "Active", value: stats?.pendingDeliveries || 0 },
    { name: "Completed", value: totalDeliveries - (stats?.pendingDeliveries || 0) },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          color="text-[var(--rr-gold)]"
        />
        <StatCard
          label="Total Books"
          value={totalBooks.toLocaleString()}
          icon={BookOpen}
          color="text-[var(--rr-sage)]"
        />
        <StatCard
          label="Total Deliveries"
          value={totalDeliveries.toLocaleString()}
          icon={Truck}
          color="text-[var(--rr-slate)]"
        />
        <StatCard
          label="Pending Approvals"
          value={(stats?.pendingBooks || 0).toString()}
          icon={Wallet}
          color="text-[var(--rr-wine)]"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Books Status Chart */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <h3 className="mb-4 text-lg font-semibold text-[var(--rr-ink)]">
            Book Status Distribution
          </h3>
          <div className="space-y-3">
            {bookStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-[var(--rr-ink-dim)]">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                    <div
                      className="h-full rounded-full bg-[var(--rr-gold)]"
                      style={{ width: `${totalBooks > 0 ? (item.value / totalBooks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--rr-ink)]">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Status Chart */}
        <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
          <h3 className="mb-4 text-lg font-semibold text-[var(--rr-ink)]">
            Delivery Status Distribution
          </h3>
          <div className="space-y-3">
            {deliveryStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-[var(--rr-ink-dim)]">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--rr-surface-2)]">
                    <div
                      className="h-full rounded-full bg-[var(--rr-sage)]"
                      style={{ width: `${totalDeliveries > 0 ? (item.value / totalDeliveries) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--rr-ink)]">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-5">
        <h3 className="mb-4 text-lg font-semibold text-[var(--rr-ink)]">
          Quick Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[var(--rr-bg)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--rr-gold)]">{stats?.pendingBooks || 0}</p>
            <p className="text-xs text-[var(--rr-ink-dim)]">Pending Books</p>
          </div>
          <div className="rounded-lg bg-[var(--rr-bg)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--rr-sage)]">{stats?.totalReviews || 0}</p>
            <p className="text-xs text-[var(--rr-ink-dim)]">Total Reviews</p>
          </div>
          <div className="rounded-lg bg-[var(--rr-bg)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--rr-slate)]">{stats?.pendingDeliveries || 0}</p>
            <p className="text-xs text-[var(--rr-ink-dim)]">Pending Deliveries</p>
          </div>
          <div className="rounded-lg bg-[var(--rr-bg)] p-4 text-center">
            <p className="text-2xl font-bold text-[var(--rr-wine)]">{totalUsers}</p>
            <p className="text-xs text-[var(--rr-ink-dim)]">Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
