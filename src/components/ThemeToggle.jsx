"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppTheme } from "@/app/providers";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useAppTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="h-10 w-10 rounded-full border border-[var(--rr-hairline)] flex items-center justify-center text-[var(--rr-ink)] hover:bg-[var(--rr-surface)] transition-colors"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
