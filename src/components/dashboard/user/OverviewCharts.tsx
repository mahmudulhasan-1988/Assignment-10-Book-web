"use client";

import { Card } from "@heroui/react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { deliveries, monthlyReads } from "@/lib/dashboard-data";

const STATUS_COLORS: Record<string, string> = {
  Delivered: "#7fa37c",
  Dispatched: "#7592ab",
  Pending: "#c9a45c",
};

function statusBreakdown() {
  const counts: Record<string, number> = { Delivered: 0, Dispatched: 0, Pending: 0 };
  deliveries.forEach((d) => {
    counts[d.status] += 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export default function OverviewCharts() {
  const statusData = statusBreakdown();

  return (
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1.4fr_1fr]">
      <Card className="p-5">
        <Card.Header>
          <Card.Title className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
            Books Read Per Month
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReads}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(201,169,92,0.08)" }}
                  contentStyle={{
                    background: "#26402f",
                    border: "1px solid rgba(201,169,92,0.16)",
                    borderRadius: 8,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    color: "#eee6d4",
                  }}
                />
                <Bar dataKey="count" fill="#c9a45c" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Content>
      </Card>

      <Card className="p-5">
        <Card.Header>
          <Card.Title className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
            Delivery Status Split
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="#203528"
                  strokeWidth={3}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-[11px] text-[var(--rr-ink-dim)]">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: STATUS_COLORS[entry.name] }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
