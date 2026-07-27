import { fingerprint } from '../app/utils.js';

export function configurationFingerprint(productSlug, selections, engraving, gift) {
  return fingerprint({ productSlug, selections, engraving: engraving || null, gift: gift || null });
}

export function safeLineTotal(line) {
  const unit = Math.max(0, Number(line?.unitPrice ?? line?.priceBreakdown?.total ?? line?.price ?? 0) || 0);
  const quantity = Math.max(1, Math.min(10, Math.trunc(Number(line?.quantity) || 1)));
  return unit * quantity;
}

export function cartTotals(lines) {
  const subtotal = (Array.isArray(lines) ? lines : []).reduce((sum, line) => sum + safeLineTotal(line), 0);
  return { subtotal, shipping: 0, total: subtotal, currency: 'SGD' };
}

export function normalizeCartLine(line) {
  if (!line || typeof line !== 'object') return null;
  const preview = typeof line.preview === 'object'
    ? line.preview
    : { src: line.image || '/assets/media/images/product-final.webp', match: line.previewMatch || 'representative', alt: line.productName || 'Configured WOYKE piece' };
  const engraving = typeof line.engraving === 'object'
    ? line.engraving
    : line.engraving ? { text: String(line.engraving), font: line.engravingFont || 'script' } : null;
  const gift = typeof line.gift === 'object'
    ? line.gift
    : line.giftMessage ? { message: String(line.giftMessage), wrapping: line.selections?.gift || 'standard' } : null;
  const priceBreakdown = line.priceBreakdown || { currency: 'SGD', base: Number(line.price) || 0, adjustments: [], engraving: engraving ? 50 : 0, total: Number(line.price) || 0 };
  const fingerprintValue = line.fingerprint || configurationFingerprint(line.productSlug, line.selections || {}, engraving, gift);
  return { ...line, preview, engraving, gift, priceBreakdown, fingerprint: fingerprintValue, unitPrice: Math.max(0, Number(line.unitPrice ?? priceBreakdown.total ?? line.price) || 0), quantity: Math.max(1, Math.min(10, Math.trunc(Number(line.quantity) || 1))) };
}