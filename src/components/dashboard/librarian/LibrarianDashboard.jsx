"use client";

import { useState } from "react";
import StatsOverview from "./StatsOverview";
import AddBookForm from "./AddBookForm";
import ManageInventoryTable from "./ManageInventoryTable";
import ManageDeliveriesTable from "./ManageDeliveriesTable";
import { initialBooks, initialDeliveries } from "@/lib/librarian-data";

function SectionHeading({ title, count }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-display text-[19px] font-medium">{title}</h2>
      {count && <span className="font-mono-label text-[11px] text-[var(--rr-ink-dim)]">{count}</span>}
    </div>
  );
}

export default function LibrarianDashboard() {
  const [books, setBooks] = useState(initialBooks);
  const [deliveries, setDeliveries] = useState(initialDeliveries);

  function handleAddBook(newBook) {
    setBooks((prev) => [newBook, ...prev]);
  }

  function handleUpdateBook(updatedBook) {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  }

  function handleDeleteBook(id) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  function handleAdvanceDeliveryStatus(id, status) {
    setDeliveries((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <div className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
        Dashboard · /dashboard/librarian
      </div>
      <h1 className="font-display mt-1.5 text-[28px] font-medium tracking-tight sm:text-[34px]">
        Welcome back, Librarian
      </h1>
      <p className="mb-8 text-sm text-[var(--rr-ink-dim)]">
        Manage your listings, track earnings, and keep deliveries moving.
      </p>

      <div className="mb-11">
        <SectionHeading title="Overview" />
        <StatsOverview />
      </div>

      <div className="mb-11">
        <SectionHeading title="Add Book" />
        <AddBookForm onAddBook={handleAddBook} />
      </div>

      <div className="mb-11">
        <SectionHeading title="Manage Inventory" count={`${books.length} books`} />
        <ManageInventoryTable
          books={books}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
        />
      </div>

      <div>
        <SectionHeading title="Manage Deliveries" count={`${deliveries.length} requests`} />
        <ManageDeliveriesTable deliveries={deliveries} onAdvanceStatus={handleAdvanceDeliveryStatus} />
      </div>
    </div>
  );
}
