"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Loader2 } from "lucide-react";

export default function SellerPricingPage() {
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      name: "Starter Seller",
      price: "$4",
      period: "/month",
      description: "Perfect for new sellers starting their journey.",
      features: [
        "Up to 50 products",
        "Basic analytics",
        "Order management",
        "Seller profile",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional Seller",
      price: "$14",
      period: "/month",
      description: "For growing businesses that need more visibility.",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Priority product listing",
        "Promotional campaigns",
        "Inventory management",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise Seller",
      price: "Custom",
      period: "",
      description: "For brands and large-scale businesses.",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "Featured homepage placement",
        "API access",
        "24/7 support",
      ],
      popular: false,
    },
  ];

  async function handleSubscribe(planName) {
    setLoading(planName);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else if (data.error) {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="bg-[var(--rr-bg)]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <span className="inline-flex rounded-full border border-[var(--rr-hairline)] px-4 py-1 text-sm font-medium text-[var(--rr-ink)]">
          Become a Seller
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl text-[var(--rr-ink)]">
          Grow Your Business
          <span className="block text-[var(--rr-gold)]">
            Sell to Thousands of Customers
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--rr-ink-dim)]">
          Start selling on our marketplace and reach more customers with
          powerful tools, secure payments, and dedicated seller support.
        </p>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border border-[var(--rr-hairline)] bg-[var(--rr-surface)] p-8 shadow-sm transition-all hover:shadow-xl ${
                plan.popular ? "border-[var(--rr-gold)] ring-2 ring-[var(--rr-gold)]/20" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--rr-wine)] px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-[var(--rr-ink)]">{plan.name}</h3>

              <p className="mt-3 text-[var(--rr-ink-dim)]">{plan.description}</p>

              <div className="mt-8">
                <span className="text-5xl font-bold text-[var(--rr-ink)]">{plan.price}</span>
                <span className="text-[var(--rr-ink-dim)]">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[var(--rr-ink)]">
                    <svg
                      className="h-5 w-5 shrink-0 text-[var(--rr-sage)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.name === "Enterprise Seller" ? (
                <Button
                  className="mt-8 w-full font-medium"
                >
                  Contact Sales
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loading === plan.name}
                  className="mt-8 w-full font-medium"
                >
                  {loading === plan.name ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Become Seller"
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--rr-ink-dim)]">
          Secure payments powered by Stripe. Cancel anytime.
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--rr-hairline)] bg-[var(--rr-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[var(--rr-ink)]">Why Sell With Us?</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6">
              <h3 className="font-semibold text-[var(--rr-ink)]">Large Customer Base</h3>
              <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                Reach thousands of active buyers every day.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6">
              <h3 className="font-semibold text-[var(--rr-ink)]">Secure Payments</h3>
              <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                Fast and secure payment settlements.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6">
              <h3 className="font-semibold text-[var(--rr-ink)]">Seller Dashboard</h3>
              <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                Track sales, inventory, and performance.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--rr-hairline)] bg-[var(--rr-bg)] p-6">
              <h3 className="font-semibold text-[var(--rr-ink)]">Marketing Tools</h3>
              <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
                Promote products and boost visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-3xl border border-[var(--rr-hairline)] bg-gradient-to-r from-[var(--rr-gold)]/10 to-[var(--rr-gold)]/5 p-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--rr-ink)]">Ready to Start Selling?</h2>

          <p className="mx-auto mt-4 max-w-2xl text-[var(--rr-ink-dim)]">
            Join our marketplace today and start growing your online business.
          </p>

          <button className="mt-8 rounded-xl bg-[var(--rr-ink)] px-8 py-3 font-medium text-[var(--rr-bg)]">
            Apply as Seller
          </button>
        </div>
      </section>
    </main>
  );
}
