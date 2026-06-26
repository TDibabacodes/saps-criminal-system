/**
 * Validates a South African ID number.
 * Checks:
 *  1. Must be exactly 13 digits
 *  2. First 6 digits must be a valid date of birth (YYMMDD)
 */
export function validateSAID(id) {

  // CHECK 1: Must be exactly 13 digits, no letters
  if (!/^\d{13}$/.test(id)) {
    return { valid: false, error: "Must be exactly 13 digits" };
  }

  // CHECK 2: Valid date of birth in first 6 characters
  const month = parseInt(id.substring(2, 4), 10);
  const day = parseInt(id.substring(4, 6), 10);

  if (month < 1 || month > 12) {
    return { valid: false, error: "Invalid date of birth in ID number" };
  }

  if (day < 1 || day > 31) {
    return { valid: false, error: "Invalid date of birth in ID number" };
  }

  return { valid: true, error: null };
}