"use client";

import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/Layout/dashboard/DashboardLayout";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "reader";

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
