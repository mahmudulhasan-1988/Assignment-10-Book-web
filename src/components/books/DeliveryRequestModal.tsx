"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  Truck,
  Calendar,
  CheckCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useDeliveries, type Delivery } from "@/lib/delivery-context";
import type { BookItem } from "@/lib/books-data";

interface DeliveryRequestModalProps {
  book: BookItem;
  onClose: () => void;
}

export default function DeliveryRequestModal({ book, onClose }: DeliveryRequestModalProps) {
  const { data: session } = useSession();
  const { addDelivery } = useDeliveries();
  const [step, setStep] = useState<"confirm" | "loading" | "success" | "error">("confirm");
  const [errorMsg, setErrorMsg] = useState("");
  const [imageError, setImageError] = useState(false);

  const isLoggedIn = !!session?.user;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3);
  const formattedDate = estimatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  async function handleConfirm() {
    if (!isLoggedIn) return;

    setStep("loading");

    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          bookCover: book.coverImage,
          deliveryFee: book.deliveryFee,
        }),
      });

      if (res.ok) {
        const delivery: Delivery = await res.json();
        addDelivery(delivery);
        setStep("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to create delivery request");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--rr-hairline)] px-6 py-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface)] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">
            Request Delivery
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "confirm" && (
            <>
              {/* Book Info */}
              <div className="mb-6 flex gap-4">
                <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--rr-surface-2)]">
                  {!imageError ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen size={20} className="text-[var(--rr-ink-dim)]" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-[var(--rr-ink)]">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[var(--rr-ink-dim)]">{book.author}</p>
                  <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">{book.category}</p>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--rr-ink-dim)]">
                    <Truck size={16} className="text-[var(--rr-gold)]" />
                    Delivery Fee
                  </div>
                  <span className="text-sm font-semibold text-[var(--rr-ink)]">
                    ${book.deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[var(--rr-hairline)] bg-[var(--rr-surface)] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--rr-ink-dim)]">
                    <Calendar size={16} className="text-[var(--rr-slate)]" />
                    Estimated Arrival
                  </div>
                  <span className="text-sm font-semibold text-[var(--rr-ink)]">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Info Note */}
              <p className="mb-6 text-xs text-[var(--rr-ink-dim)]">
                By confirming, you agree to pay the delivery fee when the book is delivered.
                You can track your delivery status in your dashboard.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-3 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
                >
                  <Truck size={16} />
                  Confirm Request
                </button>
              </div>
            </>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center py-12">
              <Loader2 size={40} className="animate-spin text-[var(--rr-gold)]" />
              <p className="mt-4 text-sm text-[var(--rr-ink-dim)]">
                Processing your request...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-sage)]/10">
                <CheckCircle size={32} className="text-[var(--rr-sage)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">
                Request Submitted!
              </h3>
              <p className="mt-2 text-center text-sm text-[var(--rr-ink-dim)]">
                Your delivery request for{" "}
                <span className="font-medium text-[var(--rr-ink)]">{book.title}</span>{" "}
                has been submitted. A librarian will process it shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-[var(--rr-gold)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center py-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-wine)]/10">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--rr-ink)]">
                Request Failed
              </h3>
              <p className="mt-2 text-center text-sm text-[var(--rr-ink-dim)]">
                {errorMsg}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
