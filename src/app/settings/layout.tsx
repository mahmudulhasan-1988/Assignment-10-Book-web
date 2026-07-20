"use client";

import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/Layout/dashboard/DashboardLayout";

export default function SettingsLayout({
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
