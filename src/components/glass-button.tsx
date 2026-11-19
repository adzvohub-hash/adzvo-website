/**
 * GlassButton — the one button style for the whole site, matching the home
 * hero buttons (LiquidGlass). Labels are written in Title Case and never
 * forced to capitals.
 *
 *   variant="primary"   gold glass, navy text            → main actions, any background
 *   variant="secondary" clear glass, white text  (on="dark")  → over video / photos / navy
 *                       white glass, navy text   (on="light") → over light sections
 *   variant="dark"      solid navy glass, white text      → on gold / bright backgrounds
 *   size="md" | "sm"
 *
 * Use `as` to render a router Link, <a> or <button>:
 *   <GlassButton as={Link} to="/" hash="contact">Let's Talk <ArrowRight /></GlassButton>
 *   <GlassButton as="a" href="…" target="_blank">Visit Studio</GlassButton>
 *   <GlassButton as="button" type="submit">Send Enquiry</GlassButton>
 */
import type { ElementType, ReactNode } from "react";
import { LiquidGlass } from "@/components/liquid-glass";

type Props = {
  as?: ElementType;
  variant?: "primary" | "secondary" | "dark";
  on?: "dark" | "light";
  size?: "md" | "sm";
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
};

export function GlassButton({ as = "a", variant = "primary", on = "light", size = "md", className = "", children, ...rest }: Props) {
  const tint = variant === "primary" ? "gold" : variant === "dark" ? "dark" : on === "dark" ? "clear" : "light";
  return (
    <LiquidGlass
      as={as}
      tint={tint}
      radius={size === "sm" ? 12 : 16}
      interactive
      refraction={variant === "primary" ? 22 : 30}
      className={`adz-btn adz-btn-${size} adz-btn-${variant} ${className}`}
      contentClassName="adz-btn-label"
      {...rest}
    >
      {children}
    </LiquidGlass>
  );
}
