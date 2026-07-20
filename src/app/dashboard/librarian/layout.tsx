import DashboardLayout from "@/components/Layout/dashboard/DashboardLayout";

export const metadata = {
  title: "Librarian Dashboard | BiblioDrop",
  description: "Librarian dashboard for BiblioDrop",
};

export default function LibrarianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="librarian">
      {children}
    </DashboardLayout>
  );
}
