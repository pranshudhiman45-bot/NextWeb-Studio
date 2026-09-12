import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:net";
import { once } from "node:events";
import mongoose from "mongoose";
import { Contact } from "../models/Contact.ts";
import { ContactRateLimit } from "../models/ContactRateLimit.ts";
import {
  consumeContactRateLimit,
  getContactClientIp,
} from "../lib/contact-rate-limit.ts";
import { buildOwnerEmail, sendContactEmails } from "../lib/contact-email.ts";
import { getProjectTypeFromQuery } from "../lib/validations.ts";
import { safeResendError } from "../lib/contact-diagnostics.ts";

let mongo;
let mongoExited;
let databaseDirectory;
let POST;
let sends;
let logs;
let developmentLogs;
const valid = {
  name: "Sample Client",
  email: "client@example.com",
  phone: "+91 98765 43210",
  company: "Example Co",
  projectType: "Website",
  budget: "Not sure yet",
  timeline: "Eight weeks",
  message: "We need a professional website for our new business.",
  source: "contact-page",
  website: "",
};

function request(data = valid, headers = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data),
  });
}

before(async () => {
  // Always use an isolated local database. Never read production credentials.
  const portServer = createServer();
  portServer.listen(0, "127.0.0.1");
  await once(portServer, "listening");
  const { port } = portServer.address();
  await new Promise((resolve) => portServer.close(resolve));
  databaseDirectory = await mkdtemp(join(tmpdir(), "nextweb-contact-test-"));
  mongo = spawn(
    "mongod",
    [
      "--dbpath",
      databaseDirectory,
      "--bind_ip",
      "127.0.0.1",
      "--port",
      String(port),
      "--nounixsocket",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  mongoExited = once(mongo, "exit");
  // Keep server output private; it is not needed in the test report.
  mongo.stderr.resume();
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Test MongoDB did not start")),
      15000,
    );
    mongo.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    mongo.once("exit", () => {
      clearTimeout(timer);
      reject(new Error("Test MongoDB exited before becoming ready"));
    });
    mongo.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Waiting for connections")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  process.env.MONGODB_URI = `mongodb://127.0.0.1:${port}/contact_tests`;
  ({ POST } = await import("../app/api/contact/route.ts"));
  const { connectToDatabase } = await import("../lib/mongodb.ts");
  await connectToDatabase();
  await Promise.all([Contact.init(), ContactRateLimit.init()]);
});

beforeEach(async () => {
  mock.restoreAll();
  await Promise.all([Contact.deleteMany({}), ContactRateLimit.deleteMany({})]);
  process.env.RESEND_API_KEY = "test-placeholder-never-used-on-network";
  process.env.CONTACT_EMAIL = "pranshudhiman89@gmail.com";
  process.env.CONTACT_FROM_EMAIL = "sender@example.com";
  delete process.env.VERCEL;
  process.env.NODE_ENV = "test";
  sends = [];
  logs = [];
  developmentLogs = [];
  mock.method(console, "info", (...args) => developmentLogs.push(args));
  mock.method(console, "error", (...args) => logs.push(args));
  mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    const payload = JSON.parse(options.body);
    const key = options.headers["Idempotency-Key"];
    const id = key.split("/")[1];
    // This query proves MongoDB persistence precedes every email request.
    assert.ok(await Contact.findById(id));
    sends.push({ payload, key, options });
    return Response.json({ id: `email-${sends.length}` });
  });
});

after(async () => {
  mock.restoreAll();
  await mongoose.disconnect();
  if (mongo && mongo.exitCode === null) {
    mongo.kill("SIGTERM");
    await mongoExited;
  }
  if (databaseDirectory)
    await rm(databaseDirectory, { recursive: true, force: true });
});

