export const APP_SCHEMA_VERSION = 1;

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix = 'wy') {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${random}`;
}

export function formatCurrency(value, currency = 'SGD') {
  return `${currency} ${new Intl.NumberFormat('en-SG', { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;
}

export function formatDate(value, options = {}) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-SG', { dateStyle: 'medium', ...options }).format(date);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function getQuery(name, fallback = '') {
  const value = new URLSearchParams(location.search).get(name);
  return typeof value === 'string' ? value.trim() : fallback;
}

export function safeReturnUrl(value, fallback = '/') {
  if (!value || typeof value !== 'string') return fallback;
  try {
    const url = new URL(value, location.origin);
    return url.origin === location.origin && url.pathname.startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeObject(value) {
  if (Array.isArray(value)) return value.map(normalizeObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalizeObject(value[key])]).filter(([, item]) => item !== undefined));
  }
  return value;
}

export function fingerprint(value) {
  const input = JSON.stringify(normalizeObject(value));
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `cfg-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function setStatus(node, message, tone = 'info') {
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
  node.hidden = !message;
}