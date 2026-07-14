const CART_KEY = 'woyke-cart-v1';
const itemsRoot = document.querySelector('#dynamic-cart-items');
const subtotalEl = document.querySelector('#dynamic-cart-subtotal');
const totalEl = document.querySelector('#dynamic-cart-total');
const checkoutLink = document.querySelector('#dynamic-checkout-link');

function parseCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function money(value) {
  return `SGD ${Number(value || 0).toLocaleString('en-SG')}`;
}

function importantSpecs(item) {
  const labels = item.selectionLabels || {};
  const preferred = [
    ['Category', labels.category],
    ['Stone', labels.stone],
    ['Shape', labels['stone-shape']],
    ['Metal', [labels.colour, labels.metal].filter(Boolean).join(' ')],
    ['Size', labels['ring-sizing-10'] || labels['bracelet-sizing-10'] || labels['bangle-sizing-10'] || labels['necklace-sizing-10'] || labels['anklet-sizing-10'] || labels['no-sizing-10']],
  ];
  if (item.engraving) preferred.push(['Engraving', `“${item.engraving}”`]);
  return preferred.filter(([, value]) => value).slice(0, 6);
}

function render() {
  const cart = parseCart();
  itemsRoot.innerHTML = '';

  if (!cart.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const title = document.createElement('h2');
    title.textContent = 'Your shopping bag is empty.';
    const copy = document.createElement('p');
    copy.textContent = 'Begin in the digital atelier and your configured piece will appear here.';
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = '/design/';
    link.innerHTML = '<span>Start designing</span><span>↗</span>';
    empty.append(title, copy, link);
    itemsRoot.append(empty);
    subtotalEl.textContent = money(0);
    totalEl.textContent = money(0);
    checkoutLink.setAttribute('aria-disabled', 'true');
    checkoutLink.addEventListener('click', preventDisabledCheckout, { once: true });
    return;
  }

  checkoutLink.removeAttribute('aria-disabled');
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += Number(item.price || 0) * Number(item.quantity || 1);
    const article = document.createElement('article');
    article.className = 'cart-item';

    const image = document.createElement('img');
    image.src = item.image || '/assets/media/images/ring-radiant-floral.webp';
    image.alt = item.productName || 'Configured WOYKE piece';
    image.addEventListener('error', () => {
      image.src = '/assets/media/images/ring-radiant-floral.webp';
    }, { once: true });

    const details = document.createElement('div');
    const meta = document.createElement('p');
    meta.className = 'mono';
    meta.textContent = `CUSTOM DESIGN / ${String(item.id || '').slice(-8).toUpperCase()}`;
    const title = document.createElement('h2');
    title.textContent = item.productName || 'WOYKE Custom Design';
    const dl = document.createElement('dl');

    importantSpecs(item).forEach(([key, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = key;
      dd.textContent = value;
      row.append(dt, dd);
      dl.append(row);
    });

    const actions = document.createElement('div');
    actions.className = 'cart-actions';
    const edit = document.createElement('a');
    edit.href = `/design/?product=${encodeURIComponent(item.productSlug || 'imperial-jade-bloom-ring')}`;
    edit.textContent = 'Edit design';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      saveCart(parseCart().filter((candidate) => candidate.id !== item.id));
      render();
    });
    actions.append(edit, remove);
    details.append(meta, title, dl, actions);

    const price = document.createElement('strong');
    price.textContent = money(Number(item.price || 0) * Number(item.quantity || 1));
    article.append(image, details, price);
    itemsRoot.append(article);
  });

  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(subtotal);
}

function preventDisabledCheckout(event) {
  if (checkoutLink.getAttribute('aria-disabled') === 'true') event.preventDefault();
}

render();
