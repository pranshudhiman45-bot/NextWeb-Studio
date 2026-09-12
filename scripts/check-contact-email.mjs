import nextEnv from "@next/env";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { safeResendError } from "../lib/contact-diagnostics.ts";

// No mocks. --send explicitly creates and retains one marked test inquiry and
// uses the real route/Resend transport. Read-only inspection is the default.
process.env.NODE_ENV = "development";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const recipient = "pranshudhiman89@gmail.com";
const key = process.env.RESEND_API_KEY?.trim();
const sender = process.env.CONTACT_FROM_EMAIL?.trim();
const { contactSchema } = await import("../lib/validations.ts");
const { Contact } = await import("../models/Contact.ts");
const { connectToDatabase } = await import("../lib/mongodb.ts");
const report = {
  environment: "local development",
  recipient:
    process.env.CONTACT_EMAIL?.trim() === recipient
      ? "configured"
      : "not configured as expected",
  apiKeyConfigured: Boolean(key),
  senderConfigured: Boolean(sender),
  senderVerified: "UNKNOWN",
  deliveryStatus: "UNKNOWN",
};

async function inspectDelivery(id) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await delay(3000);
    const response = await fetch(
      `https://api.resend.com/emails/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(8000),
      },
    );
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      report.deliveryLookupError = safeResendError(body, response.status);
      report.deliveryLookupNote =
        "A sending-only key cannot retrieve email status. Use the Resend dashboard; do not assume delivery.";
      return;
    }
    const knownEvents = [
      "sent",
      "delivered",
      "delivery_delayed",
      "bounced",
      "failed",
      "rejected",
      "queued",
      "scheduled",
      "complained",
      "opened",
      "clicked",
    ];
    const event = knownEvents.includes(body?.last_event)
      ? body.last_event
      : "unknown";
    report.resendLastEvent = event;
    report.deliveryStatus =
      event === "delivered"
        ? "DELIVERED"
        : event === "sent"
          ? "SENT"
          : ["failed", "bounced", "rejected"].includes(event)
            ? "FAILED"
            : "UNKNOWN";
    report.providerRecipientMatches =
      Array.isArray(body?.to) &&
      body.to.length === 1 &&
      body.to[0] === recipient;
    report.providerFromMatches = body?.from === `NextWeb Studio <${sender}>`;
    report.providerReplyToMatches =
      Array.isArray(body?.reply_to) && body.reply_to.includes(recipient);
    if (["delivered", "failed", "bounced", "rejected"].includes(event)) return;
  }
}

try {
  await connectToDatabase();
  report.databaseReachable = true;
  report.existingInquiries = await Contact.countDocuments();
  report.recent = await Contact.find()
    .select(
      "_id createdAt emailNotificationStatus confirmationEmailStatus inquirySaved notificationAttempted notificationAccepted resendEmailId",
    )
    .sort({ _id: -1 })
    .limit(5)
    .lean();
  if (process.argv.includes("--send")) {
    const inquiry = {
      name: "NextWeb Studio Email Delivery Test",
      email: recipient,
      phone: "+1 202 555 0123",
      company: "NextWeb Studio controlled diagnostic",
      projectType: "Website",
      budget: "Not sure yet",
      timeline: "Diagnostic only",
      message:
        "Controlled email delivery test requested by the site owner. This is a test inquiry, not a customer lead.",
      source: `email-delivery-test-${randomUUID()}`,
      website: "",
    };
    if (
      !key ||
      !sender ||
      report.recipient !== "configured" ||
      !contactSchema.safeParse(inquiry).success
    ) {
      report.liveTest =
        "BLOCKED: missing or invalid private email configuration; no new inquiry or send attempted";
      report.resendInvoked = false;
      process.exitCode = 1;
    } else {
      if (sender.endsWith("@resend.dev")) {
        report.senderVerified =
          "Provider-supported test sender; account recipient restriction applies, custom domain not verified";
      } else {
        const response = await fetch("https://api.resend.com/domains", {
          headers: { Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(8000),
        });
        const domains = await response.json().catch(() => null);
        if (response.ok && Array.isArray(domains?.data)) {
          const domain = domains.data.find(
            (item) => item.name === sender.split("@")[1],
          );
          report.senderVerified =
            domain?.status === "verified"
              ? "YES"
              : domains.has_more
                ? "UNKNOWN: sender not on first domain page"
                : "NO";
        } else
          report.domainLookupError = safeResendError(domains, response.status);
      }
      const { POST } = await import("../app/api/contact/route.ts");
      const response = await POST(
        new Request("http://localhost/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inquiry),
        }),
      );
      report.contactHttpStatus = response.status;
      const saved = await Contact.findOne({ source: inquiry.source }).lean();
      report.inquirySaved = Boolean(saved);
      report.resendInvoked = saved?.notificationAttempted === true;
      report.resendAccepted = saved?.notificationAccepted === true;
      report.resendEmailId = saved?.resendEmailId ?? null;
      report.testInquiryId = saved ? String(saved._id) : null;
      report.testReplyTo = recipient;
      if (saved?.resendEmailId) await inspectDelivery(saved.resendEmailId);
      if (!report.resendAccepted) process.exitCode = 1;
    }
  }
} catch {
  report.checkError =
    "Diagnostic could not finish: database or provider unavailable. Internal details withheld.";
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
  console.log(JSON.stringify(report, null, 2));
}
