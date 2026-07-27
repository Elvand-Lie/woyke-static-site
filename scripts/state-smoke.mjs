const memory = new Map();
const storage = {
  getItem: (key) => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
};
globalThis.localStorage = storage;
globalThis.sessionStorage = storage;

const { fingerprint } = await import('../assets/js/app/utils.js');
const { cartRepository, orderRepository, sessionRepository, shareRepository } = await import('../assets/js/repositories/repositories.js');
const { checkoutService } = await import('../assets/js/services/services.js');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

localStorage.setItem('woyke.cart.v1', '{malformed');
assert(cartRepository.list().length === 0, 'Malformed cart did not recover');

function line(stone) {
  const selections = { category: 'ring', stone };
  const fp = fingerprint({ productSlug: 'test-ring', selections });
  return {
    productId: 'test', productSlug: 'test-ring', productName: 'Test Ring',
    preview: { src: '/assets/media/images/product-final.webp', match: 'representative', alt: 'Test Ring' },
    selections, selectionLabels: { category: 'Ring', stone }, engraving: null, gift: null,
    priceBreakdown: { currency: 'SGD', base: 1000, adjustments: [], engraving: 0, total: 1000 },
    unitPrice: 1000, quantity: 1, fingerprint: fp,
  };
}

cartRepository.add(line('diamond'));
cartRepository.add(line('ruby'));
assert(cartRepository.list().length === 2, 'Distinct configurations were merged');
cartRepository.add(line('diamond'));
assert(cartRepository.list().find((item) => item.selections.stone === 'diamond').quantity === 2, 'Identical configuration did not update safely');

sessionRepository.set({ userId: 'demo-user', displayName: 'Demo', email: 'demo@example.com', phone: '+65 8000 0000', isDemo: true });
const order = checkoutService.createOrder({ submissionId: 'once', customer: { name: 'Demo', email: 'demo@example.com', phone: '+65 8000 0000' }, delivery: { address1: '1 Demo Street', address2: '', city: 'Singapore', postalCode: '018956', country: 'Singapore' }, paymentMethodLabel: 'Card demonstration' });
const duplicate = orderRepository.save({ ...order, id: 'another-id' });
assert(duplicate.id === order.id, 'Duplicate submission was not deduplicated');
assert(orderRepository.list('demo-user').length === 1, 'Unexpected order count');
assert(cartRepository.list().length === 0, 'Cart was not cleared after order persistence');

const publicRecord = shareRepository.create({ id: 'design-test', productSlug: 'test-ring', productName: 'Test Ring', preview: line('diamond').preview, selectionLabels: { stone: 'Diamond' }, narrative: 'A test design.', priceBreakdown: { total: 1000 }, ownerUserId: 'private', email: 'private@example.com' });
assert(!('email' in publicRecord) && !('ownerUserId' in publicRecord), 'Share snapshot leaked private fields');
console.log('PASS state repositories, malformed recovery, fingerprints, order idempotency, and share sanitization');