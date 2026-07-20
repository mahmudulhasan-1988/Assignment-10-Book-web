import DashboardLayout from "@/components/Layout/dashboard/DashboardLayout";

export const metadata = {
  title: "Admin Console | BiblioDrop",
  description: "Admin dashboard for BiblioDrop",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="admin">
      {children}
    </DashboardLayout>
  );
}
