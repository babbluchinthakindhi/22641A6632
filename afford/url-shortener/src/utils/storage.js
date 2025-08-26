import { logEvent } from "./Logger";

const LINKS_KEY = "links_v1";

export function readAllLinks() {
  return JSON.parse(localStorage.getItem(LINKS_KEY) || "{}");
}

function writeAllLinks(map) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(map));
}

export function getLink(code) {
  const all = readAllLinks();
  return all[code] || null;
}

export function shortBase() {
  // force assignment’s base: localhost:3000
  return "http://localhost:3000/r";
}

function generateCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function uniqueCode(preferred) {
  const all = readAllLinks();
  if (preferred && !all[preferred]) return preferred;
  let code;
  do {
    code = generateCode(6);
  } while (all[code]);
  return code;
}

export function createShortLinks(items) {
  // items: [{ longUrl, minutes?, shortcode? }, ...]  (max 5)
  const all = readAllLinks();
  const created = [];
  for (const it of items.slice(0, 5)) {
    const now = new Date();
    const mins = it.minutes ? Number(it.minutes) : 30; // default 30
    const exp = new Date(now.getTime() + mins * 60 * 1000);
    const preferred = it.shortcode?.trim() || null;

    const code = uniqueCode(preferred);
    const shortUrl = `${shortBase()}/${code}`;

    all[code] = {
      code,
      longUrl: it.longUrl,
      createdAt: now.toISOString(),
      expiresAt: exp.toISOString(),
      shortUrl,
      clicks: 0,
      clickLogs: [], // {ts, referrer, tz}
    };

    created.push(all[code]);
    logEvent("create_short", { code, longUrl: it.longUrl, minutes: mins, preferred });
  }
  writeAllLinks(all);
  return created;
}

export function recordClick(code, details) {
  const all = readAllLinks();
  const link = all[code];
  if (!link) return null;
  link.clicks += 1;
  link.clickLogs.push({
    ts: new Date().toISOString(),
    referrer: details?.referrer || document.referrer || "",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
  });
  all[code] = link;
  writeAllLinks(all);
  logEvent("redirect_hit", { code, to: link.longUrl });
  return link;
}

export function isExpired(link) {
  return new Date(link.expiresAt).getTime() < Date.now();
}

export function upsertLink(link) {
  const all = readAllLinks();
  all[link.code] = link;
  writeAllLinks(all);
}

export function listLinksArray() {
  const map = readAllLinks();
  return Object.values(map).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
