"use client";

import { useState } from "react";
import { BookCheck, BookOpen, LayoutGrid, Receipt, Users } from "lucide-react";
import { OverviewSection } from "./OverviewSection";
import { BookApprovalQueue } from "./BookApprovalQueue";
import { ManageUsersTable } from "./ManageUsersTable";
import { ManageBooksTable } from "./ManageBooksTable";
import { TransactionsTable } from "./TransactionsTable";
import type { AdminOverview, Book, PlatformUser, Transaction } from "@/types/admin";

type SectionKey = "overview" | "approvals" | "users" | "books" | "transactions";

interface AdminDashboardProps {
  overview: AdminOverview;
  pendingBooks: Book[];
  allBooks: Book[];
  users: PlatformUser[];
  transactions: Transaction[];
}

const SECTIONS: { key: SectionKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "approvals", label: "Book approvals", icon: BookCheck },
  { key: "users", label: "Manage users", icon: Users },
  { key: "books", label: "All books", icon: BookOpen },
  { key: "transactions", label: "Transactions", icon: Receipt },
];

export function AdminDashboard({
  overview,
  pendingBooks,
  allBooks,
  users,
  transactions,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  return (
    <div className="min-h-screen bg-parchment-50">
      <header className="border-b border-ink-100 bg-white px-6 py-6 sm:px-10">
        <p className="text-xs font-medium uppercase tracking-widest text-gold-700">
          BookHive
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink-900">Admin console</h1>
        <p className="mt-1 text-sm text-ink-500">
          Oversee catalog approvals, accounts, listings, and revenue platform-wide.
        </p>
      </header>

      <nav className="sticky top-0 z-10 border-b border-ink-100 bg-parchment-50/95 px-6 backdrop-blur sm:px-10">
        <div className="flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-ink-900 text-white"
                    : "text-ink-500 hover:bg-ink-100/60")
                }
              >
                <Icon size={15} />
                {section.label}
                {section.key === "approvals" && pendingBooks.length > 0 && (
                  <span
                    className={
                      "ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold " +
                      (isActive
                        ? "bg-white/20 text-white"
                        : "bg-gold-100 text-gold-700")
                    }
                  >
                    {pendingBooks.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="px-6 py-8 sm:px-10">
        {activeSection === "overview" && <OverviewSection overview={overview} />}
        {activeSection === "approvals" && (
          <BookApprovalQueue initialBooks={pendingBooks} />
        )}
        {activeSection === "users" && <ManageUsersTable initialUsers={users} />}
        {activeSection === "books" && <ManageBooksTable initialBooks={allBooks} />}
        {activeSection === "transactions" && (
          <TransactionsTable transactions={transactions} />
        )}
      </main>
    </div>
  );
}
