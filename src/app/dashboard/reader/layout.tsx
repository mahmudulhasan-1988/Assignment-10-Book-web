import DashboardLayout from "@/components/Layout/dashboard/DashboardLayout";

export const metadata = {
  title: "Reader Dashboard | BiblioDrop",
  description: "Reader dashboard for BiblioDrop",
};

export default function ReaderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="reader">
      {children}
    </DashboardLayout>
  );
}
