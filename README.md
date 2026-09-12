# NextWeb Studio

NextWeb Studio is the portfolio and independent development-studio website of Pranshu Dhiman. It presents the studio's services, real project work, and interactive showcase applications through a responsive full-stack Next.js experience.

## What the site includes

- A responsive studio website with light/dark themes, glass surfaces, and motion
- Service, process, technology, about, work, project-detail, and contact pages
- Real project data for Ryora and the Buy Best e-commerce application
- A live in-site showcase route for the deployed e-commerce application
- Project filtering with separate project types and technical categories
- Contact inquiry persistence through MongoDB
- Next.js metadata, sitemap, robots rules, Open Graph imagery, and structured data
- A development preview of the admin area; authentication and inquiry management are not implemented

## Real project showcase

- **Ryora** — a deployed creative-workspace demo. Local project source confirms React, TypeScript, Express and MongoDB, plus optional Gemini prompt enhancement. Its selected video provider returns sample media; original AI video generation and production authenticated workflows are not claimed.
- **Buy Best E-commerce** — a deployed MERN e-commerce application with authentication, product discovery, cart and checkout flows, payments, and administrative functionality. The live application is also presented at `/showcase/ecommerce` without recreating or replacing it.

## Technology

The studio site uses Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Mongoose, MongoDB, React Hook Form, and Zod.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

Quality checks:

```bash
npm run lint
npm run build
npm run test:contact
```

## Environment configuration

Copy `.env.example` to `.env.local` and provide only the values needed for the target environment.

| Variable                    | Purpose                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `MONGODB_URI`               | MongoDB connection used to store contact inquiries                    |
| `RESEND_API_KEY`            | Server-only Resend API key with permission to send email              |
| `CONTACT_EMAIL`             | Owner notification recipient: `pranshudhiman89@gmail.com`             |
| `CONTACT_FROM_EMAIL`        | Bare sender email address on a domain verified in Resend              |
| `NEXT_PUBLIC_SITE_URL`      | Canonical production URL used by metadata, sitemap, and robots output |
| `NEXT_PUBLIC_GITHUB_URL`    | Optional studio GitHub profile shown in the interface                 |
| `NEXT_PUBLIC_LINKEDIN_URL`  | Optional studio/founder LinkedIn profile shown in the interface       |
| `NEXT_PUBLIC_CAL_URL`       | Optional booking URL used by call-to-action links                     |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public contact email shown in the interface                  |

Never commit real credentials or secret values. The e-commerce application's database, authentication, OAuth, payment, email, and media credentials remain in that application's own environment configuration and are not copied into this project.

## Project data model

Project records live in `lib/projects.ts`. `projectType` describes the relationship to NextWeb Studio, while `primaryCategory` and `categories` describe the verified technical work. Optional `liveUrl`, `internalUrl`, and `githubUrl` fields ensure the interface only renders actions that have real destinations.

## Contact inquiries

The contact form posts JSON to `POST /api/contact`. The route validates with Zod, rejects the `website` honeypot, applies shared MongoDB rate limits, and saves one `Contact` document with majority write acknowledgement before sending email through Resend's HTTP API. No additional packages or separate backend service are required.

Contact Number is required, with a mobile `tel` input and shared client/server Zod validation. Numbers must contain 7–15 digits within 32 characters; spaces, dashes, balanced nonempty parentheses, and one leading `+` are supported. Letters, control characters, all-zero numbers, and malformed formatting are rejected. The existing contact collection stores `phone` with its readable formatting (outer whitespace trimmed) and indexed `phoneNormalized` with formatting removed. Normalization is derived on the server and preserves an explicit `+`; it does not guess a country code or verify that the number is assigned. Existing inquiries without phone data remain readable and are not backfilled with invented values.

The owner email includes the readable Contact Number and a validated `tel:` call link. Phone data is excluded from submission responses, visitor confirmations, analytics, logs, and public pages/APIs. There is no public inquiry endpoint. Only private database access and the owner notification can currently access it; authenticated inquiry management has not been built. No WhatsApp link is generated.

The owner notification includes the inquiry fields, submission time in UTC, source, and the same MongoDB inquiry ID. Its Reply-To is the visitor's validated email; From always uses `CONTACT_FROM_EMAIL` with the NextWeb Studio display name. A separate confirmation goes to the visitor, uses the requested Pranshu Dhiman signature, and directs replies to `CONTACT_EMAIL`. Both HTML templates escape visitor content and have plain-text alternatives.