test("valid inquiry saves one MongoDB record before both Resend requests and sets Reply-To", async () => {
  const response = await POST(request());
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    success: true,
    message:
      "Thanks for reaching out. Your project inquiry has been received and I'll contact you soon.",
  });
  assert.equal(await Contact.countDocuments(), 1);
  const saved = await Contact.findOne().lean();
  assert.equal(saved.name, valid.name);
  assert.equal(saved.phone, valid.phone);
  assert.equal(saved.phoneNormalized, "+919876543210");
  assert.equal(saved.status, "new");
  assert.equal(saved.website, undefined);
  assert.equal(saved.emailNotificationStatus, "accepted");
  assert.equal(saved.inquirySaved, true);
  assert.equal(saved.notificationAttempted, true);
  assert.equal(saved.notificationAccepted, true);
  assert.equal(saved.resendEmailId, "email-1");
  assert.equal(saved.confirmationResendEmailId, "email-2");
  assert.equal(saved.confirmationEmailStatus, "accepted");
  assert.equal(sends.length, 2);
  const [owner, confirmation] = sends;
  assert.deepEqual(owner.payload.to, ["pranshudhiman89@gmail.com"]);
  assert.equal(owner.payload.from, "NextWeb Studio <sender@example.com>");
  assert.equal(owner.payload.reply_to, valid.email);
  assert.equal(
    owner.payload.subject,
    `New NextWeb Studio Project Inquiry — ${valid.name}`,
  );
  for (const value of [
    valid.phone,
    valid.company,
    valid.projectType,
    valid.budget,
    valid.timeline,
    valid.message,
    valid.source,
    saved.createdAt.toISOString(),
    String(saved._id),
  ]) {
    assert.ok(owner.payload.text.includes(value));
    assert.ok(owner.payload.html.includes(value));
  }
  assert.ok(owner.payload.html.includes(`href="mailto:${valid.email}"`));
  assert.ok(owner.payload.html.includes('href="tel:+919876543210"'));
  assert.ok(owner.payload.text.includes(`Contact Number:\n${valid.phone}`));
  assert.ok(!confirmation.payload.html.includes(valid.phone));
  assert.ok(!confirmation.payload.text.includes(valid.phone));
  assert.deepEqual(confirmation.payload.to, [valid.email]);
  assert.equal(confirmation.payload.reply_to, "pranshudhiman89@gmail.com");
  assert.equal(
    confirmation.payload.subject,
    "We received your project inquiry — NextWeb Studio",
  );
  assert.ok(confirmation.payload.text.includes("Pranshu Dhiman"));
  assert.equal(owner.key, `contact/${saved._id}/owner`);
  assert.equal(confirmation.key, `contact/${saved._id}/confirmation`);
});

for (const [label, phone, normalized] of [
  ["Indian local number", "9876543210", "9876543210"],
  ["Indian country code", "+919876543210", "+919876543210"],
  ["spaces and dashes", "98765-43210", "9876543210"],
  ["readable formatting", "  +91 98765 43210  ", "+919876543210"],
  ["international parentheses", "+1 (415) 555-0123", "+14155550123"],
  ["UK international number", "+44 20 7946 0958", "+442079460958"],
  ["short local number", "555-0123", "5550123"],
  ["maximum digits", "+123 456 789 012 345", "+123456789012345"],
]) {
  test(`${label} preserves readable phone and derives a safe searchable call number`, async () => {
    const response = await POST(
      request({ ...valid, phone, phoneNormalized: "untrusted" }),
    );
    assert.equal(response.status, 201);
    const saved = await Contact.findOne().lean();
    assert.equal(saved.phone, phone.trim());
    assert.equal(saved.phoneNormalized, normalized);
    assert.equal(await Contact.countDocuments(), 1);
    assert.ok(sends[0].payload.html.includes(`href="tel:${normalized}"`));
    assert.ok(sends[0].payload.text.includes(phone.trim()));
    assert.ok(!JSON.stringify(logs).includes(phone.trim()));
    assert.ok(!JSON.stringify(await response.json()).includes(normalized));
  });
}

