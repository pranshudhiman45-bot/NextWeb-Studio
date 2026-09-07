import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  href?: string;
}

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="size-10 shrink-0"
      fill="none"
    >
      <defs>
        <linearGradient id="nextweb-ring" x1="7" y1="8" x2="57" y2="56">
          <stop stopColor="#10D9F5" />
          <stop offset="0.55" stopColor="#009EFF" />
          <stop offset="1" stopColor="#0755E8" />
        </linearGradient>
        <linearGradient id="nextweb-blue" x1="28" y1="18" x2="51" y2="46">
          <stop stopColor="#10D9F5" />
          <stop offset="0.55" stopColor="#087CFF" />
          <stop offset="1" stopColor="#0755E8" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="#031426"
        stroke="url(#nextweb-ring)"
        strokeWidth="2"
      />
      <path d="M13 43 23.5 18h6L40 43h-7l-6.5-16.5L20 43h-7Z" fill="#F8FBFF" />
      <path
        d="m27 23 8 20 6.2-13.5L46 43l7-23h-6.8l-5.4 14.5-5.5-11.5H27Z"
        fill="url(#nextweb-blue)"
      />
      <path
        d="M8.5 36.5C14 48 36.5 49 52 29"
        stroke="url(#nextweb-ring)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="49" y="13" width="4" height="4" rx="0.8" fill="#10D9F5" />
      <rect
        x="54.5"
        y="18.5"
        width="2.8"
        height="2.8"
        rx="0.6"
        fill="#009EFF"
      />
    </svg>
  );
}

export function BrandLogo({
  className,
  compact = false,
  href = "/",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="NextWeb Studio home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <BrandMark />
      {compact ? null : (
        <span className="leading-none">
          <span className="block text-base font-extrabold tracking-[-0.045em] text-white sm:text-lg">
            Next
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)] bg-clip-text text-transparent">
              Web
            </span>
          </span>
          <span className="mt-1 block text-[8px] font-semibold tracking-[0.36em] text-[var(--foreground-secondary)] uppercase">
            Studio
          </span>
        </span>
      )}
    </Link>
  );
}
