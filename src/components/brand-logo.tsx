import type { ReactNode } from "react";

/**
 * ADZVO brand logo: gold tile with the arrow "A", plus the wide-set wordmark.
 * The wordmark inherits the surrounding text colour, so the same component
 * works on light and dark backgrounds. The tile never changes colour.
 */

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <rect width="64" height="64" rx="16" fill="#F5A524" />
      <path d="M18 46 L32 17 L46 46" stroke="#0C1020" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="43" r="4.8" fill="#FFFFFF" />
    </svg>
  );
}

export function BrandLogo({ className = "", markClassName, textClassName = "text-xl" }: { className?: string; markClassName?: string; textClassName?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandMark {...(markClassName ? { className: markClassName } : {})} />
      <span
        className={`font-bold leading-none ${textClassName}`}
        style={{ fontFamily: "'Space Grotesk', Inter, system-ui, sans-serif", letterSpacing: "0.22em" }}
      >
        ADZVO
      </span>
    </span>
  );
}

/** The logo typeface, for numbers and small labels. */
export const LOGO_FONT = { fontFamily: "'Space Grotesk', Inter, system-ui, sans-serif" };

/** The one section label used across the site: logo tile + wide-set caps. */
export function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] ${light ? "text-primary-foreground" : "text-navy"}`} style={LOGO_FONT}>
      <BrandMark className="size-6" />{children}
    </span>
  );
}

/** The one heading emphasis: upright text with a gold stroke. On dark backgrounds the stroke sits under the text so white letters stay readable. */
export function Highlight({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className="relative inline-block">
      <span aria-hidden className={`absolute inset-x-0 rounded-full ${dark ? "-bottom-1 h-1.5 bg-gold" : "bottom-1.5 h-3 bg-gold/70 sm:h-3.5"}`} />
      <span className="relative">{children}</span>
    </span>
  );
}
