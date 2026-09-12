// Keep provider-controlled text out of logs. These names and explanations are
// allowlisted; raw errors may echo credentials or private inquiry content.
const providerErrorNames = new Set([
  "validation_error",
  "missing_api_key",
  "invalid_api_key",
  "restricted_api_key",
  "invalid_permission",
  "suspended_api_key",
  "rate_limit_exceeded",
  "daily_quota_exceeded",
  "monthly_quota_exceeded",
  "application_error",
  "service_unavailable",
  "invalid_parameter",
  "missing_required_field",
  "missing_required_parameter",
  "invalid_idempotency_key",
  "concurrent_idempotent_requests",
  "invalid_idempotent_request",
  "not_found",
]);

export function safeResendError(body: unknown, status: number) {
  const error =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const name =
    typeof error.name === "string" && providerErrorNames.has(error.name)
      ? error.name
      : "provider_error";
  const message = typeof error.message === "string" ? error.message : "";
  let code = name;
  let explanation =
    "Resend rejected the request. Inspect the private Resend dashboard for details.";
  if (/only send testing emails to your own email address/i.test(message)) {
    code = "test_recipient_restricted";
    explanation =
      "The Resend test sender can only send to the Resend account owner's email address.";
  } else if (/domain.*(?:not verified|unverified)/i.test(message)) {
    code = "sender_domain_unverified";
    explanation =
      "The From domain is not verified in Resend. Verify the domain before sending.";
  } else if (/api.?key/i.test(name) || status === 401) {
    explanation =
      "Resend rejected the API credentials or their permissions. Check the private API key configuration.";
  } else if (status === 429) {
    explanation =
      "Resend rejected the request because a sending or rate limit was reached.";
  } else if (status >= 500) {
    explanation = "Resend is temporarily unavailable.";
  }
  return { name, code, message: explanation, status };
}

export function contactDevelopmentLog(event: string, value: string | boolean) {
  if (process.env.NODE_ENV === "development") {
    console.info(
      `[contact] ${event}: ${typeof value === "boolean" ? (value ? "yes" : "no") : value}`,
    );
  }
}
