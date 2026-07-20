"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextValue {
  theme: string;
  resolvedTheme: string;
  setTheme: (value: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
});

function applyTheme(resolved: string) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

function getSystemTheme(): string {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: string): string {
  return theme === "system" ? getSystemTheme() : theme === "dark" ? "dark" : "light";
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState("light");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    const resolved = resolveTheme(storedTheme);
    setThemeState(storedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // Listen for system theme changes when in system mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        applyTheme(newResolved);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (value: string) => {
    const resolved = resolveTheme(value);
    setThemeState(value);
    setResolvedTheme(resolved);
    localStorage.setItem("theme", value);
    applyTheme(resolved);
  };

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
