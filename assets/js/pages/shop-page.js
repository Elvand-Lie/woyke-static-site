import { escapeHtml, formatCurrency } from '../app/utils.js';
import { allCategories, catalogueQuery, categoryName, isLeadMediaProduct, productImage } from '../data/catalogue.js';

const grid = document.querySelector('#shop-grid');
const count = document.querySelector('#shop-count');
const empty = document.querySelector('#shop-empty');
const search = document.querySelector('#shop-search');
const category = document.querySelector('#shop-category');
const sort = document.querySelector('#shop-sort');

if (grid && search && category && sort) {
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  category.innerHTML = `<option value="all">All categories</option>${allCategories.map((value) => `<option value="${value}">${escapeHtml(categoryName(value))}</option>`).join('')}`;
  category.value = allCategories.includes(params.get('category')) ? params.get('category') : 'all';
  sort.value = ['featured', 'price-asc', 'price-desc', 'name'].includes(params.get('sort')) ? params.get('sort') : 'featured';

  function render() {
    const state = { query: search.value, category: category.value, sort: sort.value };
    const results = catalogueQuery(state);
    grid.innerHTML = results.map((product) => `
      <article class="shop-card ${isLeadMediaProduct(product) ? 'featured' : ''}" data-category="${escapeHtml(product.category)}">
        <a href="/product/?product=${encodeURIComponent(product.slug)}">
          <div class="shop-card-media"><img src="${escapeHtml(productImage(product))}" alt="${escapeHtml(product.name)}" loading="lazy"></div>
          <div class="shop-card-info"><div><p class="mono">${escapeHtml(categoryName(product.category))}</p><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.materials?.slice(0, 2).join(' / ') || 'Customisable')}</p></div><span class="mono">${formatCurrency(product.basePrice)}</span></div>
        </a>
      </article>`).join('');
    grid.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => {
      image.closest('.shop-card-media')?.classList.add('media-unavailable');
      image.remove();
    }, { once: true }));
    count.textContent = `${results.length} ${results.length === 1 ? 'piece' : 'pieces'}`;
    empty.hidden = results.length > 0;
    grid.hidden = results.length === 0;
    const next = new URLSearchParams();
    if (state.query.trim()) next.set('q', state.query.trim());
    if (state.category !== 'all') next.set('category', state.category);
    if (state.sort !== 'featured') next.set('sort', state.sort);
    history.replaceState({}, '', `${location.pathname}${next.size ? `?${next}` : ''}`);
  }
  [search, category, sort].forEach((control) => control.addEventListener(control === search ? 'input' : 'change', render));
  render();
}