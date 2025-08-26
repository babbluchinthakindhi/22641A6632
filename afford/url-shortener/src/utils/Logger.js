const LOG_KEY = "logs";

export function logEvent(type, payload = {}) {
  const entry = {
    id: crypto.randomUUID(),
    type,
    payload,
    ts: new Date().toISOString(),
  };
  // console (developer visibility)
  // eslint-disable-next-line no-console
  console.info(`[LOG] ${type}`, entry);

  // persist
  const all = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  all.push(entry);
  localStorage.setItem(LOG_KEY, JSON.stringify(all));
  return entry;
}

export function getLogs() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
}

export function clearLogs() {
  localStorage.removeItem(LOG_KEY);
}
