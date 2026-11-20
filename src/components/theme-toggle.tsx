import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/** Sun/moon switch for the top bar. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${dark ? "is-dark" : ""} ${className}`}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      <span className="theme-toggle-icon theme-toggle-sun"><Sun /></span>
      <span className="theme-toggle-icon theme-toggle-moon"><Moon /></span>
    </button>
  );
}
