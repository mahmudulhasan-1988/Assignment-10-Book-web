import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail, ShoppingBag, Home, Receipt } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { subscription } from "@/lib/actions/payment";

export default async function Success({ searchParams }) {
  const params = await searchParams;
  const { session_id } = params || {};

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // Handle Stripe subscription flow if session_id is passed
  if (session_id) {
    const {
      status,
      customer_details: { email: customerEmail },
      amount_total,
      currency,
      line_items,
    } = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product", "payment_intent"],
    });

    if (status === "open") {
      return redirect("/");
    }

    await subscription({ user, session_id });

    if (status === "complete") {
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency?.toUpperCase() || "USD",
        }).format(amount / 100);
      };

      const orderNumber = session_id.slice(-8).toUpperCase();

      return (
        <div className="min-h-screen bg-[var(--rr-bg)] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-[var(--rr-surface)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--rr-hairline)]">
              <div className="bg-gradient-to-r from-[var(--rr-sage)] to-emerald-600 px-8 py-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Payment Successful!
                </h1>
                <p className="text-white/80 text-lg">
                  Thank you for your purchase
                </p>
              </div>

              <div className="px-8 py-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-[var(--rr-surface-2)] rounded-xl border border-[var(--rr-hairline)]">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-[var(--rr-ink-dim)]" />
                    <span className="text-sm text-[var(--rr-ink-dim)]">Order Number</span>
                  </div>
                  <span className="font-mono font-semibold text-[var(--rr-ink)]">
                    #{orderNumber}
                  </span>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[var(--rr-slate)]/10 rounded-xl border border-[var(--rr-slate)]/20">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-[var(--rr-slate)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--rr-ink)]">
                      A confirmation email has been sent to{" "}
                      <span className="font-semibold">{customerEmail}</span>
                    </p>
                    <p className="text-xs text-[var(--rr-ink-dim)] mt-1">
                      Please check your spam folder if you don&apos;t see it within 5 minutes
                    </p>
                  </div>
                </div>

                {line_items?.data && line_items.data.length > 0 && (
                  <div className="border-t border-[var(--rr-hairline)] pt-4">
                    <h3 className="text-sm font-semibold text-[var(--rr-ink)] mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      {line_items.data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="w-4 h-4 text-[var(--rr-ink-dim)]" />
                            <span className="text-[var(--rr-ink)]">
                              {item.description || item.price?.product?.name || "Item"}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-[var(--rr-ink-dim)]">×{item.quantity}</span>
                            )}
                          </div>
                          <span className="font-medium text-[var(--rr-ink)]">
                            {formatCurrency(item.amount_total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {amount_total && (
                  <div className="flex items-center justify-between pt-4 border-t-2 border-[var(--rr-hairline)]">
                    <span className="text-base font-semibold text-[var(--rr-ink)]">Total</span>
                    <span className="text-2xl font-bold text-[var(--rr-ink)]">
                      {formatCurrency(amount_total)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    href="/"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--rr-ink)] hover:opacity-90 text-[var(--rr-bg)] font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Home className="w-4 h-4" />
                    Return Home
                  </Link>
                  <Link
                    href="/dashboard/reader#deliveries"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--rr-sage)] to-emerald-600 hover:from-[var(--rr-sage)]/90 hover:to-emerald-600/90 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-[var(--rr-sage)]/25"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    View Deliveries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // No valid params
  redirect("/");
}
