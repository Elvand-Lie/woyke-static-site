import { escapeHtml, formatCurrency, getQuery, nowIso } from '../app/utils.js';
import { categoryName, getProductBySlug, productImage, productImages, productMedia, products } from '../data/catalogue.js';
import { configurationFingerprint } from '../domain/configuration.js';
import { cartRepository } from '../repositories/repositories.js';

const root = document.querySelector('#product-detail');
if (root) {
  const requested = getQuery('product');
  const product = getProductBySlug(requested || products[0].slug);
  if (!product) {
    document.title = 'Piece not found - WOYKE';
    root.innerHTML = `<section class="page-hero" data-header-theme="light"><div class="container"><div class="section-kicker">Collection</div><h1 class="display-lg">This piece is not in the atelier.</h1><p class="lede">The link may be old, or the piece may no longer be part of the current collection.</p><div class="btn-row"><a class="btn" href="/shop/"><span>Browse the collection</span><span>+</span></a><a class="btn btn-secondary" href="/design/"><span>Begin a new design</span></a></div></div></section>`;
  } else {
    document.title = `${product.name} - WOYKE`;
    const images = productImages(product);
    const media = productMedia(product);
    root.innerHTML = `
      <section class="product-stage product-stage-v3" data-header-theme="dark">
        <div class="product-stage-media editorial-product-stage">
          <img id="product-main-image" src="${escapeHtml(images[0])}" alt="${escapeHtml(product.name)}">
          <div class="product-thumbs" aria-label="Product views">${images.map((src, index) => `<button class="product-thumb" aria-selected="${index === 0}" data-image="${escapeHtml(src)}" data-alt="${escapeHtml(`${product.name} view ${index + 1}`)}"><img src="${escapeHtml(src)}" alt=""></button>`).join('')}</div>

        </div>
        <aside class="product-panel">
          <div class="section-kicker">${escapeHtml(product.id)} / ${escapeHtml(categoryName(product.category))}</div>
          <h1>${escapeHtml(product.name)}</h1>
          <p class="product-price">From ${formatCurrency(product.basePrice)}</p>
          <p class="lede">${escapeHtml(product.description)}</p>
          <div class="product-spec-list mono"><div><span>CATEGORY</span><strong>${escapeHtml(categoryName(product.category))}</strong></div><div><span>MATERIALS</span><strong>${escapeHtml(product.materials?.join(', ') || 'Selected in the atelier')}</strong></div><div><span>ATELIER</span><strong>PERSONALISE THE DETAILS</strong></div></div>
          <div class="btn-row"><a class="btn btn-light" href="/design/?product=${encodeURIComponent(product.slug)}"><span>Design this piece</span><span>+</span></a><button class="btn btn-secondary" id="add-base-product" type="button"><span>Add base design</span></button></div>
          <p id="product-status" class="prototype-note" role="status">Use this study as a starting point, then shape the details in the digital atelier.</p>
        </aside>
      </section>
      `;
    root.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => {
      image.closest('.product-thumb')?.remove();
      if (image.id === 'product-main-image') image.closest('.product-stage-media')?.classList.add('media-unavailable');
    }, { once: true }));
    const main = root.querySelector('#product-main-image');
    root.querySelectorAll('.product-thumb').forEach((button) => button.addEventListener('click', () => {
      root.querySelectorAll('.product-thumb').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      main.src = button.dataset.image; main.alt = button.dataset.alt;
    }));
    root.querySelector('#add-base-product')?.addEventListener('click', () => {
      const selections = { category: product.category };
      const selectionLabels = { category: categoryName(product.category) };
      const priceBreakdown = { currency: 'SGD', base: product.basePrice, adjustments: [], engraving: 0, total: product.basePrice };
      const engraving = null; const gift = null;
      cartRepository.add({ productId: product.id, productSlug: product.slug, productName: product.name, preview: { src: productImage(product), match: 'representative', alt: product.name }, quantity: 1, selections, selectionLabels, priceBreakdown, unitPrice: product.basePrice, engraving, gift, fingerprint: configurationFingerprint(product.slug, selections, engraving, gift), createdAt: nowIso() });
      location.href = '/cart/';
    });
  }
}