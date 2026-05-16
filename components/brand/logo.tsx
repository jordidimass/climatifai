import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** When true, omits the wordmark and renders only the orbit glyph. */
  iconOnly?: boolean;
}

/**
 * Climatifai wordmark. The glyph is a small orbiting dot suggesting a
 * planet + atmosphere — quiet, never shouted. Renders the display serif
 * for the wordmark to anchor the brand voice.
 */
export function Logo({ href = "/", className, iconOnly = false }: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 leading-none",
        "text-foreground",
        className,
      )}
    >
      <OrbitGlyph />
      {!iconOnly && (
        <span
          className="font-[family-name:var(--font-display)] text-[1.35rem] tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          Climatifai
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      aria-label="Climatifai — inicio"
      className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {content}
    </Link>
  );
}

function OrbitGlyph() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <radialGradient id="cl-orb" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      {/* orbit ring */}
      <ellipse
        cx="13"
        cy="13"
        rx="11.2"
        ry="5"
        stroke="var(--foreground)"
        strokeOpacity="0.35"
        strokeWidth="1"
        transform="rotate(-22 13 13)"
        fill="none"
      />
      {/* planet */}
      <circle cx="13" cy="13" r="5.2" fill="url(#cl-orb)" />
      {/* satellite */}
      <circle
        cx="22.4"
        cy="9.2"
        r="1.4"
        fill="var(--accent-foreground)"
      />
    </svg>
  );
}
