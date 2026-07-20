export type BookStatus = "pending_approval" | "published" | "unpublished";
export type UserRole = "admin" | "librarian" | "reader";

export interface AdminOverview {
  totalUsers: number;
  totalBooks: number;
  totalDeliveries: number;
  totalRevenue: number;
  userGrowthPct: number;
  bookGrowthPct: number;
  deliveryGrowthPct: number;
  revenueGrowthPct: number;
  booksByCategory: { category: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  submittedBy: string;
  status: BookStatus;
  price: number;
  submittedAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  userEmail: string;
  librarianEmail: string;
  bookTitle: string;
  amount: number;
  date: string;
}
