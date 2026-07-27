"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CreditCard, Loader2, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

import { useSession } from "@/lib/auth-client";

interface Book {
  _id?: string;
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  deliveryFee: number;
  coverImage: string;
  status: string;
}

interface RequestDeliveryModalProps {
  book: Book;
  onClose: () => void;
  onConfirm?: () => void;
}

const STRIPE_CHECKOUT_URL = "https://checkout.stripe.com/c/pay/cs_test_a1VQ02rOrEt0BR119U386sGBP8ygUWp4N5I2cLZm5V9p8UV1ReYXuQyY32#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdicGRmZGhqaWBTZHdsZGtxJz8nZmprcXdqaScpJ2R1bE5gfCc%2FJ3VuWnFgdnFaMDRRc3d%2FVzFDR1dwaTUwTjZ%2FQ01EYXdLdU09U1ZwQ1NuREEzcXA8bFZ%2FfEZ0V1ZScDdPUnVpUGBoYTNAcVQwV0hGaUl9a0FVaH9XSEtHfVJkSGk8RFdOSEw1NWRxZHd3MFZnJyknY3dqaFZgd3Ngdyc%2FcXdwYCknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYycpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl";

export default function RequestDeliveryModal({
  book,
  onClose,
  onConfirm,
}: RequestDeliveryModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<"confirm" | "processing" | "success" | "error">("confirm");
  const [imageError, setImageError] = useState(false);

  async function handleConfirm() {
    setStep("processing");

    try {
      // Save delivery & transaction into MongoDB first
      await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || "anonymous",
          userName: session?.user?.name || "Anonymous",
          userEmail: session?.user?.email || "",
          bookId: book.id || book._id || "",
          bookTitle: book.title || "",
          bookAuthor: book.author || "",
          bookCover: book.coverImage || "",
          deliveryFee: book.deliveryFee || 0,
          category: book.category || "",
          status: "Pending",
          paymentStatus: "Successful",
          requestDate: new Date().toISOString(),
        }),
      });

      // Create dynamic Stripe checkout session with exact book price
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: book.title || "Book Delivery",
          deliveryFee: book.deliveryFee || 0,
          bookCover: book.coverImage || "",
          bookId: book.id || book._id || "",
        }),
      });

      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
      }

      // Fallback redirect to Stripe Checkout URL
      window.location.href = STRIPE_CHECKOUT_URL;
    } catch {
      // Fallback redirect to Stripe Checkout URL
      window.location.href = STRIPE_CHECKOUT_URL;
    }
  }

  function handleClose() {
    setStep("confirm");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--rr-hairline)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--rr-ink)]">
            Request Delivery
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-[var(--rr-ink-dim)] hover:bg-[var(--rr-surface-2)] hover:text-[var(--rr-ink)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "confirm" && (
            <>
              {/* Book Info */}
              <div className="flex gap-4">
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--rr-ink)] line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[var(--rr-ink-dim)]">
                    by {book.author}
                  </p>
                  <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">
                    {book.category}
                  </p>
                </div>
              </div>

              {/* Delivery Fee / Price */}
              <div className="mt-6 rounded-xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--rr-ink)]">
                      Book Price / Delivery Fee
                    </p>
                    <p className="text-xs text-[var(--rr-ink-dim)]">
                      Includes handling and shipping
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[var(--rr-gold)]">
                    ${book.deliveryFee ? book.deliveryFee.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--rr-slate)]/10 px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--rr-slate)]" />
                <p className="text-xs text-[var(--rr-ink-dim)]">
                  By confirming, you agree to our delivery terms. The book will be delivered within 3-5 business days.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-[var(--rr-hairline)] px-4 py-2.5 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--rr-gold)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--rr-gold-bright)] transition-colors"
                >
                  <CreditCard size={16} />
                  Confirm Request
                </button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="py-8 text-center">
              <Loader2 size={40} className="mx-auto animate-spin text-[var(--rr-gold)]" />
              <p className="mt-4 text-sm text-[var(--rr-ink)]">
                Processing your request...
              </p>
              <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">
                Please wait while we redirect you to payment
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-sage)]/10">
                <CheckCircle size={32} className="text-[var(--rr-sage)]" />
              </div>
              <p className="mt-4 text-lg font-medium text-[var(--rr-ink)]">
                Request Confirmed!
              </p>
              <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
                Redirecting to payment...
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-wine)]/10">
                <AlertCircle size={32} className="text-[var(--rr-wine)]" />
              </div>
              <p className="mt-4 text-lg font-medium text-[var(--rr-ink)]">
                Something went wrong
              </p>
              <p className="mt-1 text-sm text-[var(--rr-ink-dim)]">
                Please try again later
              </p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-lg border border-[var(--rr-hairline)] px-4 py-2 text-sm font-medium text-[var(--rr-ink)] hover:bg-[var(--rr-surface-2)]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
