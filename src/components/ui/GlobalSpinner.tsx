import { Loader2 } from "lucide-react";

export default function GlobalSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-[var(--rr-surface-2)]" />
        <Loader2
          size={48}
          className="absolute inset-0 animate-spin text-[var(--rr-gold)]"
        />
      </div>
      <p className="text-sm text-[var(--rr-ink-dim)]">{message}</p>
    </div>
  );
}
