"use client";

import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Package, Star, BookMarked, Loader2 } from "lucide-react";
import StatsShelf from "@/components/dashboard/user/StatsShelf";
import DeliveryHistoryTable from "@/components/dashboard/user/DeliveryHistoryTable";
import ReadingListGallery from "@/components/dashboard/user/ReadingListGallery";
import MyReviews from "@/components/dashboard/user/MyReviews";
import { useSession } from "@/lib/auth-client";
import { useDeliveries } from "@/lib/delivery-context";
import { useReviews } from "@/lib/review-context";

// Lazy load heavy recharts component — only loaded when overview tab is active
const OverviewCharts = lazy(() => import("@/components/dashboard/user/OverviewCharts"));

type SectionKey = "overview" | "deliveries" | "reading-list" | "reviews";

const SECTION_ICONS: Record<SectionKey, typeof BookOpen> = {
  overview: BookOpen,
  deliveries: Package,
  "reading-list": BookMarked,
  reviews: Star,
};

function ChartFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin text-[var(--rr-gold)]" />
    </div>
  );
}

function SectionHeading({ title, count, icon: Icon }: { title: string; count: string; icon: typeof BookOpen }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--rr-gold)]/10">
          <Icon size={20} className="text-[var(--rr-gold)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--rr-ink)]">{title}</h2>
          {count && (
            <p className="mt-0.5 text-xs text-[var(--rr-ink-dim)]">{count}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const { data: session } = useSession();
  const { deliveries, fetchDeliveries } = useDeliveries();
  const { reviews, fetchUserReviews } = useReviews();

  useEffect(() => {
    if (session?.user?.id) {
      fetchDeliveries(session.user.id);
      fetchUserReviews(session.user.id);
    }
  }, [session?.user?.id, fetchDeliveries, fetchUserReviews]);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "") as SectionKey;
      if (hash && ["overview", "deliveries", "reading-list", "reviews"].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("overview");
      }
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  const deliveredCount = useMemo(
    () => deliveries.filter((d) => d.status === "Delivered").length,
    [deliveries]
  );

  return (
    <main className="py-6">
      {activeSection === "overview" && (
        <>
          {/* Welcome Section */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-[var(--rr-surface)] to-[var(--rr-surface-2)] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rr-gold)]">
              Welcome back, Reader
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--rr-ink)]">
              Your Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-[var(--rr-ink-dim)]">
              Here&apos;s what&apos;s on your shelf this month. Track your deliveries, reading progress, and reviews.
            </p>
          </div>

          <StatsShelf />

          <SectionHeading
            title="Analytics"
            count={`${deliveries.length} total deliveries`}
            icon={BookOpen}
          />
          <Suspense fallback={<ChartFallback />}>
            <OverviewCharts />
          </Suspense>
        </>
      )}

      {activeSection === "deliveries" && (
        <>
          <SectionHeading
            title="Delivery History"
            count={`${deliveries.length} requests`}
            icon={Package}
          />
          <DeliveryHistoryTable />
        </>
      )}

      {activeSection === "reading-list" && (
        <>
          <SectionHeading
            title="My Reading List"
            count={`${deliveredCount} completed`}
            icon={BookMarked}
          />
          <ReadingListGallery />
        </>
      )}

      {activeSection === "reviews" && (
        <>
          <SectionHeading
            title="My Reviews"
            count={`${reviews.length} reviews`}
            icon={Star}
          />
          <MyReviews />
        </>
      )}
    </main>
  );
}
