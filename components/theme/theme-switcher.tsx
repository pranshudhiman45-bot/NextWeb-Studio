"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useResolvedTheme } from "./theme-store";
import styles from "./theme-switcher.module.css";

export function ThemeSwitcher() {
  const isDark = useResolvedTheme() === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-label="Dark mode"
      aria-checked={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`theme-switcher ${styles.toggle}`}
    >
      <span className={styles.thumb} aria-hidden="true" />
      <Sun size={17} className={styles.sun} aria-hidden="true" />
      <Moon size={17} className={styles.moon} aria-hidden="true" />
    </button>
  );
}