The existing inline success UI confirms receipt only after storage succeeds. An email rejection, timeout, missing configuration, or email-status update failure after that save still returns `201` with the receipt message. The inquiry is never deleted. Storage or rate-limit database failures return a generic `503`; validation errors return `400`, oversized bodies `413`, unsupported content types `415`, and rate limits `429` with `Retry-After`.

`emailNotificationStatus` and `confirmationEmailStatus` are stored on that same contact document: `pending`, `accepted`, `failed`, or `skipped`. `accepted` means Resend accepted the API request, not confirmed inbox delivery. The same record retains `inquirySaved`, `notificationAttempted`, `notificationAccepted`, `resendEmailId`, and `confirmationResendEmailId`. These fields are optional for older records; absence does not prove acceptance or failure. If sending is interrupted or a status update fails, `pending` can remain. There is no automatic retry queue; review failed/skipped/pending inquiries and Resend logs operationally. Email requests carry separate idempotency keys based on the inquiry ID for owner and visitor.

Logs contain event names, inquiry IDs, fixed reason codes, email kind, HTTP status, and allowlisted provider error names with safe diagnostic explanations. Raw provider error messages/bodies, credentials, visitor content, and exception stacks are never logged because provider errors may echo private data. Development logs additionally report persistence, attempted/accepted flags, the Resend email ID, configured owner recipient/From, and whether Reply-To is a validated visitor email. The actual visitor email and phone are not logged. These details never appear in the public API response.

The admin page currently contains an unauthenticated development placeholder, not a live inquiry list. Existing contacts remain in the same MongoDB collection for a future authenticated dashboard; this change does not expose them through the public admin page or create duplicate inquiry documents.

### Abuse protection

- Five validated submissions per IP per fixed 15-minute window, plus three per normalized email address per fixed hour. Limits are atomic MongoDB increments shared across Vercel instances and survive function restarts.
- Only Vercel's overwritten `x-vercel-forwarded-for` header is trusted when running on Vercel. Local development and other hosts use a conservative shared bucket; do not simply trust client-supplied forwarding headers when adapting to another host. See [Vercel request headers](https://vercel.com/docs/headers/request-headers).
- Rate-limit keys contain SHA-256 digests rather than raw IP/email values. The `contactratelimits` collection has an `expiresAt` TTL index for cleanup; time-based bucket keys enforce expiry even before cleanup runs. Keep Mongoose index creation enabled, or provision `{ expiresAt: 1 }` with `{ expireAfterSeconds: 0 }` on this collection during deployment.
- The offscreen honeypot is excluded from keyboard navigation and assistive technology. Filled honeypots receive a generic rejection with no inquiry save or email. JSON bodies are capped at 32 KiB even without Content-Length, and messages at 3,000 characters. Malformed and invalid submissions are rejected before database work.

### Resend setup before production

1. Create a Resend account and add a sending domain you own under Domains. Add the exact DNS records Resend supplies (including its DKIM and sending SPF/MX records), then wait for verification. See [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).
2. Choose a sender on that verified domain. Set `CONTACT_FROM_EMAIL` to the bare email address, without a display name or angle brackets; the application supplies `NextWeb Studio`. The example environment intentionally leaves it blank rather than inventing a verified sender.
3. Create a Resend API key with sending access to that domain. Set `RESEND_API_KEY` privately in `.env.local` for development and in the Vercel project's environment settings for each deployment environment that should send mail. Never prefix it with `NEXT_PUBLIC_`, commit it, or include it in client code.
4. Set `CONTACT_EMAIL=pranshudhiman89@gmail.com` and configure `MONGODB_URI`. Configure Preview separately if needed; use a test recipient for preview deployments to avoid mixing test and production inquiries. Redeploy after updating Vercel variables, or restart the local dev server.
5. Submit one valid inquiry from an inbox you control. Confirm exactly one MongoDB contact, both emails in Resend's logs, owner inbox receipt, the owner's Reply-To addressing the client, and visitor confirmation receipt. Provider acceptance alone is not proof of delivery; inspect Resend delivery/bounce status too. See [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).

