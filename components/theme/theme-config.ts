export const themeStorageKey = "nextweb-studio-theme";
export type ThemePreference = "system" | "light" | "dark";
export const themeColors = { light: "#f5f9ff", dark: "#020b18" };

// Runs in the document head before the page paints, independently of hydration.
export const themeScript = `(() => {
  const root = document.documentElement;
  let preference = 'system';
  try {
    const stored = localStorage.getItem('${themeStorageKey}');
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch {}
  const theme = preference === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference;
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = theme === 'dark' ? '${themeColors.dark}' : '${themeColors.light}';
    meta.removeAttribute('media');
  });
})();`;
