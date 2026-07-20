"use client";

import { useMemo } from "react";
import { BookOpen, Truck, DollarSign } from "lucide-react";
import { useDeliveries } from "@/lib/delivery-context";

const spineGradients = [
  "from-[#4d6a48] to-[#33472f]",
  "from-[#8a4a3f] to-[#602f28]",
  "from-[#b3903f] to-[#7c5e26]",
];

const icons = [BookOpen, Truck, DollarSign];

export default function StatsShelf() {
  const { deliveries, loading } = useDeliveries();

  const stats = useMemo(() => {
    const totalBooksRead = deliveries.filter((d) => d.status === "Delivered").length;
    const pendingDeliveries = deliveries.filter((d) => d.status === "Pending").length;
    const totalSpentOnFees = deliveries
      .filter((d) => d.status === "Delivered")
      .reduce((sum, d) => sum + d.deliveryFee, 0);
    return { totalBooksRead, pendingDeliveries, totalSpentOnFees };
  }, [deliveries]);

  const spines = loading
    ? Array.from({ length: 3 }).map((_, i) => ({
        label: "",
        value: "",
        foot: "",
        gradient: spineGradients[i],
        icon: icons[i],
        loading: true,
      }))
    : [
        {
          label: "Books Read",
          value: stats.totalBooksRead.toString(),
          foot: "delivered",
          gradient: spineGradients[0],
          icon: icons[0],
          loading: false,
        },
        {
          label: "Pending Deliveries",
          value: stats.pendingDeliveries.toString(),
          foot: "on the way",
          gradient: spineGradients[1],
          icon: icons[1],
          loading: false,
        },
        {
          label: "Spent on Fees",
          value: `$${stats.totalSpentOnFees.toFixed(2)}`,
          foot: "lifetime total",
          gradient: spineGradients[2],
          icon: icons[2],
          loading: false,
        },
      ];

  return (
    <div className="relative mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {spines.map((spine) => {
        const Icon = spine.icon;
        return (
          <div
            key={spine.label}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${spine.gradient} p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5" />
            
            {/* Icon */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Icon size={20} className="text-white/80" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {spine.loading ? (
                <>
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-8 w-16 animate-pulse rounded bg-white/20" />
                  <div className="mt-1 h-3 w-24 animate-pulse rounded bg-white/10" />
                </>
              ) : (
                <>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                    {spine.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {spine.value}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{spine.foot}</p>
                </>
              )}
            </div>
            
            {/* Decorative dot */}
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[var(--rr-gold-bright)] shadow-[0_0_8px_var(--rr-gold-bright)]" />
          </div>
        );
      })}
    </div>
  );
}
