"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { phoneMaxLength } from "@/lib/phone";
import {
  budgets,
  contactSchema,
  projectTypes,
  type ContactFormValues,
  type ProjectType,
} from "@/lib/validations";

const inputStyles =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-background)] px-4 text-sm text-[var(--foreground)] transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(8,124,255,0.1)] focus:outline-none";

export function ContactForm({
  initialProjectType,
  source = "contact-page",
}: {
  initialProjectType?: ProjectType;
  source?: string;
}) {
  const formId = useId();
  const [serverMessage, setServerMessage] = useState("");
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { projectType: initialProjectType, source, website: "" },
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
        errors?: Partial<Record<keyof ContactFormValues, string[]>>;
      };
      setServerMessage(result.message);
      for (const field of [
        "name",
        "email",
        "phone",
        "company",
        "projectType",
        "budget",
        "timeline",
        "message",
      ] as const) {
        const message = result.errors?.[field]?.[0];
        if (message) setError(field, { type: "server", message });
      }
      if (response.ok && result.success) {
        setSent(true);
        reset();
      }
    } catch {
      setServerMessage("Unable to send right now. Please try again shortly.");
    }
  }

  const accessibility = (field: keyof ContactFormValues) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${formId}-${field}-error` : undefined,
  });

  const error = (field: keyof ContactFormValues, message?: string) =>
    message ? (
      <p
        id={`${formId}-${field}-error`}
        className="mt-2 text-xs text-[var(--danger)]"
      >
        {message}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="card-surface rounded-3xl p-5 sm:p-8"
    >
      <input type="hidden" defaultValue={source} {...register("source")} />
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label>
          Leave this field empty
          <input {...register("website")} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input
            {...register("name")}
            {...accessibility("name")}
            maxLength={80}
            autoComplete="name"
            placeholder="Your full name"
            className={inputStyles}
          />
          {error("name", errors.name?.message)}
        </label>
        <label className="text-sm font-semibold">
          Email
          <input
            {...register("email")}
            {...accessibility("email")}
            maxLength={254}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={inputStyles}
          />
          {error("email", errors.email?.message)}
        </label>
        <label className="text-sm font-semibold">
          Contact Number
          <input
            {...register("phone")}
            {...accessibility("phone")}
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={phoneMaxLength}
            placeholder="+91 98765 43210"
            className={inputStyles}
          />
          {error("phone", errors.phone?.message)}
        </label>
        <label className="text-sm font-semibold">
          Company / Organization{" "}
          <span className="font-normal text-[var(--foreground-muted)]">
            (optional)
          </span>
          <input
            {...register("company")}
            {...accessibility("company")}
            maxLength={120}
            autoComplete="organization"
            placeholder="Company or organization"
            className={inputStyles}
          />
          {error("company", errors.company?.message)}
        </label>
        <label className="text-sm font-semibold">
          Project type
          <select
            {...register("projectType")}
            {...accessibility("projectType")}
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
          {error("projectType", errors.projectType?.message)}
        </label>
        <label className="text-sm font-semibold">
          Estimated budget
          <select
            {...register("budget")}
            {...accessibility("budget")}
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
          {error("budget", errors.budget?.message)}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Ideal timeline
          <input
            {...register("timeline")}
            {...accessibility("timeline")}
            maxLength={80}
            placeholder="e.g. Launch in 8–10 weeks"
            className={inputStyles}
          />
          {error("timeline", errors.timeline?.message)}
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Tell me about the project
          <textarea
            {...register("message")}
            {...accessibility("message")}
            maxLength={3000}
            rows={6}
            placeholder="What are you building, who is it for, and what would success look like?"
            className={`${inputStyles} resize-y py-4`}
          />
          {error("message", errors.message?.message)}
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-200/15 bg-[var(--button-primary)] px-6 text-sm font-bold text-[var(--accent-ink)] shadow-[0_8px_24px_rgba(0,126,255,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[var(--button-hover)] hover:shadow-[0_10px_32px_rgba(0,158,255,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={17} className="animate-spin" /> Sending...
            </>
          ) : (
            "Send project inquiry"
          )}
        </button>
        <p className="text-xs text-[var(--foreground-muted)]">
          Your project brief is for Pranshu Dhiman at NextWeb Studio.
        </p>
      </div>
      {serverMessage ? (
        <div
          role="status"
          className={`mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm ${sent ? "border-[var(--accent)]/25 bg-[var(--accent)]/5 text-[var(--accent)]" : "border-[var(--danger)]/25 bg-[var(--danger)]/5 text-[var(--danger)]"}`}
        >
          {sent ? <CheckCircle2 size={18} /> : null}
          {serverMessage}
        </div>
      ) : null}
    </form>
  );
}
