const chips = [...document.querySelectorAll('.filter-chip')]
const cards = [...document.querySelectorAll('.shop-card')]
const search = document.querySelector('#shop-search')

function filterProducts() {
  const category = chips.find((chip) => chip.getAttribute('aria-pressed') === 'true')?.dataset.category || 'all'
  const query = (search?.value || '').trim().toLowerCase()
  cards.forEach((card) => {
    const matchesCategory = category === 'all' || card.dataset.category === category
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query)
    card.hidden = !(matchesCategory && matchesQuery)
  })
}
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((item) => item.setAttribute('aria-pressed', String(item === chip)))
  filterProducts()
}))
search?.addEventListener('input', filterProducts)
