"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  budgets,
  contactSchema,
  projectTypes,
  type ContactFormValues,
  type ProjectType,
} from "@/lib/validations";

const inputStyles =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--border)] bg-white/[0.035] px-4 text-sm text-white transition placeholder:text-white/25 focus:border-[var(--accent)] focus:outline-none";

export function ContactForm({
  initialProjectType,
  source = "contact-page",
}: {
  initialProjectType?: ProjectType;
  source?: string;
}) {
  const [serverMessage, setServerMessage] = useState("");
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { projectType: initialProjectType, source },
  });

  async function onSubmit(values: ContactFormValues) {
    setServerMessage("");
    setSent(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        success: boolean;
        message: string;
      };
      setServerMessage(result.message);
      if (response.ok) {
        setSent(true);
        reset();
      }
    } catch {
      setServerMessage("Unable to send right now. Please try again shortly.");
    }
  }

  const error = (message?: string) =>
    message ? <p className="mt-2 text-xs text-red-300">{message}</p> : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="card-surface rounded-3xl p-5 sm:p-8"
    >
      <input type="hidden" defaultValue={source} {...register("source")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input
            {...register("name")}
            autoComplete="name"
            placeholder="Your full name"
            className={inputStyles}
          />
          {error(errors.name?.message)}
        </label>
        <label className="text-sm font-semibold">
          Email
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={inputStyles}
          />
          {error(errors.email?.message)}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Company <span className="font-normal text-white/35">(optional)</span>
          <input
            {...register("company")}
            autoComplete="organization"
            placeholder="Company or organization"
            className={inputStyles}
          />
          {error(errors.company?.message)}
        </label>
        <label className="text-sm font-semibold">
          Project type
          <select
            {...register("projectType")}
            defaultValue={initialProjectType ?? ""}
            className={inputStyles}
          >
            <option value="" disabled>
              Select one
            </option>
            {projectTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {error(errors.projectType?.message)}
        </label>
        <label className="text-sm font-semibold">
          Estimated budget
          <select
            {...register("budget")}
            defaultValue=""
            className={inputStyles}
          >
            <option value="" disabled>
              Select a range
            </option>
            {budgets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {error(errors.budget?.message)}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Ideal timeline
          <input
            {...register("timeline")}
            placeholder="e.g. Launch in 8–10 weeks"
            className={inputStyles}
          />
          {error(errors.timeline?.message)}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Tell me about the project
          <textarea
            {...register("message")}
            rows={6}
            placeholder="What are you building, who is it for, and what would success look like?"
            className={`${inputStyles} resize-y py-4`}
          />
          {error(errors.message?.message)}
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[0_8px_30px_rgba(200,255,61,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={17} className="animate-spin" /> Sending...
            </>
          ) : (
            "Send project inquiry"
          )}
        </button>
        <p className="text-xs text-white/35">
          Your inquiry goes directly to Vinay Kumar.
        </p>
      </div>
      {serverMessage ? (
        <div
          role="status"
          className={`mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm ${sent ? "border-[var(--accent)]/25 bg-[var(--accent)]/5 text-[var(--accent)]" : "border-red-300/20 bg-red-300/5 text-red-200"}`}
        >
          {sent ? <CheckCircle2 size={18} /> : null}
          {serverMessage}
        </div>
      ) : null}
    </form>
  );
}
