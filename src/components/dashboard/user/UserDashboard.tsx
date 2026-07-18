import StatsShelf from "@/components/dashboard/StatsShelf";
import OverviewCharts from "@/components/dashboard/OverviewCharts";
import DeliveryHistoryTable from "@/components/dashboard/DeliveryHistoryTable";
import ReadingListGallery from "@/components/dashboard/ReadingListGallery";
import MyReviews from "@/components/dashboard/MyReviews";
import { deliveries, readingList, reviews } from "@/lib/dashboard-data";

function SectionHeading({ title, count }: { title: string; count: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-display text-[19px] font-medium">{title}</h2>
      <span className="font-mono-label text-[11px] text-[var(--rr-ink-dim)]">{count}</span>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <div className="font-mono-label text-[11px] uppercase text-[var(--rr-gold)]">
        Dashboard · /dashboard/user
      </div>
      <h1 className="font-display mt-1.5 text-[28px] font-medium tracking-tight sm:text-[34px]">
        Welcome back, Reader
      </h1>
      <p className="mb-8 text-sm text-[var(--rr-ink-dim)]">
        Here&apos;s what&apos;s on your shelf this month.
      </p>

      <StatsShelf />

      <div className="mb-11">
        <SectionHeading title="Overview" count="" />
        <OverviewCharts />
      </div>

      <div className="mb-11">
        <SectionHeading title="Delivery History" count={`${deliveries.length} requests`} />
        <DeliveryHistoryTable />
      </div>

      <div className="mb-11">
        <SectionHeading
          title="My Reading List"
          count={`${readingList.filter((b) => b.returned).length} completed`}
        />
        <ReadingListGallery />
      </div>

      <div>
        <SectionHeading title="My Reviews" count={`${reviews.length} reviews`} />
        <MyReviews />
      </div>
    </div>
  );
}
