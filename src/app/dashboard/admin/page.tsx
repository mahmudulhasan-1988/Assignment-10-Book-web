import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getAdminOverview,
  getAllBooks,
  getAllTransactions,
  getAllUsers,
  getPendingBooks,
} from "@/lib/mock-admin-data";

// TODO: guard this route so only role === "admin" can reach it, e.g. in
// middleware.ts or a layout that reads the session and redirects otherwise.

export const metadata = {
  title: "Admin console",
};

export default async function AdminDashboardPage() {
  const [overview, pendingBooks, allBooks, users, transactions] = await Promise.all([
    getAdminOverview(),
    getPendingBooks(),
    getAllBooks(),
    getAllUsers(),
    getAllTransactions(),
  ]);

  return (
    <AdminDashboard
      overview={overview}
      pendingBooks={pendingBooks}
      allBooks={allBooks}
      users={users}
      transactions={transactions}
    />
  );
}