for (const [label, phone] of [
  ["short phone", "12345"],
  ["alphabetic phone", "call me please"],
  ["mixed letters", "+91 98765 ABC10"],
  ["empty phone", ""],
  ["whitespace phone", "   "],
  ["missing phone", undefined],
  ["numeric JSON phone", 9876543210],
  ["too many digits", "+1234567890123456"],
  ["oversized formatting", "1" + " ".repeat(32) + "234567890"],
  ["misplaced plus", "98765+43210"],
  ["multiple plus signs", "++919876543210"],
  ["unbalanced parentheses", "+1 (415 555-0123"],
  ["empty parentheses", "+1 () 4155550123"],
  ["nested parentheses", "+1 ((415)) 5550123"],
  ["zero-only number", "0000000000"],
  ["zero country code", "+01 234567890"],
  ["HTML injection", '+91 9876543210"><script>x</script>'],
  ["control characters", "+91 98765\n43210"],
]) {
  test(`${label} returns a clear phone error without persistence or notification`, async () => {
    const response = await POST(request({ ...valid, phone }));
    assert.equal(response.status, 400);
    const result = await response.json();
    assert.equal(result.success, false);
    assert.ok(
      result.errors.phone.every(
        (message) => message === "Enter a valid contact number.",
      ),
    );
    assert.equal(await Contact.countDocuments(), 0);
    assert.equal(sends.length, 0);
    assert.equal(logs.length, 0);
  });
}

test("legacy inquiries remain readable without fabricating phone data", async () => {
  const { phone, website, ...legacy } = valid;
  const { insertedId } = await Contact.collection.insertOne(legacy);
  const saved = await Contact.findById(insertedId).lean();
  assert.equal(saved.name, valid.name);
  assert.equal(saved.phone, undefined);
  assert.equal(saved.phoneNormalized, undefined);
  assert.equal(phone, valid.phone);
  assert.equal(website, "");
});

test("owner template escapes malformed phone values without creating a call link", () => {
  const email = buildOwnerEmail({
    ...valid,
    phone: '<img src=x onerror="bad()">',
    id: "template-test",
    submittedAt: new Date(),
  });
  assert.ok(!email.html.includes("<img"));
  assert.ok(!email.html.includes('href="tel:'));
  assert.ok(email.html.includes("&lt;img"));
});

