// lib/mock-admin-data.ts
//
// Stand-in data layer. Swap each function below for a real fetch to your
// API/database (e.g. `await db.user.findMany()` or `await fetch("/api/admin/users")`).
// Keeping the function names and return shapes stable means the components
// in components/admin/* don't need to change when you wire up the backend.

import type {
  AdminOverview,
  Book,
  PlatformUser,
  Transaction,
} from "@/types/admin";

export async function getAdminOverview(): Promise<AdminOverview> {
  return {
    totalUsers: 12480,
    totalBooks: 3204,
    totalDeliveries: 8931,
    totalRevenue: 214380,
    userGrowthPct: 8.2,
    bookGrowthPct: 4.6,
    deliveryGrowthPct: 12.1,
    revenueGrowthPct: 6.4,
    booksByCategory: [
      { category: "Fiction", count: 942 },
      { category: "Non-Fiction", count: 611 },
      { category: "Sci-Fi & Fantasy", count: 487 },
      { category: "Children's", count: 356 },
      { category: "Biography", count: 298 },
      { category: "Academic", count: 274 },
      { category: "Poetry", count: 236 },
    ],
    revenueByMonth: [
      { month: "Feb", revenue: 24800 },
      { month: "Mar", revenue: 27650 },
      { month: "Apr", revenue: 26100 },
      { month: "May", revenue: 31200 },
      { month: "Jun", revenue: 34950 },
      { month: "Jul", revenue: 37870 },
    ],
  };
}

export async function getPendingBooks(): Promise<Book[]> {
  return [
    {
      id: "bk_1042",
      title: "The Quiet Cartographer",
      author: "Miriam Yeboah",
      category: "Fiction",
      submittedBy: "librarian.dana@bookhive.io",
      status: "pending_approval",
      price: 14.5,
      submittedAt: "2026-07-15T09:20:00Z",
    },
    {
      id: "bk_1043",
      title: "Structural Thinking",
      author: "Owen Petrov",
      category: "Academic",
      submittedBy: "librarian.faisal@bookhive.io",
      status: "pending_approval",
      price: 22.0,
      submittedAt: "2026-07-16T11:05:00Z",
    },
    {
      id: "bk_1044",
      title: "Salt & Ember",
      author: "Ruth Okonkwo",
      category: "Poetry",
      submittedBy: "librarian.dana@bookhive.io",
      status: "pending_approval",
      price: 9.99,
      submittedAt: "2026-07-17T08:40:00Z",
    },
    {
      id: "bk_1045",
      title: "The Long Ledger",
      author: "Sam Whitfield",
      category: "Non-Fiction",
      submittedBy: "librarian.priya@bookhive.io",
      status: "pending_approval",
      price: 18.25,
      submittedAt: "2026-07-17T15:12:00Z",
    },
  ];
}

export async function getAllBooks(): Promise<Book[]> {
  const pending = await getPendingBooks();
  return [
    ...pending,
    {
      id: "bk_0912",
      title: "Harbor Lights",
      author: "Elena Marchetti",
      category: "Fiction",
      submittedBy: "librarian.dana@bookhive.io",
      status: "published",
      price: 12.0,
      submittedAt: "2026-05-02T10:00:00Z",
    },
    {
      id: "bk_0888",
      title: "Atlas of Small Kingdoms",
      author: "Kofi Mensah",
      category: "Children's",
      submittedBy: "librarian.faisal@bookhive.io",
      status: "published",
      price: 8.5,
      submittedAt: "2026-04-18T10:00:00Z",
    },
    {
      id: "bk_0764",
      title: "Undertow",
      author: "Priya Raman",
      category: "Sci-Fi & Fantasy",
      submittedBy: "librarian.priya@bookhive.io",
      status: "unpublished",
      price: 15.75,
      submittedAt: "2026-03-11T10:00:00Z",
    },
  ];
}

export async function getAllUsers(): Promise<PlatformUser[]> {
  return [
    {
      id: "usr_001",
      name: "Dana Whitmore",
      email: "librarian.dana@bookhive.io",
      role: "librarian",
      joinedAt: "2025-11-02T00:00:00Z",
    },
    {
      id: "usr_002",
      name: "Faisal Rahman",
      email: "librarian.faisal@bookhive.io",
      role: "librarian",
      joinedAt: "2025-12-14T00:00:00Z",
    },
    {
      id: "usr_003",
      name: "Priya Raman",
      email: "librarian.priya@bookhive.io",
      role: "librarian",
      joinedAt: "2026-01-20T00:00:00Z",
    },
    {
      id: "usr_004",
      name: "Marcus Lee",
      email: "marcus.lee@example.com",
      role: "reader",
      joinedAt: "2026-02-08T00:00:00Z",
    },
    {
      id: "usr_005",
      name: "Sofia Guzman",
      email: "sofia.guzman@example.com",
      role: "reader",
      joinedAt: "2026-03-01T00:00:00Z",
    },
    {
      id: "usr_006",
      name: "Ibrahim Toure",
      email: "ibrahim.toure@example.com",
      role: "admin",
      joinedAt: "2025-09-01T00:00:00Z",
    },
  ];
}

export async function getAllTransactions(): Promise<Transaction[]> {
  return [
    {
      id: "txn_88213",
      userEmail: "marcus.lee@example.com",
      librarianEmail: "librarian.dana@bookhive.io",
      bookTitle: "Harbor Lights",
      amount: 12.0,
      date: "2026-07-16T14:22:00Z",
    },
    {
      id: "txn_88214",
      userEmail: "sofia.guzman@example.com",
      librarianEmail: "librarian.faisal@bookhive.io",
      bookTitle: "Atlas of Small Kingdoms",
      amount: 8.5,
      date: "2026-07-16T17:05:00Z",
    },
    {
      id: "txn_88215",
      userEmail: "marcus.lee@example.com",
      librarianEmail: "librarian.priya@bookhive.io",
      bookTitle: "Undertow",
      amount: 15.75,
      date: "2026-07-17T09:41:00Z",
    },
    {
      id: "txn_88216",
      userEmail: "sofia.guzman@example.com",
      librarianEmail: "librarian.dana@bookhive.io",
      bookTitle: "Harbor Lights",
      amount: 12.0,
      date: "2026-07-17T19:10:00Z",
    },
  ];
}
