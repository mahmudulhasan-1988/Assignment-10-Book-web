"use client";

import { useSession } from "@/lib/auth-client";
import AdminProfile from "@/components/profile/AdminProfile";
import ReaderProfile from "@/components/profile/ReaderProfile";
import LibrarianProfile from "@/components/profile/LibrarianProfile";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rr-gold)] border-t-transparent" />
      </div>
    );
  }

  const user = session?.user;
  const role = (user as any)?.role || "reader";

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--rr-ink-dim)]">Please log in to view your profile.</p>
      </div>
    );
  }

  switch (role) {
    case "admin":
      return <AdminProfile user={user} />;
    case "librarian":
      return <LibrarianProfile user={user} />;
    default:
      return <ReaderProfile user={user} />;
  }
}
