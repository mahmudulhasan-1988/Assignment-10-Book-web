"use client";

import { Card } from "@heroui/react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { monthlyEarnings, quickStats, topRequestedBooks } from "@/lib/librarian-data";

const spines = [
  {
    label: "Books Listed",
    value: quickStats.totalBooksListed.toString(),
    foot: "across all statuses",
    gradient: "from-[#4d6a48] to-[#33472f]",
  },
  {
    label: "Total Earnings",
    value: `$${quickStats.totalEarnings.toFixed(2)}`,
    foot: "lifetime, from fees",
    gradient: "from-[#b3903f] to-[#7c5e26]",
  },
  {
    label: "Active Pending Requests",
    value: quickStats.activePendingRequests.toString(),
    foot: "awaiting dispatch",
    gradient: "from-[#8a4a3f] to-[#602f28]",
  },
];

export default function StatsOverview() {
  return (
    <>
      <div className="relative mb-10 flex flex-col items-stretch gap-3.5 border-b-[3px] border-[#3c2e1c] px-1.5 pb-[18px] sm:flex-row sm:items-end">
        {spines.map((spine) => (
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

      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <Card.Header>
            <Card.Title className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
              Earnings Per Month
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#b9c3b6", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(201,169,92,0.08)" }}
                    formatter={(value) => [`$${value}`, "Earnings"]}
                    contentStyle={{
                      background: "#26402f",
                      border: "1px solid rgba(201,169,92,0.16)",
                      borderRadius: 8,
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 12,
                      color: "#eee6d4",
                    }}
                  />
                  <Bar dataKey="earnings" fill="#c9a45c" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        <Card className="p-5">
          <Card.Header>
            <Card.Title className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
              Most Requested Books
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="flex flex-col gap-3">
              {topRequestedBooks.map((book, i) => (
                <li key={book.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-label flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--rr-hairline)] text-[10px] text-[var(--rr-gold-bright)]">
                      {i + 1}
                    </span>
                    <span className="font-display text-[14px]">{book.title}</span>
                  </div>
                  <span className="font-mono-label shrink-0 text-[11px] text-[var(--rr-ink-dim)]">
                    {book.requests} requests
                  </span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      </div>
    </>
  );
}
