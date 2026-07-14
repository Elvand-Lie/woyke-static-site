const mainImage = document.querySelector('#product-main-image')
const thumbs = [...document.querySelectorAll('.product-thumb')]
thumbs.forEach((button) => button.addEventListener('click', () => {
  thumbs.forEach((item) => item.setAttribute('aria-selected', String(item === button)))
  mainImage.animate([{ opacity: .25, transform: 'scale(1.02)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' })
  mainImage.src = button.dataset.image
  mainImage.alt = button.dataset.alt
}))
