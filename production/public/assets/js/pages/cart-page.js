import { escapeHtml, formatCurrency } from '../app/utils.js';
import { cartTotals } from '../domain/configuration.js';
import { cartRepository } from '../repositories/repositories.js';

const itemsRoot = document.querySelector('#dynamic-cart-items');
const subtotalEl = document.querySelector('#dynamic-cart-subtotal');
const totalEl = document.querySelector('#dynamic-cart-total');
const checkoutLink = document.querySelector('#dynamic-checkout-link');
const clearButton = document.querySelector('#cart-clear');

function specification(line) {
  const rows = Object.entries(line.selectionLabels || {}).filter(([, value]) => value).slice(0, 8);
  if (line.engraving?.text) rows.push(['Engraving', `"${line.engraving.text}"`]);
  if (line.gift?.message) rows.push(['Gift', line.gift.message]);
  return rows;
}

function render() {
  if (!itemsRoot) return;
  const lines = cartRepository.list();
  const totals = cartTotals(lines);
  subtotalEl.textContent = formatCurrency(totals.subtotal);
  totalEl.textContent = formatCurrency(totals.total);
  checkoutLink?.setAttribute('aria-disabled', String(!lines.length));
  clearButton.hidden = !lines.length;
  if (!lines.length) {
    itemsRoot.innerHTML = `<div class="empty-state"><h2>Your shopping bag is empty.</h2><p>Begin with a catalogue piece or start from a blank design.</p><div class="btn-row"><a class="btn" href="/shop/"><span>Browse pieces</span></a><a class="btn btn-secondary" href="/design/"><span>Start designing</span></a></div></div>`;
    return;
  }
  itemsRoot.innerHTML = lines.map((line) => `
    <article class="cart-item" data-line="${escapeHtml(line.id)}">
      <img src="${escapeHtml(line.preview?.src)}" alt="${escapeHtml(line.preview?.alt || line.productName)}">
      <div><p class="mono">CUSTOM DESIGN / ${escapeHtml(line.id.slice(-8).toUpperCase())}</p><h2>${escapeHtml(line.productName)}</h2>
        <dl>${specification(line).map(([key, value]) => `<div><dt>${escapeHtml(key.replaceAll('-', ' '))}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
        <div class="cart-line-controls"><label>Quantity<select data-quantity>${[1,2,3,4,5].map((value) => `<option ${value === line.quantity ? 'selected' : ''}>${value}</option>`).join('')}</select></label><span class="mono">${escapeHtml((line.preview?.match || 'representative').toUpperCase())} PREVIEW</span></div>
        <div class="cart-actions"><a href="/design/?product=${encodeURIComponent(line.productSlug)}&line=${encodeURIComponent(line.id)}">Edit design</a><button type="button" data-remove>Remove</button></div>
      </div><strong>${formatCurrency(line.unitPrice * line.quantity)}</strong>
    </article>`).join('');
  itemsRoot.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => { image.src = '/assets/media/images/product-final.webp'; }, { once: true }));
  itemsRoot.querySelectorAll('[data-line]').forEach((article) => {
    const id = article.dataset.line;
    article.querySelector('[data-remove]').addEventListener('click', () => { cartRepository.remove(id); render(); });
    article.querySelector('[data-quantity]').addEventListener('change', (event) => { cartRepository.quantity(id, event.target.value); render(); });
  });
}

checkoutLink?.addEventListener('click', (event) => { if (checkoutLink.getAttribute('aria-disabled') === 'true') event.preventDefault(); });
clearButton?.addEventListener('click', () => { if (confirm('Clear every piece from your bag?')) { cartRepository.clear(); render(); } });
render();