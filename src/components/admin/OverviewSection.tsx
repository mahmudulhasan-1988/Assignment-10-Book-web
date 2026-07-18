"use client";

import { Card } from "@heroui/react";
import { Users, BookOpen, Truck, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "./StatCard";
import type { AdminOverview } from "@/types/admin";

// Ledger-inspired palette derived from the dashboard's ink/gold token system.
const CATEGORY_COLORS = [
  "#8A5A2B", // gold-700
  "#B4802F", // gold-600
  "#D9A441", // gold-500
  "#E4C077", // gold-400
  "#2F4157", // ink-700
  "#4A617A", // ink-500
  "#7C93A8", // ink-300
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function OverviewSection({ overview }: { overview: AdminOverview }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={overview.totalUsers.toLocaleString()}
          growthPct={overview.userGrowthPct}
          icon={Users}
        />
        <StatCard
          label="Total books"
          value={overview.totalBooks.toLocaleString()}
          growthPct={overview.bookGrowthPct}
          icon={BookOpen}
        />
        <StatCard
          label="Total deliveries"
          value={overview.totalDeliveries.toLocaleString()}
          growthPct={overview.deliveryGrowthPct}
          icon={Truck}
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(overview.totalRevenue)}
          growthPct={overview.revenueGrowthPct}
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card variant="default" className="border border-ink-100 xl:col-span-2">
          <Card.Header className="p-5 pb-0">
            <Card.Title className="font-serif text-lg text-ink-900">
              Books by category
            </Card.Title>
            <Card.Description>Share of catalog per genre</Card.Description>
          </Card.Header>
          <Card.Content className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={overview.booksByCategory}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {overview.booksByCategory.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} books`, name]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>

        <Card variant="default" className="border border-ink-100 xl:col-span-3">
          <Card.Header className="p-5 pb-0">
            <Card.Title className="font-serif text-lg text-ink-900">
              Revenue, last 6 months
            </Card.Title>
            <Card.Description>Gross revenue collected per month</Card.Description>
          </Card.Header>
          <Card.Content className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overview.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2D8" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#B4802F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
