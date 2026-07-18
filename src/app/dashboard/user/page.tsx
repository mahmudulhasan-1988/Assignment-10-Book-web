import type { Metadata } from "next";
import UserDashboard from "@/components/dashboard/UserDashboard";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default function UserDashboardPage() {
  return <UserDashboard />;
}
