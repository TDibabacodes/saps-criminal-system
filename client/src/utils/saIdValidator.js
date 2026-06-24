/**
 * Validates a South African ID number.
 * Checks:
 *  1. Must be exactly 13 digits
 *  2. First 6 digits must be a valid date of birth (YYMMDD)
 *  3. Must pass the Luhn checksum algorithm
 */
export function validateSAID(id) {

  // CHECK 1: Must be exactly 13 digits, no letters
  if (!/^\d{13}$/.test(id)) {
    return { valid: false, error: "Must be a valid South African ID (13 digits)" };
  }

  // CHECK 2: Valid date of birth in first 6 characters
  const year  = parseInt(id.substring(0, 2), 10);
  const month = parseInt(id.substring(2, 4), 10);
  const day   = parseInt(id.substring(4, 6), 10);

  if (month < 1 || month > 12) {
    return { valid: false, error: "Invalid date of birth in ID number" };
  }

  // Get the correct number of days for that month
  const daysInMonth = new Date(2000 + year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { valid: false, error: "Invalid date of birth in ID number" };
  }

  // CHECK 3: Luhn algorithm (checksum)
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(id[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  if (sum % 10 !== 0) {
    return { valid: false, error: "Invalid ID number" };
  }

  return { valid: true, error: null };
}