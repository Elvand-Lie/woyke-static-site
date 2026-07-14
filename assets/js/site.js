const page = document.body.dataset.page || 'home'

const header = document.querySelector('#site-header')
if (header) {
  header.className = 'site-header'
  header.dataset.theme = document.body.dataset.initialHeader || 'dark'
  header.innerHTML = `
    <a class="site-wordmark" href="/" aria-label="WOYKE home">WOYKE</a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="/shop/" data-nav="shop">Shop</a>
      <a href="/design/" data-nav="design">Design</a>
      <a href="/craft/" data-nav="craft">Our craft</a>
      <a href="/materials/" data-nav="materials">Materials</a>
      <a href="/consultation/" data-nav="consultation">Consultation</a>
    </nav>
    <div class="header-actions">
      <button class="language-button" type="button" aria-label="Language prototype">中文</button>
      <a class="icon-button" href="/account/" aria-label="Open account">○</a>
      <a class="icon-button" href="/cart/" aria-label="Open shopping bag">◇</a>
      <button class="icon-button menu-button" type="button" aria-label="Open menu" aria-expanded="false">☰</button>
    </div>`
  header.querySelector(`[data-nav="${page}"]`)?.setAttribute('aria-current', 'page')
}

const mobileMenu = document.querySelector('#mobile-menu')
if (mobileMenu) {
  mobileMenu.className = 'mobile-menu'
  mobileMenu.dataset.open = 'false'
  mobileMenu.innerHTML = `
    <nav aria-label="Mobile navigation">
      <a href="/shop/">Shop</a>
      <a href="/design/">Design your own</a>
      <a href="/craft/">Our craft</a>
      <a href="/materials/">Materials & values</a>
      <a href="/consultation/">Private consultation</a>
      <a href="/account/">Your account</a>
      <a href="/cart/">Shopping bag</a>
    </nav>`
}

const menuButton = document.querySelector('.menu-button')
menuButton?.addEventListener('click', () => {
  const isOpen = mobileMenu?.dataset.open === 'true'
  if (mobileMenu) mobileMenu.dataset.open = String(!isOpen)
  menuButton.setAttribute('aria-expanded', String(!isOpen))
  menuButton.textContent = isOpen ? '☰' : '×'
  document.body.style.overflow = isOpen ? '' : 'hidden'
})

const footer = document.querySelector('#site-footer')
if (footer) {
  footer.className = 'site-footer'
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <div class="footer-brand">WOYKE</div>
        <p class="footer-copy">A guided jewellery atelier for pieces shaped by occasion, material and personal meaning.</p>
      </div>
      <div class="footer-col"><h3>Shop</h3><a href="/shop/">Rings</a><a href="/shop/">Earrings</a><a href="/shop/">Necklaces</a><a href="/shop/">Bracelets</a></div>
      <div class="footer-col"><h3>Atelier</h3><a href="/design/">Design your own</a><a href="/craft/">Craft process</a><a href="/materials/">Materials</a></div>
      <div class="footer-col"><h3>Client care</h3><a href="/consultation/">Consultation</a><a href="/account/">Your account</a><a href="/checkout/">Checkout demo</a><a href="/auth/">Sign in</a></div>
    </div>
    <div class="footer-bottom"><span>© 2026 WOYKE — static visual prototype</span><span>i am, we are.</span></div>`
}

if (header) {
  const sections = [...document.querySelectorAll('[data-header-theme]')]
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) header.dataset.theme = visible.target.dataset.headerTheme || 'light'
  }, { rootMargin: '-38px 0px -72% 0px', threshold: [0, .08, .2, .5] })
  sections.forEach(section => observer.observe(section))
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: .12 })
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target
    if (!(video instanceof HTMLVideoElement)) return
    if (entry.isIntersecting && video.dataset.autoplay === 'true') video.play().catch(() => {})
    if (!entry.isIntersecting) video.pause()
  })
}, { threshold: .22 })
document.querySelectorAll('video').forEach(video => videoObserver.observe(video))

const heroMedia = document.querySelector('[data-hero-optical]')
if (heroMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let frame = 0
  const update = () => {
    frame = 0
    const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)))
    heroMedia.style.setProperty('--hero-progress', progress.toFixed(3))
  }
  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update)
  }, { passive: true })
  update()
}

const languageButton = document.querySelector('.language-button')
languageButton?.addEventListener('click', () => {
  const current = languageButton.textContent.trim()
  languageButton.textContent = current === '中文' ? 'EN' : '中文'
  languageButton.setAttribute('aria-label','Localization demonstration only')
})

const cartRemove = document.querySelector('.cart-actions button')
cartRemove?.addEventListener('click', () => {
  const item = cartRemove.closest('.cart-item')
  item?.remove()
  const items = document.querySelector('.cart-items')
  if (items && !items.querySelector('.cart-item')) items.innerHTML = '<div class="empty-state">Your shopping bag is empty.</div>'
})
