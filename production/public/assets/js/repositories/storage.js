import { APP_SCHEMA_VERSION, nowIso } from '../app/utils.js';

const LEGACY_KEYS = {
  'woyke.cart.v1': ['woyke-cart-v1'],
  'woyke.session.v1': ['woyke-demo-session'],
};

function envelope(data) {
  return { schemaVersion: APP_SCHEMA_VERSION, updatedAt: nowIso(), data };
}

function parse(raw) {
  try { return JSON.parse(raw); } catch { return undefined; }
}

function readLegacy(key) {
  for (const legacyKey of LEGACY_KEYS[key] || []) {
    const raw = localStorage.getItem(legacyKey);
    if (!raw) continue;
    if (legacyKey === 'woyke-demo-session' && raw === 'active') {
      return { userId: 'demo-user', displayName: 'WOYKE Guest', email: 'demo@woyke.example', phone: '+65 8123 4567', isDemo: true, createdAt: nowIso(), signedInAt: nowIso() };
    }
    const parsed = parse(raw);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

export function readDocument(key, fallback, validate = () => true) {
  const raw = localStorage.getItem(key);
  const parsed = raw ? parse(raw) : undefined;
  let data;
  if (parsed && parsed.schemaVersion === APP_SCHEMA_VERSION && Object.hasOwn(parsed, 'data')) data = parsed.data;
  else if (parsed !== undefined) data = parsed;
  else data = readLegacy(key);

  if (!validate(data)) {
    if (raw) localStorage.setItem(`${key}.recovered.${Date.now()}`, raw);
    data = fallback;
  }
  writeDocument(key, data);
  return data;
}

export function writeDocument(key, data) {
  localStorage.setItem(key, JSON.stringify(envelope(data)));
  return data;
}

export function removeDocument(key) {
  localStorage.removeItem(key);
}

export function updateDocument(key, fallback, validate, updater) {
  const current = readDocument(key, fallback, validate);
  const next = updater(current);
  writeDocument(key, next);
  return next;
}