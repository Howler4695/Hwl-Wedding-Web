/**
 * Checks if a string is a valid US phone number.
 * - +1 or 1 at the start is optional
 * - Parentheses around the area code are optional
 * - Spaces, dashes, and dots are allowed and ignored
 */
export function isValidUSPhoneNumber(raw: string): boolean {
  if (!raw) return false;

  // Keep digits and a leading '+'
  let cleaned = raw.trim();

  // Handle optional leading +1 / 1 country code
  // Remove everything except digits and an optional leading +
  cleaned = cleaned.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    if (!cleaned.startsWith("+1")) return false; // only US country code allowed
    cleaned = cleaned.slice(2); // drop +1
  } else if (cleaned.startsWith("1") && cleaned.length === 11) {
    cleaned = cleaned.slice(1); // drop leading 1
  }

  // At this point we expect exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) return false;

  const areaCode = cleaned.slice(0, 3);
  const exchange = cleaned.slice(3, 6);

  // NANP rules: area code and exchange cannot start with 0 or 1
  if (!/^[2-9]\d{2}$/.test(areaCode)) return false;
  if (!/^[2-9]\d{2}$/.test(exchange)) return false;

  return true;
}