for (const [label, change] of [
  ["invalid email", { email: "not-an-email" }],
  [
    "email header injection",
    { email: "client@example.com\r\nBcc: other@example.com" },
  ],
  ["missing required fields", { name: undefined, message: undefined }],
  ["oversized message", { message: "x".repeat(3001) }],
  ["honeypot", { website: "https://spam.example" }],
  ["whitespace honeypot", { website: " " }],
]) {
  test(`${label} is rejected without storage or email`, async () => {
    const response = await POST(request({ ...valid, ...change }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
    assert.equal(await Contact.countDocuments(), 0);
    assert.equal(sends.length, 0);
  });
}

test("malformed JSON and unsupported content type return safe client errors", async () => {
  const malformed = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal((await POST(malformed)).status, 400);
  assert.equal(
    (await POST(request(valid, { "Content-Type": "text/plain" }))).status,
    415,
  );
  assert.equal(await Contact.countDocuments(), 0);
  assert.equal(sends.length, 0);
});

test("body byte limit works with and without Content-Length", async () => {
  for (const headers of [{}, { "Content-Length": "40000" }]) {
    const response = await POST(
      request({ ...valid, message: "x".repeat(40000) }, headers),
    );
    assert.equal(response.status, 413);
  }
  assert.equal(await Contact.countDocuments(), 0);
});

test("HTML is escaped in both emails and header control characters are removed", async () => {
  await POST(
    request({
      ...valid,
      name: "<b>Client</b>\r\nInjected",
      company: '<img src=x onerror="bad()">',
      message: '<script>alert("unsafe")</script> & extra project details',
    }),
  );
  for (const { payload } of sends) {
    assert.ok(!payload.html.includes("<b>Client</b>"));
    assert.ok(!payload.html.includes("<script>"));
    assert.ok(!payload.html.includes("<img"));
    assert.ok(payload.html.includes("&lt;b&gt;Client&lt;/b&gt;"));
    assert.ok(!/[\r\n]/.test(payload.subject));
  }
  assert.ok(sends[0].payload.html.includes("&lt;script&gt;"));
  assert.ok(sends[0].payload.html.includes("&quot;"));
});

test("optional company and source use readable defaults", async () => {
  await POST(request({ ...valid, company: "", source: undefined }));
  assert.ok(sends[0].payload.text.includes("Not provided"));
  assert.ok(sends[0].payload.text.includes("contact-page"));
  assert.equal((await Contact.findOne()).source, "contact-page");
});

test("IP rate limit returns 429 and Retry-After before the sixth save", async () => {
  for (let i = 0; i < 5; i++) {
    assert.equal(
      (await POST(request({ ...valid, email: `client${i}@example.com` })))
        .status,
      201,
    );
  }
  const response = await POST(
    request({ ...valid, email: "sixth@example.com" }),
  );
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
  assert.equal(await Contact.countDocuments(), 5);
  assert.equal(sends.length, 10);
});

test("per-email limit is case-insensitive and holds across Vercel IPs", async () => {
  process.env.VERCEL = "1";
  for (let i = 0; i < 3; i++) {
    assert.equal(
      (
        await POST(
          request(valid, { "x-vercel-forwarded-for": `192.0.2.${i + 1}` }),
        )
      ).status,
      201,
    );
  }
  const response = await POST(
    request(
      { ...valid, email: "CLIENT@EXAMPLE.COM" },
      { "x-vercel-forwarded-for": "192.0.2.10" },
    ),
  );
  assert.equal(response.status, 429);
  assert.equal(await Contact.countDocuments(), 3);
});

test("rate limiting stays atomic under concurrent requests and resets at window boundary", async () => {
  const now = 1800000;
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      consumeContactRateLimit("concurrent-test", 5, 900000, now),
    ),
  );
  assert.equal(results.filter((result) => result.allowed).length, 5);
  assert.equal(
    (await consumeContactRateLimit("concurrent-test", 5, 900000, now + 900000))
      .allowed,
    true,
  );
  const indexes = await ContactRateLimit.collection.indexes();
  assert.ok(
    indexes.some(
      (index) => index.key.expiresAt === 1 && index.expireAfterSeconds === 0,
    ),
  );
  const bucket = await ContactRateLimit.findOne().lean();
  assert.ok(!bucket._id.includes("concurrent-test"));
});

test("client identity ignores untrusted forwarding headers", () => {
  assert.equal(
    getContactClientIp(
      request(valid, {
        "x-forwarded-for": "192.0.2.1",
        "x-vercel-forwarded-for": "192.0.2.2",
      }),
    ),
    "shared-local-or-unknown",
  );
  process.env.VERCEL = "1";
  assert.equal(
    getContactClientIp(
      request(valid, { "x-vercel-forwarded-for": "192.0.2.2" }),
    ),
    "192.0.2.2",
  );
  assert.equal(
    getContactClientIp(request(valid, { "x-vercel-forwarded-for": "spoof" })),
    "shared-local-or-unknown",
  );
});

test("MongoDB save failure prevents all email and does not expose internals", async () => {
  mock.method(Contact.prototype, "save", async () => {
    throw new Error("private database credentials");
  });
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.equal(sends.length, 0);
  assert.equal(await Contact.countDocuments(), 0);
  assert.ok(!(await response.text()).includes("private"));
  assert.ok(!JSON.stringify(logs).includes("credentials"));
});

test("rate limit database failure fails closed before saving or emailing", async () => {
  mock.method(ContactRateLimit, "findOneAndUpdate", async () => {
    throw new Error("private rate limit error");
  });
  assert.equal((await POST(request())).status, 503);
  assert.equal(await Contact.countDocuments(), 0);
  assert.equal(sends.length, 0);
});

