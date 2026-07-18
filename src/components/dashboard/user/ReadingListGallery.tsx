import { readingList } from "@/lib/dashboard-data";

export default function ReadingListGallery() {
  return (
    <div className="grid grid-cols-2 gap-4.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {readingList.map((book) => (
        <div key={book.id} className="group">
          <div className="relative flex h-[172px] flex-col justify-between rounded-[3px_6px_6px_3px] bg-[var(--rr-paper)] p-3.5 text-[#2a2116] shadow-[inset_-4px_0_0_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.3)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:-rotate-[0.4deg]">
            <div className="font-mono-label text-[9px] uppercase opacity-55">{book.genre}</div>
            <div>
              <div className="font-display text-[15px] leading-[1.22] font-medium">
                {book.title}
              </div>
              <div className="text-[11px] opacity-65">{book.author}</div>
            </div>
          </div>
          {book.returned && (
            <div className="font-mono-label mt-2 text-center text-[10px] text-[var(--rr-ink-dim)]">
              Returned
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
