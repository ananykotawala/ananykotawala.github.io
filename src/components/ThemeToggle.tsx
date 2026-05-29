"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className="theme-toggle"
    >
      <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>
        {theme === null ? "" : theme === "dark" ? "☀" : "☾"}
      </span>
      <span>{theme === null ? "" : theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
