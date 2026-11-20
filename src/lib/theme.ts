/**
 * Light / dark theme. The site opens in light; the visitor's choice from the
 * toggle is saved in localStorage ("adzvo-theme"). index.html applies it before
 * first paint; this hook keeps React in sync and toggles it.
 */
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "adzvo-theme";

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  const r = document.documentElement;
  r.classList.add("theme-switching");
  r.classList.toggle("dark", t === "dark");
  r.style.colorScheme = t;
  try { localStorage.setItem(KEY, t); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent("adzvo-theme", { detail: t }));
  // allow colour transitions only during the switch, not on every hover
  window.setTimeout(() => r.classList.remove("theme-switching"), 450);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener("adzvo-theme", sync);
    return () => window.removeEventListener("adzvo-theme", sync);
  }, []);
  const toggle = useCallback(() => applyTheme(currentTheme() === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}
