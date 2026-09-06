import type { Metadata } from "next";
import {
  BarChart3,
  FolderKanban,
  Inbox,
  LockKeyhole,
  Settings,
} from "lucide-react";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Studio Dashboard",
  robots: { index: false, follow: false },
};

const navItems = [
  ["Overview", BarChart3],
  ["Projects", FolderKanban],
  ["Inquiries", Inbox],
  ["Settings", Settings],
] as const;

export default function AdminPage() {
  const featuredProjects = projects.filter(
    (project) => project.featured,
  ).length;

  return (
    <main className="min-h-screen bg-[var(--background)] pt-28 pb-16">
      <div className="container-shell">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100">
          <LockKeyhole size={18} className="shrink-0 text-amber-300" />
          <p>
            <strong>Development preview only.</strong> Protect this route with
            production authentication and role-based authorization before
            connecting CRUD actions.
          </p>
        </div>
        <div className="grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] lg:min-h-[680px] lg:grid-cols-[230px_1fr]">
          <aside className="border-b border-[var(--border)] p-6 lg:border-r lg:border-b-0">
            <p className="text-lg font-extrabold tracking-tight">
              NextWeb Studio Admin
            </p>
            <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
              {navItems.map(([label, Icon], index) => (
                <span
                  key={label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${index === 0 ? "bg-white/5 text-white" : "text-white/45"}`}
                >
                  <Icon size={17} />
                  {label}
                </span>
              ))}
            </nav>
          </aside>
          <section className="p-5 sm:p-8">
            <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-7">
              <p className="text-xs tracking-[0.15em] text-[var(--accent)] uppercase">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
              <p className="text-sm text-[var(--muted)]">
                A future home for content and inquiry management.
              </p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total projects", String(projects.length)],
                ["Featured projects", String(featuredProjects)],
                ["New inquiries", "—"],
                ["Total inquiries", "—"],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5"
                >
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="mt-5 text-3xl font-bold">{value}</p>
                </article>
              ))}
            </div>
            <div className="mt-7 grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/45 p-6">
                <h2 className="font-bold">Recent projects</h2>
                <div className="mt-5 grid gap-3">
                  {projects
                    .filter((project) => project.featured)
                    .slice(0, 3)
                    .map((project) => (
                      <div
                        key={project.slug}
                        className="flex items-center justify-between rounded-xl bg-white/[0.025] p-4 text-sm"
                      >
                        <span>{project.title}</span>
                        <span className="rounded-full bg-[var(--accent)]/10 px-2 py-1 text-[10px] text-[var(--accent)]">
                          Featured
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/45 p-6">
                <h2 className="font-bold">Contact inquiries</h2>
                <div className="mt-5 grid min-h-48 place-items-center rounded-xl border border-dashed border-[var(--border)] text-center text-sm text-white/35">
                  Connect MongoDB and secure admin access
                  <br />
                  to display real inquiries.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
