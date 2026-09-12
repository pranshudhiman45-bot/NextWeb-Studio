import { z } from "zod";

export const phoneMaxLength = 32;
const invalidPhoneMessage = "Enter a valid contact number.";

export const phoneSchema = z
  .string({ error: invalidPhoneMessage })
  .trim()
  .min(1, invalidPhoneMessage)
  .max(phoneMaxLength, invalidPhoneMessage)
  .refine((value) => {
    if (!/^\+?[0-9 ()-]+$/.test(value)) return false;
    // Allow balanced, nonempty groups such as +1 (415) 555-0123.
    const withoutGroups = value.replace(/\([0-9 ]*[0-9][0-9 ]*\)/g, "");
    if (/[()]/.test(withoutGroups)) return false;
    const digits = value.replace(/\D/g, "");
    return (
      digits.length >= 7 &&
      digits.length <= 15 &&
      !/^0+$/.test(digits) &&
      !(value.startsWith("+") && digits.startsWith("0"))
    );
  }, invalidPhoneMessage);

// Remove formatting only: never guess a country code for a local number.
// Callers validate with phoneSchema before storing or creating a tel link.
export function normalizePhone(phone: string) {
  return phone.replace(/[ ()-]/g, "");
}
