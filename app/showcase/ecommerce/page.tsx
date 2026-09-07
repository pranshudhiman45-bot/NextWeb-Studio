import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageTransition } from "@/components/animations/page-transition";

const ecommerceUrl = "https://buy-best-grocery-mern-e-commerce-ap.vercel.app/";

export const metadata: Metadata = {
  title: "Buy Best E-commerce Showcase",
  description:
    "Explore the live Buy Best grocery e-commerce application inside NextWeb Studio.",
};

export default function EcommerceShowcasePage() {
  return (
    <PageTransition>
      <main className="container-shell pt-32 pb-16 sm:pt-36">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-white/55 uppercase transition hover:text-[var(--accent)]"
          >
            <ArrowLeft size={14} /> Back to NextWeb Studio
          </Link>
          <Link
            href={ecommerceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-[var(--accent)]"
          >
            Open full live site <ExternalLink size={15} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_28px_90px_rgba(0,8,24,0.48)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-sm font-bold">Buy Best</p>
              <p className="mt-1 text-xs text-white/40">
                Interactive production preview
              </p>
            </div>
            <span className="rounded-full border border-[var(--border)] bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
              Showcase Application
            </span>
          </div>
          <iframe
            src={ecommerceUrl}
            title="Buy Best live e-commerce application"
            className="h-[78svh] min-h-[620px] w-full bg-[#f7f4ee]"
            loading="eager"
            allow="geolocation; payment"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </main>
    </PageTransition>
  );
}
