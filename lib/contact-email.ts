import { z } from "zod";
import type { ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/lib/utils";
import { normalizePhone, phoneSchema } from "@/lib/phone";
import {
  contactDevelopmentLog,
  safeResendError,
} from "@/lib/contact-diagnostics";

export type EmailStatus = "accepted" | "failed" | "skipped";
type EmailResult = {
  status: EmailStatus;
  attempted: boolean;
  accepted: boolean;
  emailId: string | null;
  httpStatus?: number;
};
const skippedEmail: EmailResult = {
  status: "skipped",
  attempted: false,
  accepted: false,
  emailId: null,
};
export type StoredInquiry = Omit<ContactFormValues, "website"> & {
  id: string;
  submittedAt: Date;
};

const emailAddress = z.string().email().max(254);

export function escapeEmailHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

function emailLayout(title: string, content: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:32px 16px;background:#f3f6fb;color:#152238;font-family:Arial,Helvetica,sans-serif"><table role="presentation" style="width:100%;max-width:600px;margin:auto;border-collapse:collapse;background:#ffffff;border-top:4px solid #087cff"><tr><td style="padding:32px"><p style="margin:0 0 12px;color:#087cff;font-size:13px;font-weight:bold;letter-spacing:1px">NextWeb Studio</p><h1 style="margin:0 0 24px;font-size:26px">${title}</h1>${content}</td></tr></table></body></html>`;
}

export function buildOwnerEmail(inquiry: StoredInquiry) {
  const fields = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Contact Number", inquiry.phone],
    ["Company", inquiry.company || "Not provided"],
    ["Project Type", inquiry.projectType],
    ["Budget", inquiry.budget],
    ["Timeline", inquiry.timeline],
    ["Message", inquiry.message],
    ["Submitted", inquiry.submittedAt.toISOString()],
    ["Source", inquiry.source || "contact-page"],
    ["Inquiry ID", inquiry.id],
  ];
  const phone = phoneSchema.safeParse(inquiry.phone);
  const rows = fields
    .map(([label, value]) => {
      const escaped = escapeEmailHtml(value);
      const content =
        label === "Contact Number" && phone.success
          ? `<a style="color:#087cff" href="tel:${normalizePhone(phone.data)}">${escaped}</a>`
          : escaped;
      return `<tr><td style="padding:12px 0;border-bottom:1px solid #e4eaf2;overflow-wrap:anywhere"><strong style="font-size:12px;color:#52627a">${label}</strong><div style="margin-top:6px;line-height:1.6;white-space:pre-wrap">${content}</div></td></tr>`;
    })
    .join("");
  return {
    // Strip control characters so user text cannot inject email headers.
    subject: `New NextWeb Studio Project Inquiry — ${inquiry.name.replace(/[\r\n\u0000-\u001f\u007f]/g, " ")}`,
    html: emailLayout(
      "New Project Inquiry",
      `<table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table><p style="margin-top:24px"><a style="color:#087cff;font-weight:bold" href="mailto:${escapeEmailHtml(inquiry.email)}">Reply to client</a></p>`,
    ),
    text: `NextWeb Studio\nNew Project Inquiry\n\n${fields.map(([label, value]) => `${label}:\n${value}`).join("\n\n")}`,
  };
}

function buildConfirmationEmail(inquiry: StoredInquiry) {
  const text = `Hi ${inquiry.name},\n\nThanks for reaching out to NextWeb Studio.\n\nI’ve received your project inquiry and will review the details shortly.\n\nProject type:\n${inquiry.projectType}\n\nI’ll get back to you as soon as possible.\n\n— ${siteConfig.founder}\nNextWeb Studio`;
  return {
    subject: "We received your project inquiry — NextWeb Studio",
    text,
    html: emailLayout(
      "We received your inquiry",
      `<div style="white-space:pre-wrap;line-height:1.7">${escapeEmailHtml(text)}</div>`,
    ),
  };
}

type EmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
};

