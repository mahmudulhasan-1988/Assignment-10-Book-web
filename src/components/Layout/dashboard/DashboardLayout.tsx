"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import ProfileModal from "@/components/profile/ProfileModal";

type Role = "admin" | "librarian" | "reader";

interface DashboardLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role,
  children,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="min-h-screen bg-[var(--rr-bg)]">
      {!profileOpen && (
        <>
          <DashboardSidebar
            role={role}
            user={user}
            onCollapse={setSidebarCollapsed}
          />
          <DashboardNavbar
            role={role}
            user={user}
            sidebarCollapsed={sidebarCollapsed}
            onProfileClick={() => setProfileOpen(true)}
          />
        </>
      )}

      <main
        className={`transition-all duration-300 pt-16 ${
          profileOpen
            ? "pl-0"
            : sidebarCollapsed
            ? "pl-0 md:pl-[72px]"
            : "pl-0 md:pl-64"
        }`}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>

      {profileOpen && (
        <ProfileModal onClose={() => setProfileOpen(false)} />
      )}
    </div>
  );
}
