import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { ContactRateLimit } from "@/models/ContactRateLimit";

export function getContactClientIp(request: Request) {
  // Trust only the header overwritten by Vercel's proxy, never arbitrary XFF.
  const forwarded =
    process.env.VERCEL === "1"
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : undefined;
  return forwarded && isIP(forwarded) ? forwarded : "shared-local-or-unknown";
}

export async function consumeContactRateLimit(
  identity: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const window = Math.floor(now / windowMs);
  const expiresAt = new Date((window + 1) * windowMs);
  const digest = createHash("sha256").update(identity).digest("hex");
  const key = `${digest}:${windowMs}:${window}`;
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt } };
  // The unique _id and atomic increment share limits across Vercel instances.
  let bucket;
  try {
    bucket = await ContactRateLimit.findOneAndUpdate({ _id: key }, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: false,
    });
  } catch (error) {
    if (!(
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    )) {
      throw error;
    }
    // Two instances may race to create the first bucket. Count both attempts.
    bucket = await ContactRateLimit.findOneAndUpdate({ _id: key }, update, {
      new: true,
    });
  }
  if (!bucket) throw new Error("Rate limit unavailable");
  return {
    allowed: bucket.count <= limit,
    retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}
