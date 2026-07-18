"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
});

function applyTheme(theme) {
  const resolvedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export default function Providers({ children }) {
  const [theme, setThemeState] = useState("light");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : systemPrefersDark
        ? "dark"
        : "light";

    setThemeState(initialTheme);
    setResolvedTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const setTheme = (value) => {
    const nextTheme = value === "dark" ? "dark" : "light";
    setThemeState(nextTheme);
    setResolvedTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}