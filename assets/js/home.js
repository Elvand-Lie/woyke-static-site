const occasionData = [
  { title:'First Paycheck', phrase:'Mark the first thing that was entirely yours.', meta:'FORM / RING · MOOD / ARRIVAL', image:'/assets/media/images/ring-radiant-floral.webp' },
  { title:'Proposal', phrase:'Begin with a piece that can carry the next chapter.', meta:'FORM / RING · MOOD / PROMISE', image:'/assets/media/images/ring-pear-close.webp' },
  { title:'Graduation', phrase:'A quiet object for the moment the world opens wider.', meta:'FORM / NECKLACE · MOOD / BEGINNING', image:'/assets/media/images/necklace-princess.webp' },
  { title:'Self Gift', phrase:'No permission, no explanation, no smaller version.', meta:'FORM / BRACELET · MOOD / OWNERSHIP', image:'/assets/media/images/bracelet-radiant.webp' },
  { title:'Anniversary', phrase:'A familiar story, seen again with more detail.', meta:'FORM / NECKLACE · MOOD / CONTINUITY', image:'/assets/media/images/necklace-heart.webp' },
  { title:'Just Because', phrase:'The most personal pieces do not always need a reason.', meta:'FORM / PENDANT · MOOD / SPONTANEITY', image:'/assets/media/images/necklace-emerald.webp' }
]
const occasionStage = document.querySelector('#occasion-stage')
const occasionImage = document.querySelector('#occasion-image')
const occasionTitle = document.querySelector('#occasion-active-title')
const occasionPhrase = document.querySelector('#occasion-active-phrase')
const occasionMeta = document.querySelector('#occasion-active-meta')
const occasionButtons = [...document.querySelectorAll('[data-occasion-index]')]
let occasionToken = 0
function activateOccasion(index) {
  const item = occasionData[index]
  if (!item || !occasionStage || !occasionImage) return
  occasionButtons.forEach((button, i) => button.setAttribute('aria-selected', String(i === index)))
  const token = ++occasionToken
  occasionStage.classList.add('is-changing')
  const preload = new Image()
  preload.src = item.image
  const commit = () => {
    if (token !== occasionToken) return
    occasionImage.src = item.image
    occasionImage.alt = `${item.title} jewellery inspiration`
    occasionTitle.textContent = item.title
    occasionPhrase.textContent = item.phrase
    occasionMeta.textContent = item.meta
    requestAnimationFrame(() => occasionStage.classList.remove('is-changing'))
  }
  preload.onload = commit
  preload.onerror = () => occasionStage.classList.remove('is-changing')
  if (preload.complete) commit()
}
occasionButtons.forEach(button => {
  const index = Number(button.dataset.occasionIndex)
  button.addEventListener('mouseenter', () => activateOccasion(index))
  button.addEventListener('focus', () => activateOccasion(index))
  button.addEventListener('click', () => activateOccasion(index))
})

const craftData = [
  { name:'Setting', file:'setting.mp4', poster:'setting.jpg' },
  { name:'Adjustment', file:'adjustment.mp4', poster:'adjustment.jpg' },
  { name:'Assembly', file:'assembly.mp4', poster:'assembly.jpg' },
  { name:'Polish', file:'polish.mp4', poster:'polish.jpg' },
  { name:'Finish', file:'finish.mp4', poster:'finish.jpg' }
]
const craftVideo = document.querySelector('#craft-video')
const craftLabel = document.querySelector('#craft-label')
const craftButtons = [...document.querySelectorAll('[data-craft-index]')]
const craftPlay = document.querySelector('#craft-play')
let activeCraft = 0
function activateCraft(index) {
  const item = craftData[index]
  if (!item || !craftVideo || index === activeCraft && craftVideo.currentSrc) return
  activeCraft = index
  craftButtons.forEach((button, i) => button.setAttribute('aria-selected', String(i === index)))
  craftVideo.pause()
  craftVideo.poster = `/assets/media/posters/${item.poster}`
  craftVideo.src = `/assets/media/videos/${item.file}`
  craftVideo.load()
  craftVideo.addEventListener('canplay', () => craftVideo.play().catch(() => {}), { once:true })
  craftLabel.textContent = `${String(index + 1).padStart(2,'0')} / ${item.name.toUpperCase()}`
  craftPlay.textContent = 'Ⅱ'
  craftPlay.setAttribute('aria-label','Pause craft film')
}
craftButtons.forEach(button => button.addEventListener('click', () => activateCraft(Number(button.dataset.craftIndex))))
craftPlay?.addEventListener('click', () => {
  if (!craftVideo) return
  if (craftVideo.paused) {
    craftVideo.play().catch(() => {})
    craftPlay.textContent = 'Ⅱ'
    craftPlay.setAttribute('aria-label','Pause craft film')
  } else {
    craftVideo.pause()
    craftPlay.textContent = '▶'
    craftPlay.setAttribute('aria-label','Play craft film')
  }
})

const products = [
  { name:'Imperial Jade Bloom Ring', price:'SGD 12,800', meta:'Imperial jade · Platinum 950', image:'/assets/media/images/jade-final-statement.webp' },
  { name:'Radiant Floral Ring', price:'SGD 13,500', meta:'Lab diamond · Yellow gold', image:'/assets/media/images/ring-radiant-floral.webp' },
  { name:'Heart Halo Necklace', price:'SGD 7,900', meta:'Heart diamond · 18K yellow gold', image:'/assets/media/images/necklace-heart.webp' },
  { name:'Radiant Line Bracelet', price:'SGD 9,400', meta:'Radiant diamond · 18K yellow gold', image:'/assets/media/images/bracelet-radiant.webp' },
  { name:'Emerald Pendant', price:'SGD 8,800', meta:'Emerald cut · Platinum 950', image:'/assets/media/images/necklace-emerald.webp' }
]
const lead = document.querySelector('#collection-lead')
const leadImage = lead?.querySelector('img')
const leadName = document.querySelector('#collection-name')
const leadPrice = document.querySelector('#collection-price')
const leadMeta = document.querySelector('#collection-meta')
const leadIndex = document.querySelector('#collection-index')
const productButtons = [...document.querySelectorAll('[data-product-index]')]
let productToken = 0
function activateProduct(index) {
  const item = products[index]
  if (!item || !lead || !leadImage) return
  productButtons.forEach((button, i) => button.setAttribute('aria-selected', String(i === index)))
  const token = ++productToken
  lead.classList.add('is-changing')
  const preload = new Image()
  preload.src = item.image
  const commit = () => {
    if (token !== productToken) return
    leadImage.src = item.image
    leadImage.alt = item.name
    leadName.textContent = item.name
    leadPrice.textContent = item.price
    leadMeta.textContent = item.meta
    leadIndex.textContent = `${String(index + 1).padStart(2,'0')} / 05`
    requestAnimationFrame(() => lead.classList.remove('is-changing'))
  }
  preload.onload = commit
  preload.onerror = () => lead.classList.remove('is-changing')
  if (preload.complete) commit()
}
productButtons.forEach(button => {
  const index = Number(button.dataset.productIndex)
  button.addEventListener('mouseenter', () => activateProduct(index))
  button.addEventListener('focus', () => activateProduct(index))
  button.addEventListener('click', () => activateProduct(index))
})
