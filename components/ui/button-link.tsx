import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import motionStyles from "@/components/animations/studio-motion.module.css";
import { cn } from "@/lib/utils";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  external?: boolean;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonLinkProps) {
  const styles = {
    primary:
      "bg-[var(--button-primary)] text-[var(--accent-ink)] hover:bg-[var(--button-hover)] hover:shadow-[0_10px_32px_rgba(0,158,255,0.24)] motion-safe:hover:-translate-y-0.5 border-blue-200/15 shadow-[0_8px_24px_rgba(0,126,255,0.16)]",
    secondary:
      "border-[var(--border)] bg-[var(--surface)]/65 text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-elevated)]/75 hover:text-[var(--cyan)]",
    text: "border-transparent text-[var(--foreground)] hover:text-[var(--accent)] px-0",
  };

  const props = external ? { target: "_blank", rel: "noreferrer" } : undefined;

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition-all duration-300",
        styles[variant],
        variant === "primary" && motionStyles.sweep,
        className,
      )}
      {...props}
    >
      {children}
      <ArrowUpRight
        size={16}
        className="group-motion-safe:hover:-translate-y-0.5 transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