test("provider rejection keeps the inquiry and logs only safe metadata", async () => {
  mock.method(
    globalThis,
    "fetch",
    async () => new Response("private provider response", { status: 403 }),
  );
  const response = await POST(request());
  assert.equal(response.status, 201);
  assert.equal((await response.json()).success, true);
  assert.equal(await Contact.countDocuments(), 1);
  const saved = await Contact.findOne();
  assert.equal(saved.emailNotificationStatus, "failed");
  assert.equal(saved.notificationAttempted, true);
  assert.equal(saved.notificationAccepted, false);
  assert.equal(saved.resendEmailId, null);
  assert.equal(saved.confirmationEmailStatus, "failed");
  assert.equal(saved.phone, valid.phone);
  assert.equal(saved.phoneNormalized, "+919876543210");
  const safeLogs = JSON.stringify(logs);
  for (const secret of [
    process.env.RESEND_API_KEY,
    process.env.MONGODB_URI,
    valid.email,
    valid.phone,
    saved.phoneNormalized,
    "private provider response",
  ])
    assert.ok(!safeLogs.includes(secret));
  assert.ok(safeLogs.includes(String(saved._id)));
});

test("network timeout after save still returns success", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new DOMException("private timeout detail", "TimeoutError");
  });
  assert.equal((await POST(request())).status, 201);
  assert.equal((await Contact.findOne()).emailNotificationStatus, "failed");
  assert.ok(!JSON.stringify(logs).includes("private timeout"));
});

test("missing email configuration safely skips email and retains inquiry", async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  assert.equal((await POST(request())).status, 201);
  const saved = await Contact.findOne();
  assert.equal(saved.emailNotificationStatus, "skipped");
  assert.equal(saved.notificationAttempted, false);
  assert.equal(saved.notificationAccepted, false);
  assert.equal(saved.resendEmailId, null);
  assert.equal(saved.confirmationEmailStatus, "skipped");
  assert.equal(sends.length, 0);
});

test("confirmation failure is independent of owner notification", async () => {
  let count = 0;
  mock.method(globalThis, "fetch", async () =>
    ++count === 1
      ? Response.json({ id: "owner-id" })
      : new Response("unavailable", { status: 500 }),
  );
  assert.equal((await POST(request())).status, 201);
  const saved = await Contact.findOne();
  assert.equal(saved.emailNotificationStatus, "accepted");
  assert.equal(saved.confirmationEmailStatus, "failed");
});

test("email status write failure cannot change saved inquiry success", async () => {
  mock.method(Contact, "updateOne", async () => {
    throw new Error("private update error");
  });
  assert.equal((await POST(request())).status, 201);
  assert.equal(await Contact.countDocuments(), 1);
  assert.equal(sends.length, 2);
  assert.ok(!JSON.stringify(logs).includes("private update"));
});

test("a malformed provider success response is recorded as failed", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({}));
  assert.equal((await POST(request())).status, 201);
  assert.equal((await Contact.findOne()).emailNotificationStatus, "failed");
});

test("email helper never sends visitor confirmation to an invalid email", async () => {
  let count = 0;
  mock.method(globalThis, "fetch", async () => {
    count++;
    return Response.json({ id: "owner-id" });
  });
  const result = await sendContactEmails({
    ...valid,
    email: "invalid",
    id: "helper-test",
    submittedAt: new Date(),
  });
  assert.equal(result.confirmation, "skipped");
  assert.equal(count, 1);
});

test("contact project query maps only supported own properties", () => {
  for (const value of [
    "constructor",
    "toString",
    "__proto__",
    "unknown",
    "",
    undefined,
  ]) {
    assert.equal(getProjectTypeFromQuery(value), undefined);
  }
  for (const [query, project] of Object.entries({
    "business-website": "Website",
    "saas-product": "SaaS",
    dashboard: "Dashboard",
    "e-commerce": "E-commerce",
    "ai-application": "AI Application",
    "api-backend": "API / Backend",
  }))
    assert.equal(getProjectTypeFromQuery(query), project);
});

