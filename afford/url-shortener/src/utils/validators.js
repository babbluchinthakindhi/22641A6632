export function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidMinutes(value) {
  if (value === "" || value === null || value === undefined) return true; // optional
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= 60 * 24 * 365; // cap 1y
}

export function isValidShortcode(value) {
  if (!value) return true; // optional
  return /^[a-zA-Z0-9_-]{3,20}$/.test(value);
}
