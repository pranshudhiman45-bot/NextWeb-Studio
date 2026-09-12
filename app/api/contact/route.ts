import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { contactSchema } from "@/lib/validations";
import { Contact } from "@/models/Contact";
import {
  consumeContactRateLimit,
  getContactClientIp,
} from "@/lib/contact-rate-limit";
import { sendContactEmails } from "@/lib/contact-email";
import { normalizePhone } from "@/lib/phone";
import { contactDevelopmentLog } from "@/lib/contact-diagnostics";

export const runtime = "nodejs";
export const maxDuration = 60;

const maxBodyBytes = 32 * 1024;

class BodyTooLargeError extends Error {}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) {
    throw new BodyTooLargeError();
  }
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function failure(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ success: false, message }, { status, headers });
}

export async function POST(request: Request) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return failure("Please submit the contact form as JSON.", 415);
  }
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return error instanceof BodyTooLargeError
      ? failure(
          "Your submission is too large. Please shorten it and try again.",
          413,
        )
      : failure("Unable to read your submission. Please try again.", 400);
  }

  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    body.website !== undefined &&
    body.website !== ""
  ) {
    return failure("Unable to accept this submission. Please try again.", 400);
  }
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { website: honeypot, ...data } = result.data;
  void honeypot;
  let inquiry;
  try {
    await connectToDatabase();
    const ipLimit = await consumeContactRateLimit(
      `ip:${getContactClientIp(request)}`,
      5,
      15 * 60 * 1000,
    );
    if (!ipLimit.allowed) {
      return failure(
        "Too many inquiries. Please wait a little before trying again.",
        429,
        { "Retry-After": String(ipLimit.retryAfter) },
      );
    }
    const emailLimit = await consumeContactRateLimit(
      `email:${data.email.toLowerCase()}`,
      3,
      60 * 60 * 1000,
    );
    if (!emailLimit.allowed) {
      return failure(
        "Too many inquiries. Please wait a little before trying again.",
        429,
        { "Retry-After": String(emailLimit.retryAfter) },
      );
    }
    inquiry = new Contact({
      ...data,
      phoneNormalized: normalizePhone(data.phone),
      source: data.source || "contact-page",
    });
    // Email cannot run until MongoDB acknowledges this exact inquiry.
    await inquiry.save({ w: "majority", wtimeout: 10000 });
  } catch {
    console.error("contact_storage_failed", { reason: "storage_unavailable" });
    return failure(
      "Unable to receive your inquiry right now. Please try again shortly.",
      503,
    );
  }

  const inquiryId = String(inquiry._id);
  const inquirySaved = true; // Only reached after majority write acknowledgement.
  contactDevelopmentLog("inquiry persisted", inquirySaved);
  // Every operation after the save is isolated from the submission response.
  // A failed email must never turn a stored inquiry into a retry/duplicate.
  try {
    const delivery = await sendContactEmails({
      ...data,
      id: inquiryId,
      submittedAt: inquiry.createdAt,
    });
    await Contact.updateOne(
      { _id: inquiry._id },
      {
        $set: {
          emailNotificationStatus: delivery.owner,
          confirmationEmailStatus: delivery.confirmation,
          inquirySaved,
          notificationAttempted: delivery.notificationAttempted,
          notificationAccepted: delivery.notificationAccepted,
          resendEmailId: delivery.resendEmailId,
          confirmationResendEmailId: delivery.confirmationResendEmailId,
        },
      },
      { maxTimeMS: 3000 },
    );
  } catch {
    console.error("contact_notification_processing_failed", {
      inquiryId,
      reason: "notification_or_status_update_failed",
    });
  }

  return NextResponse.json(
    {
      success: true,
      message:
        "Thanks for reaching out. Your project inquiry has been received and I'll contact you soon.",
    },
    { status: 201 },
  );
}
