"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, BookOpen, Building2, Zap, Loader2 } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "Explorer",
    icon: BookOpen,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for casual readers who want to discover new books.",
    color: "emerald",
    popular: false,
    features: [
      { text: "Browse full book catalog", included: true },
      { text: "Up to 3 deliveries per month", included: true },
      { text: "Write & read reviews", included: true },
      { text: "Basic reading lists", included: true },
      { text: "Email support", included: true },
      { text: "Priority delivery", included: false },
      { text: "Early access to new arrivals", included: false },
      { text: "Librarian recommendations", included: false },
    ],
  },
  {
    id: "premium",
    name: "Bibliophile",
    icon: Sparkles,
    monthlyPrice: 9.99,
    yearlyPrice: 79.99,
    description: "Unlimited deliveries and premium features for avid readers.",
    color: "gold",
    popular: true,
    features: [
      { text: "Browse full book catalog", included: true },
      { text: "Unlimited deliveries", included: true },
      { text: "Write & read reviews", included: true },
      { text: "Unlimited reading lists", included: true },
      { text: "Priority 24/7 support", included: true },
      { text: "Priority delivery", included: true },
      { text: "Early access to new arrivals", included: true },
      { text: "Librarian recommendations", included: false },
    ],
  },
  {
    id: "library",
    name: "Librarian",
    icon: Building2,
    monthlyPrice: 29.99,
    yearlyPrice: 239.99,
    description: "For library owners and staff to manage and share their collections.",
    color: "wine",
    popular: false,
    features: [
      { text: "Browse full book catalog", included: true },
      { text: "Unlimited deliveries", included: true },
      { text: "Write & read reviews", included: true },
      { text: "Unlimited reading lists", included: true },
      { text: "Priority 24/7 support", included: true },
      { text: "Priority delivery", included: true },
      { text: "Early access to new arrivals", included: true },
      { text: "Librarian recommendations", included: true },
    ],
  },
];

const colorMap = {
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    border: "border-emerald-200 dark:border-emerald-800",
    check: "text-emerald-500",
    ring: "ring-emerald-500/20",
  },
  gold: {
    badge: "bg-[var(--rr-gold)]/10 text-[var(--rr-gold)]",
    iconBg: "bg-[var(--rr-gold)]/10",
    iconColor: "text-[var(--rr-gold)]",
    button: "bg-[var(--rr-gold)] hover:bg-[var(--rr-gold-bright)] text-white",
    border: "border-[var(--rr-gold)]/30",
    check: "text-[var(--rr-gold)]",
    ring: "ring-[var(--rr-gold)]/20",
  },
  wine: {
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    button: "bg-rose-600 hover:bg-rose-500 text-white",
    border: "border-rose-200 dark:border-rose-800",
    check: "text-rose-500",
    ring: "ring-rose-500/20",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  const handleCheckout = async (plan, interval) => {
    if (plan.id === "free") {
      router.push("/register");
      return;
    }

    const priceKey = `${plan.id}-${interval}`;
    setLoading(`${plan.id}-${interval}`);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe error:", data.error);
        alert(`Payment failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(`Payment failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 bg-[var(--rr-bg)]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--rr-gold)]/10 text-[var(--rr-gold)] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Zap size={14} />
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-[var(--rr-ink)]"
          >
            Choose Your Reading Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[var(--rr-ink-dim)] max-w-md mx-auto"
          >
            Start free and upgrade anytime. All plans include access to our full book catalog.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-[var(--rr-surface)] border border-[var(--rr-hairline)]"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-[var(--rr-ink)] text-[var(--rr-bg)] shadow-sm"
                  : "text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly
                  ? "bg-[var(--rr-ink)] text-[var(--rr-bg)] shadow-sm"
                  : "text-[var(--rr-ink-dim)] hover:text-[var(--rr-ink)]"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs text-[var(--rr-gold)] font-semibold">Save 33%</span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch"
        >
          {plans.map((plan) => {
            const colors = colorMap[plan.color];
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const perMonth = isYearly && plan.yearlyPrice > 0
              ? (plan.yearlyPrice / 12).toFixed(2)
              : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col p-8 rounded-2xl border bg-[var(--rr-surface)] transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? `${colors.border} shadow-lg ring-1 ${colors.ring}`
                    : "border-[var(--rr-hairline)]"
                }`}
              >
                {plan.popular && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconColor} mb-4`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--rr-ink)]">{plan.name}</h3>
                  <p className="mt-2 text-sm text-[var(--rr-ink-dim)] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    {price === 0 ? (
                      <span className="text-4xl font-extrabold text-[var(--rr-ink)]">Free</span>
                    ) : (
                      <>
                        <span className="text-lg text-[var(--rr-ink-dim)]">$</span>
                        <span className="text-4xl font-extrabold text-[var(--rr-ink)]">
                          {isYearly ? perMonth : price}
                        </span>
                        <span className="text-sm text-[var(--rr-ink-dim)]">/mo</span>
                      </>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-1 text-xs text-[var(--rr-ink-dim)]">
                      Billed ${price}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}>
                          <Check size={12} className={colors.check} />
                        </div>
                      ) : (
                        <div className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--rr-surface-2)]">
                          <X size={12} className="text-[var(--rr-ink-dim)]/50" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? "text-[var(--rr-ink)]" : "text-[var(--rr-ink-dim)]/50"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    onClick={() => handleCheckout(plan, isYearly ? "yearly" : "monthly")}
                    disabled={loading !== null}
                    className={`w-full h-12 font-semibold rounded-xl transition-all ${
                      plan.popular
                        ? colors.button
                        : "bg-[var(--rr-surface-2)] text-[var(--rr-ink)] hover:bg-[var(--rr-ink)] hover:text-[var(--rr-bg)]"
                    }`}
                  >
                    {loading === `${plan.id}-${isYearly ? "yearly" : "monthly"}` ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Redirecting...
                      </>
                    ) : price === 0 ? (
                      "Get Started Free"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 text-sm text-[var(--rr-ink-dim)]"
        >
          All plans include SSL encryption and secure payments via Stripe.
          Cancel anytime — no questions asked.
        </motion.p>
      </div>
    </section>
  );
}
