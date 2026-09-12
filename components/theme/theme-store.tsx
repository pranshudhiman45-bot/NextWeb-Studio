"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  themeColors,
  themeStorageKey,
  type ThemePreference,
} from "./theme-config";

const changeEvent = "nextweb-theme-change";

function validPreference(value: string | null | undefined): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

function getSnapshot(): ThemePreference {
  return validPreference(document.documentElement.dataset.themePreference);
}

function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  return () => window.removeEventListener(changeEvent, listener);
}

function applyTheme(preference: ThemePreference) {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = themeColors[resolved];
      meta.removeAttribute("media");
    });
  window.dispatchEvent(new Event(changeEvent));
}

export function setTheme(preference: ThemePreference) {
  try {
    localStorage.setItem(themeStorageKey, preference);
  } catch {
    // Storage may be disabled; the selection still works for this visit.
  }
  applyTheme(preference);
}

export function useThemePreference() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "system" as const);
}

export function useResolvedTheme() {
  return useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    () => "dark" as const,
  );
}

export function ThemeSync() {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (getSnapshot() === "system") applyTheme("system");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === themeStorageKey || event.key === null) {
        applyTheme(validPreference(event.newValue));
      }
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    // Enable short color transitions only after the initial theme is applied.
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.themeReady = "true";
    });
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    // Next may reconcile viewport metadata when navigating between routes.
    applyTheme(getSnapshot());
  }, [pathname]);
  return null;
}