test("performance and maintenance services can be saved and notified", async () => {
  for (const projectType of [
    "Performance Optimization",
    "Maintenance & Support",
  ]) {
    assert.equal((await POST(request({ ...valid, projectType }))).status, 201);
    assert.ok(await Contact.findOne({ projectType }));
  }
  assert.equal(sends.length, 4);
});

test("development logs distinguish saved, attempted, accepted and retain the email ID without private visitor data", async () => {
  process.env.NODE_ENV = "development";
  assert.equal((await POST(request())).status, 201);
  const output = developmentLogs.flat().join("\n");
  for (const text of [
    "inquiry persisted: yes",
    "notification attempted: yes",
    "notification accepted: yes",
    "resend email id: email-1",
    "recipient: pranshudhiman89@gmail.com",
    "from: NextWeb Studio <sender@example.com>",
    "reply-to is validated visitor email: yes",
  ])
    assert.ok(output.includes(text));
  for (const privateValue of [
    process.env.RESEND_API_KEY,
    process.env.MONGODB_URI,
    valid.phone,
    valid.email,
  ])
    assert.ok(!output.includes(privateValue));
});

test("development missing configuration explicitly logs no attempt and no acceptance", async () => {
  process.env.NODE_ENV = "development";
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(request())).status, 201);
  const output = developmentLogs.flat().join("\n");
  assert.ok(output.includes("inquiry persisted: yes"));
  assert.ok(output.includes("notification attempted: no"));
  assert.ok(output.includes("notification accepted: no"));
  assert.ok(JSON.stringify(logs).includes("RESEND_API_KEY missing"));
  assert.equal(sends.length, 0);
});

test("provider errors log allowlisted names and safe messages even when raw fields contain secrets", async () => {
  const secretText = [
    process.env.RESEND_API_KEY,
    process.env.MONGODB_URI,
    valid.phone,
    valid.email,
    "private-auth-secret",
  ].join(" ");
  mock.method(globalThis, "fetch", async () =>
    Response.json(
      {
        name: "validation_error",
        code: secretText,
        message: `The domain is not verified. ${secretText}`,
        stack: secretText,
      },
      { status: 403 },
    ),
  );
  assert.equal((await POST(request())).status, 201);
  const output = JSON.stringify(logs);
  assert.ok(output.includes("validation_error"));
  assert.ok(output.includes("sender_domain_unverified"));
  for (const secret of secretText.split(" "))
    assert.ok(!output.includes(secret));
  assert.equal((await Contact.findOne()).notificationAccepted, false);
  assert.equal(
    safeResendError({ name: secretText, message: secretText }, 403).name,
    "provider_error",
  );
  assert.equal(
    safeResendError(
      {
        name: "validation_error",
        message:
          "You can only send testing emails to your own email address (private@example.com).",
      },
      403,
    ).code,
    "test_recipient_restricted",
  );
});

test("development sender sends owner notification only and skips visitor confirmation", async () => {
  process.env.NODE_ENV = "development";
  process.env.CONTACT_FROM_EMAIL = "onboarding@resend.dev";
  assert.equal((await POST(request())).status, 201);
  assert.equal(sends.length, 1);
  assert.equal(sends[0].payload.from, "NextWeb Studio <onboarding@resend.dev>");
  assert.equal(sends[0].payload.reply_to, valid.email);
  assert.equal((await Contact.findOne()).confirmationEmailStatus, "skipped");
});

test("production never uses the shared development sender or emits development logs", async () => {
  process.env.NODE_ENV = "production";
  process.env.CONTACT_FROM_EMAIL = "onboarding@resend.dev";
  assert.equal((await POST(request())).status, 201);
  assert.equal(sends.length, 0);
  assert.equal(developmentLogs.length, 0);
  assert.equal((await Contact.findOne()).notificationAttempted, false);
});