async function sendEmail(
  payload: EmailPayload,
  apiKey: string,
  inquiryId: string,
  kind: "owner" | "confirmation",
): Promise<EmailResult> {
  const failed: EmailResult = {
    status: "failed",
    attempted: true,
    accepted: false,
    emailId: null,
  };
  if (kind === "owner") contactDevelopmentLog("notification attempted", true);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact/${inquiryId}/${kind}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      const error: unknown = await response.json().catch(() => null);
      console.error("contact_email_failed", {
        inquiryId,
        kind,
        reason: "provider_rejected",
        status: response.status,
        error: safeResendError(error, response.status),
      });
      return { ...failed, httpStatus: response.status };
    }
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("id" in result) ||
      typeof result.id !== "string" ||
      !/^[a-zA-Z0-9-]{1,100}$/.test(result.id) ||
      result.id === apiKey
    ) {
      console.error("contact_email_failed", {
        inquiryId,
        kind,
        reason: "invalid_provider_response",
      });
      return { ...failed, httpStatus: response.status };
    }
    // Accepted by Resend does not guarantee inbox delivery.
    return {
      status: "accepted",
      attempted: true,
      accepted: true,
      emailId: result.id,
      httpStatus: response.status,
    };
  } catch {
    console.error("contact_email_failed", {
      inquiryId,
      kind,
      reason: "network_or_timeout",
    });
    return failed;
  }
}

export async function sendContactEmails(inquiry: StoredInquiry) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = emailAddress.safeParse(process.env.CONTACT_EMAIL?.trim());
  const sender = emailAddress.safeParse(process.env.CONTACT_FROM_EMAIL?.trim());
  const testSender =
    sender.success && sender.data.toLowerCase().endsWith("@resend.dev");
  const configurationIssues = [
    ...(!apiKey ? ["RESEND_API_KEY missing"] : []),
    ...(!recipient.success ? ["CONTACT_EMAIL missing or invalid"] : []),
    ...(!sender.success ? ["CONTACT_FROM_EMAIL missing or invalid"] : []),
    ...(testSender && process.env.NODE_ENV === "production"
      ? ["CONTACT_FROM_EMAIL requires a verified custom domain in production"]
      : []),
  ];
  contactDevelopmentLog(
    "recipient",
    recipient.success ? recipient.data : "not configured",
  );
  contactDevelopmentLog(
    "from",
    sender.success ? `NextWeb Studio <${sender.data}>` : "not configured",
  );
  contactDevelopmentLog(
    "reply-to is validated visitor email",
    emailAddress.safeParse(inquiry.email).success,
  );
  function outcome(owner: EmailResult, confirmation: EmailResult) {
    if (!owner.attempted)
      contactDevelopmentLog("notification attempted", false);
    contactDevelopmentLog("notification accepted", owner.accepted);
    contactDevelopmentLog("resend email id", owner.emailId ?? "none");
    if (owner.httpStatus)
      contactDevelopmentLog("resend HTTP status", String(owner.httpStatus));
    return {
      owner: owner.status,
      confirmation: confirmation.status,
      notificationAttempted: owner.attempted,
      notificationAccepted: owner.accepted,
      resendEmailId: owner.emailId,
      confirmationResendEmailId: confirmation.emailId,
    };
  }
  if (
    !apiKey ||
    !recipient.success ||
    !sender.success ||
    configurationIssues.length
  ) {
    console.error("contact_email_skipped", {
      inquiryId: inquiry.id,
      reason: "configuration_missing_or_invalid",
      configurationIssues,
    });
    return outcome(skippedEmail, skippedEmail);
  }
  const from = `NextWeb Studio <${sender.data}>`;
  const owner = await sendEmail(
    {
      ...buildOwnerEmail(inquiry),
      from,
      to: [recipient.data],
      reply_to: inquiry.email,
    },
    apiKey,
    inquiry.id,
    "owner",
  );

  // Validate independently, even though the contact route has already done so.
  const visitor = emailAddress.safeParse(inquiry.email);
  // The shared development sender cannot notify arbitrary visitors.
  const confirmation =
    visitor.success && !testSender
      ? await sendEmail(
          {
            ...buildConfirmationEmail(inquiry),
            from,
            to: [visitor.data],
            reply_to: recipient.data,
          },
          apiKey,
          inquiry.id,
          "confirmation",
        )
      : skippedEmail;
  if (testSender)
    contactDevelopmentLog(
      "visitor confirmation",
      "skipped: Resend development sender restriction",
    );
  return outcome(owner, confirmation);
}
