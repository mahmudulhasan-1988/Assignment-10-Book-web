"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import StatsOverview from "./StatsOverview";
import AddBookForm from "./AddBookForm";
import ManageInventoryTable from "./ManageInventoryTable";
import ManageDeliveriesTable from "./ManageDeliveriesTable";
import { useDeliveries } from "@/lib/delivery-context";

const VALID_SECTIONS = ["overview", "add-book", "inventory", "deliveries"];

function SectionHeading({ title, count }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-display text-[19px] font-medium">{title}</h2>
      {count && <span className="font-mono-label text-[11px] text-[var(--rr-ink-dim)]">{count}</span>}
    </div>
  );
}

export default function LibrarianDashboard() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("overview");
  const { deliveries, loading, fetchDeliveries, updateDeliveryStatus } = useDeliveries();

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "");
      if (hash && VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("overview");
      }
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  async function handleAdvanceDeliveryStatus(id, status) {
    console.log(`[LibrarianDashboard] Advancing delivery ${id} to ${status}`);
    await updateDeliveryStatus(id, status);
    console.log(`[LibrarianDashboard] Status updated, refetching deliveries...`);
    await fetchDeliveries();
    console.log(`[LibrarianDashboard] Refetch complete`);
  }

  return (
    <main className="py-6">
      {activeSection === "overview" && (
        <>
          <div className="mb-8">
            <p className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
              Welcome back, Librarian
            </p>
            <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
              Manage your listings, track earnings, and keep deliveries moving.
            </p>
          </div>
          <StatsOverview />
        </>
      )}

      {activeSection === "add-book" && (
        <>
          <SectionHeading title="Add Book" />
          <AddBookForm />
        </>
      )}

      {activeSection === "inventory" && (
        <>
          <SectionHeading title="Manage Inventory" />
          <ManageInventoryTable />
        </>
      )}

      {activeSection === "deliveries" && (
        <>
          <SectionHeading
            title="Manage Deliveries"
            count={loading ? "Loading..." : `${deliveries.length} requests`}
          />
          <ManageDeliveriesTable
            deliveries={deliveries}
            onAdvanceStatus={handleAdvanceDeliveryStatus}
          />
        </>
      )}
    </main>
  );
}
