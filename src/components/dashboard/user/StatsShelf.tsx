import { quickStats } from "@/lib/dashboard-data";

const spines = [
  {
    label: "Books Read",
    value: quickStats.totalBooksRead.toString(),
    foot: "since Jan 2026",
    gradient: "from-[#4d6a48] to-[#33472f]",
  },
  {
    label: "Pending Deliveries",
    value: quickStats.pendingDeliveries.toString(),
    foot: "on the way",
    gradient: "from-[#8a4a3f] to-[#602f28]",
  },
  {
    label: "Spent on Fees",
    value: `$${quickStats.totalSpentOnFees}`,
    foot: "lifetime total",
    gradient: "from-[#b3903f] to-[#7c5e26]",
  },
];

export default function StatsShelf() {
  return (
    <div className="relative mb-10 flex flex-col items-stretch gap-3.5 border-b-[3px] border-[#3c2e1c] px-1.5 pb-[18px] sm:flex-row sm:items-end">
      {spines.map((spine) => (
        <div
          key={spine.label}
          className={`relative flex h-[120px] flex-row items-center justify-between gap-3 rounded-[4px_4px_2px_2px] bg-gradient-to-br px-4 py-4 shadow-[inset_3px_0_0_rgba(0,0,0,0.18),0_10px_18px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1.5 sm:h-[172px] sm:min-w-[150px] sm:flex-1 sm:flex-col sm:items-stretch sm:justify-between ${spine.gradient}`}
        >
          <span className="absolute right-3 top-3 h-[7px] w-[7px] rounded-full bg-[var(--rr-gold-bright)] shadow-[0_0_8px_var(--rr-gold-bright)]" />
          <div className="font-mono-label self-start text-[10.5px] uppercase text-white/80 sm:[writing-mode:vertical-rl] sm:rotate-180">
            {spine.label}
          </div>
          <div>
            <div className="font-display text-3xl leading-none text-[#fbf6e8] sm:text-[38px]">
              {spine.value}
            </div>
            <div className="text-[11px] text-white/70">{spine.foot}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
