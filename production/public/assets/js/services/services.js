import { clone, createId, nowIso, safeReturnUrl } from '../app/utils.js';
import { cartTotals } from '../domain/configuration.js';
import { cartRepository, orderRepository, sessionRepository } from '../repositories/repositories.js';

export const DEMO_USER = {
  userId: 'demo-user', displayName: 'WOYKE Guest', email: 'demo@woyke.example',
  phone: '+65 8123 4567', isDemo: true,
};

export const authService = {
  signIn() {
    const existing = sessionRepository.get();
    const session = { ...DEMO_USER, createdAt: existing?.createdAt || nowIso(), signedInAt: nowIso() };
    sessionRepository.set(session);
    return session;
  },
  signOut() { sessionRepository.clear(); },
  requireSession(returnUrl = `${location.pathname}${location.search}`) {
    const session = sessionRepository.get();
    if (session) return session;
    location.replace(`/auth/?return=${encodeURIComponent(safeReturnUrl(returnUrl, '/account/'))}`);
    return null;
  },
};

export const checkoutService = {
  createOrder({ customer, delivery, paymentMethodLabel, submissionId }) {
    const session = sessionRepository.get();
    if (!session) throw new Error('AUTH_REQUIRED');
    const lines = cartRepository.list();
    if (!lines.length) throw new Error('EMPTY_CART');
    const duplicate = orderRepository.list(session.userId).find((order) => order.submissionId === submissionId);
    if (duplicate) return duplicate;
    const totals = cartTotals(lines);
    const id = createId('order');
    const reference = `WY-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${id.slice(-4).toUpperCase()}`;
    const order = {
      id, reference, submissionId, ownerUserId: session.userId, status: 'confirmed-demo',
      customer: clone(customer), delivery: clone(delivery), lines: clone(lines), totals,
      paymentMethodLabel, isDemo: true, createdAt: nowIso(), updatedAt: nowIso(),
    };
    const saved = orderRepository.save(order);
    cartRepository.clear();
    sessionStorage.setItem('woyke.lastOrder', saved.id);
    return saved;
  },
};