The `resend.dev` test sender only permits delivery to the email address associated with your Resend account. It cannot support arbitrary visitor confirmations; verify your own domain before production. No test sender is silently selected by the application. See [Resend test-domain restrictions](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

### Debug email delivery locally

`201 Created` confirms an acknowledged MongoDB save even when notification is skipped or fails. It is not an email delivery receipt. Check the inquiry's notification status independently.

For local testing before custom domain verification, set `CONTACT_FROM_EMAIL=onboarding@resend.dev` in the ignored `.env.development.local` and set `RESEND_API_KEY` privately in `.env.local`. `CONTACT_EMAIL` must match your Resend account's email for this test sender. The development file overrides `.env.local` during `npm run dev` only; remove that sender override when testing your verified domain. Restart the dev server after changes. Visitor confirmations are skipped with the shared test sender, and production refuses this sender; configure a verified custom sender in the production environment.

Run `npm run debug:contact-email` for read-only database/configuration inspection. Run `npm run debug:contact-email -- --send` to create and retain one marked diagnostic inquiry through the exact contact Route Handler and use real Resend HTTP requests. This is an explicit live action: it writes to the configured database and can send email to `pranshudhiman89@gmail.com`. Its controlled visitor address is also the owner's address, so Reply-To can be checked without involving another person. Missing configuration blocks the live test rather than creating an unnecessary inquiry. The automated `test:contact` suite remains isolated and mocked.

The live diagnostic reads the returned Resend email ID and polls `GET /emails/{id}` for `last_event`, distinguishing sent, delivered, delayed, bounced, failed, and rejected. Sending-only API keys cannot retrieve delivery status or list domains; in that case inspect the Resend dashboard using the saved ID rather than treating API acceptance as delivery. See [Resend retrieve email](https://resend.com/docs/api-reference/emails/retrieve-email) and [API permissions/errors](https://resend.com/docs/api-reference/errors).

`delivered` means acceptance by the recipient's mail server, not guaranteed inbox placement. Search Gmail All Mail and Spam for the test subject and inspect Resend's event timeline. Inbox/spam placement cannot be verified without access to that mailbox. See [Resend email statuses](https://resend.com/docs/dashboard/emails/introduction).

### Contact tests

`npm run test:contact` requires Node.js 24+ and `mongod` available on PATH. It launches an isolated temporary MongoDB instance on a free localhost port, exercises real writes and concurrent rate-limit updates, then shuts the instance down and removes only its temporary database. The suite never connects to the configured production database and mocks all Resend HTTP calls, so it sends no real email.

Coverage includes valid inquiry persistence before send, invalid email, required fields, oversized messages/bodies, honeypot spam, malformed JSON, rate limits and concurrency, TTL indexing, HTML escaping, email content and Reply-To, provider rejection/timeouts, missing configuration, MongoDB write failures, and status-update failures. Live inbox delivery requires the setup and smoke test above.

Phone coverage includes Indian and international numbers, country codes, spaces/dashes/parentheses, readable and normalized MongoDB persistence, tampered normalization, invalid/empty/oversized inputs, safe owner call links, legacy inquiry compatibility, and retention/privacy when the provider fails.

## Deployment

Deploy the Next.js application to a compatible Node.js host, configure the required environment variables, and set `NEXT_PUBLIC_SITE_URL` to the public origin. The embedded e-commerce showcase loads the project's existing deployed frontend; it is not a localhost or placeholder preview.

In Vercel Project Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL` for Production to your actual canonical origin, such as `https://your-domain.com` (replace the example domain). Include `https://`, with no quotes, path, query, or fragment, then redeploy. The shared `siteConfig.url` trims and validates HTTP(S) URLs, removes credentials by rejecting credential-bearing URLs, and normalizes the origin. Empty, whitespace-only, or invalid values fall back to `VERCEL_URL`, then `http://localhost:3000`. Vercel supplies `VERCEL_URL` as a hostname; the resolver accepts either a hostname or an already-prefixed HTTP(S) URL without adding the scheme twice. See [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables).

Layout metadata, per-page canonical/Open Graph/Twitter URLs, JSON-LD, sitemap, and robots use this same site configuration. Optional deployment, contact, email, and database settings are not required to render static pages, including the 404 page. Contact credentials are checked only when the contact backend needs them. URL regression tests can be run with `node --import ./tests/register-typescript.mjs --test tests/site-config.test.mjs`.

## Brand

NextWeb Studio is founded, built, and owned by Pranshu Dhiman, Full Stack Developer.

## Content and functionality audit

See the [12 September 2026 audit](reports/content-functionality-audit-2026-09-12.md) for the content map, verified fixes, browser evidence, and remaining deployment requirements.
