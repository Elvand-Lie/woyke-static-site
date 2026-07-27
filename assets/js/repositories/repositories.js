import { clone, createId, nowIso } from '../app/utils.js';
import { normalizeCartLine } from '../domain/configuration.js';
import { readDocument, removeDocument, updateDocument, writeDocument } from './storage.js';

export const KEYS = {
  session: 'woyke.session.v1',
  cart: 'woyke.cart.v1',
  designs: 'woyke.designs.v1',
  orders: 'woyke.orders.v1',
  shares: 'woyke.shares.v1',
  consultations: 'woyke.consultations.v1',
  draft: (slug) => `woyke.configurator.v1.${slug}`,
};

const arrayValidator = (value) => Array.isArray(value);
const objectOrNull = (value) => value === null || Boolean(value && typeof value === 'object' && !Array.isArray(value));

export const sessionRepository = {
  get: () => readDocument(KEYS.session, null, objectOrNull),
  set: (session) => writeDocument(KEYS.session, session),
  clear: () => removeDocument(KEYS.session),
};

export const cartRepository = {
  list() { return readDocument(KEYS.cart, [], arrayValidator).map(normalizeCartLine).filter(Boolean); },
  save(lines) { return writeDocument(KEYS.cart, lines.map(normalizeCartLine).filter(Boolean)); },
  add(line) {
    const normalized = normalizeCartLine(line);
    return updateDocument(KEYS.cart, [], arrayValidator, (lines) => {
      const current = lines.map(normalizeCartLine).filter(Boolean);
      const existing = current.find((item) => item.fingerprint === normalized.fingerprint && !line.id);
      if (existing) return current.map((item) => item.id === existing.id ? { ...item, quantity: Math.min(10, item.quantity + normalized.quantity), updatedAt: nowIso() } : item);
      const id = line.id || createId('line');
      const next = { ...normalized, id, createdAt: line.createdAt || nowIso(), updatedAt: nowIso() };
      const index = current.findIndex((item) => item.id === id);
      if (index >= 0) current[index] = next; else current.push(next);
      return current;
    });
  },
  get(id) { return this.list().find((line) => line.id === id) || null; },
  quantity(id, quantity) { return this.save(this.list().map((line) => line.id === id ? { ...line, quantity: Math.max(1, Math.min(10, Number(quantity) || 1)), updatedAt: nowIso() } : line)); },
  remove(id) { return this.save(this.list().filter((line) => line.id !== id)); },
  clear() { writeDocument(KEYS.cart, []); },
};

export const draftRepository = {
  get(slug) {
    const value = readDocument(KEYS.draft(slug), null, objectOrNull);
    if (value) return value;
    try {
      const legacy = JSON.parse(localStorage.getItem(`woyke-configurator-v2:${slug}`) || 'null');
      if (legacy && typeof legacy === 'object') { this.set(slug, legacy); return legacy; }
    } catch { /* malformed legacy draft is ignored */ }
    return null;
  },
  set(slug, draft) { return writeDocument(KEYS.draft(slug), draft); },
  clear(slug) { removeDocument(KEYS.draft(slug)); localStorage.removeItem(`woyke-configurator-v2:${slug}`); },
};

export const designRepository = {
  list(ownerUserId) { return readDocument(KEYS.designs, [], arrayValidator).filter((item) => !ownerUserId || item.ownerUserId === ownerUserId); },
  get(id) { return readDocument(KEYS.designs, [], arrayValidator).find((item) => item.id === id) || null; },
  save(design) {
    const all = readDocument(KEYS.designs, [], arrayValidator);
    const id = design.id || createId('design');
    const existing = all.find((item) => item.id === id);
    const next = { ...clone(design), id, createdAt: existing?.createdAt || design.createdAt || nowIso(), updatedAt: nowIso() };
    writeDocument(KEYS.designs, existing ? all.map((item) => item.id === id ? next : item) : [...all, next]);
    return next;
  },
  duplicate(id, ownerUserId) {
    const source = this.get(id);
    if (!source) return null;
    const { id: ignored, createdAt, updatedAt, ...copy } = source;
    return this.save({ ...copy, id: undefined, ownerUserId, name: `${source.name || source.productName} — copy` });
  },
  remove(id, ownerUserId) { writeDocument(KEYS.designs, readDocument(KEYS.designs, [], arrayValidator).filter((item) => item.id !== id || item.ownerUserId !== ownerUserId)); },
};

export const orderRepository = {
  list(ownerUserId) { return readDocument(KEYS.orders, [], arrayValidator).filter((item) => !ownerUserId || item.ownerUserId === ownerUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  get(value) { return readDocument(KEYS.orders, [], arrayValidator).find((item) => item.id === value || item.reference === value) || null; },
  save(order) {
    const all = readDocument(KEYS.orders, [], arrayValidator);
    const existing = all.find((item) => item.id === order.id || item.submissionId === order.submissionId);
    if (existing) return existing;
    writeDocument(KEYS.orders, [...all, clone(order)]);
    return order;
  },
};

export const shareRepository = {
  list: () => readDocument(KEYS.shares, [], arrayValidator),
  get(id) { const record = this.list().find((item) => item.id === id); return record && !record.revokedAt ? record : null; },
  create(design) {
    const existing = this.list().find((item) => item.designId === design.id && !item.revokedAt);
    if (existing) return existing;
    const record = {
      id: createId('share'), designId: design.id, productSlug: design.productSlug,
      productName: design.productName || design.name, preview: clone(design.preview),
      selectionLabels: clone(design.selectionLabels || {}), narrative: design.narrative || '',
      indicativeTotal: Number(design.priceBreakdown?.total || 0), hidePrice: Boolean(design.gift?.hidePrice),
      createdAt: nowIso(), revokedAt: null,
    };
    writeDocument(KEYS.shares, [...this.list(), record]);
    return record;
  },
  revoke(id) { writeDocument(KEYS.shares, this.list().map((item) => item.id === id ? { ...item, revokedAt: nowIso() } : item)); },
};

export const consultationRepository = {
  create(input) {
    const records = readDocument(KEYS.consultations, [], arrayValidator);
    const stamp = Date.now().toString().slice(-6);
    const record = { ...clone(input), id: createId('consult'), reference: `WYC-${stamp}`, isDemo: true, createdAt: nowIso() };
    writeDocument(KEYS.consultations, [...records, record]);
    return record;
  },
};