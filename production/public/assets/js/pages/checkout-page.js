import { createId, escapeHtml, formatCurrency, setStatus } from '../app/utils.js';
import { cartTotals } from '../domain/configuration.js';
import { cartRepository, sessionRepository } from '../repositories/repositories.js';
import { authService, checkoutService } from '../services/services.js';

const session = authService.requireSession();
const form = document.querySelector('#checkout-form');
const summary = document.querySelector('#checkout-summary-lines');
const status = document.querySelector('#checkout-status');
const submit = form?.querySelector('button[type="submit"]');
const lines = cartRepository.list();

function errorFor(input, message) {
  const node = form.querySelector(`[data-error-for="${input.name}"]`);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (node) node.textContent = message || '';
}

function validate() {
  let valid = true;
  [...form.elements].filter((input) => input.name && input.required).forEach((input) => {
    let message = '';
    if (input.type === 'checkbox' && !input.checked) message = 'Please confirm this demo condition.';
    else if (!input.value.trim()) message = 'This field is required.';
    else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) message = 'Enter a valid email address.';
    errorFor(input, message); if (message) valid = false;
  });
  return valid;
}

if (session && form) {
  form.elements.email.value = session.email || '';
  form.elements.phone.value = session.phone || '';
  form.elements.name.value = session.displayName || '';
}
if (summary) {
  const totals = cartTotals(lines);
  summary.innerHTML = lines.length ? `${lines.map((line) => `<article><img src="${escapeHtml(line.preview?.src)}" alt="${escapeHtml(line.preview?.alt || line.productName)}"><div><h2>${escapeHtml(line.productName)}</h2><p>${escapeHtml(Object.values(line.selectionLabels || {}).filter(Boolean).slice(0,3).join(' / '))}</p><span class="mono">QTY ${line.quantity}</span></div><strong>${formatCurrency(line.unitPrice * line.quantity)}</strong></article>`).join('')}<div><span>Subtotal</span><strong>${formatCurrency(totals.subtotal)}</strong></div><div><span>Insured delivery</span><span>Complimentary demo</span></div><div class="order-total"><span>Total</span><strong>${formatCurrency(totals.total)}</strong></div>` : `<div class="empty-state"><h2>There is nothing to check out.</h2><p>Your bag may have been completed in another tab.</p><a class="btn" href="/shop/"><span>Return to the collection</span></a></div>`;
  summary.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => { image.src='/assets/media/images/product-final.webp'; }, { once:true }));
  if (!lines.length) { submit.disabled = true; setStatus(status, 'Add a configured piece before checking out.', 'error'); }
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) { setStatus(status, 'Review the highlighted fields.', 'error'); form.querySelector('[aria-invalid="true"]')?.focus(); return; }
  if (submit.disabled) return;
  submit.disabled = true; setStatus(status, 'Creating one local demo order...');
  const data = new FormData(form);
  const submissionId = form.dataset.submissionId || createId('submission'); form.dataset.submissionId = submissionId;
  try {
    const order = checkoutService.createOrder({
      submissionId,
      customer: { name: data.get('name').trim(), email: data.get('email').trim(), phone: data.get('phone').trim() },
      delivery: { address1: data.get('address1').trim(), address2: data.get('address2').trim(), city: data.get('city').trim(), postalCode: data.get('postal').trim(), country: data.get('country') },
      paymentMethodLabel: data.get('payment') || 'Card demonstration',
    });
    location.replace(`/checkout/success/?order=${encodeURIComponent(order.id)}`);
  } catch (error) {
    submit.disabled = false;
    setStatus(status, error.message === 'EMPTY_CART' ? 'Your bag is empty. No order was created.' : 'The local demo order could not be created.', 'error');
  }
});
form?.addEventListener('input', (event) => { if (event.target.name) errorFor(event.target, ''); });