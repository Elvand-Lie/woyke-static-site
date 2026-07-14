const steps = [
  { label:'Occasion', question:'Begin with a reason.', copy:'Choose the moment this piece should remember.', options:['First Paycheck','Proposal','Wedding','Anniversary','Birthday','Graduation','Self Gift','Just Because'] },
  { label:'Category', question:'Choose the form it takes.', copy:'The silhouette sets the foundation for every later decision.', options:['Ring','Stud Earrings','Dangling Earrings','Pendant','Necklace','Bracelet','Bangle','Brooch','Anklet'] },
  { label:'Interchangeability', question:'Decide how it can change.', copy:'Select a second life for the central component.', options:['Ring ↔ Pendant','Bar ↔ Charm','Pendant ↔ Necklace','Not interchangeable'] },
  { label:'Main Stone', question:'Choose your centre.', copy:'Some stones speak softly. Others enter the room first.', options:['Diamond','Emerald','Jade','Sapphire','Ruby','Amethyst','Aquamarine','Citrine'] },
  { label:'Side Stones', question:'Add a second voice.', copy:'Frame the centre or leave it uninterrupted.', options:['None','One each side','Halo','Asymmetric'] },
  { label:'Metal', question:'Choose what holds it together.', copy:'Metal changes the temperature and weight of the design.', options:['18K Yellow Gold','18K White Gold','18K Rose Gold','Platinum 950'] },
  { label:'Colour', question:'Choose how it catches the light.', copy:'A change in tone can change the entire reading of a piece.', options:['Yellow','White','Rose','Black'] },
  { label:'Details', question:'Shape the character.', copy:'Choose the profile, setting and finish.', options:['Polished','Satin','Hammered','Architectural'] },
  { label:'Engraving', question:'Leave something only they know.', copy:'A private line, name or date — up to 30 characters.', options:['Add engraving','No engraving','Script','Modern block'] },
  { label:'Sizing', question:'Make it belong.', copy:'Choose the size or request a complimentary sizing guide.', options:['Size 6','Size 7','Size 8','Request guide'] },
  { label:'Gift', question:'Decide how it arrives.', copy:'Finish the ritual with a message and presentation.', options:['WOYKE box','Premium wrap','Hide price','Gift message'] }
]

const previewByCategory = {
  Ring:'/assets/media/images/ring-radiant-floral.webp',
  'Stud Earrings':'/assets/media/images/hero-wide.webp',
  'Dangling Earrings':'/assets/media/images/hero-portrait.webp',
  Pendant:'/assets/media/images/necklace-heart.webp',
  Necklace:'/assets/media/images/necklace-princess.webp',
  Bracelet:'/assets/media/images/bracelet-radiant.webp',
  Bangle:'/assets/media/images/bracelet-bar.webp',
  Brooch:'/assets/media/images/jade-final-statement.webp',
  Anklet:'/assets/media/images/bracelet-charm.webp'
}
const previewByStone = {
  Diamond:'/assets/media/images/ring-radiant-floral.webp',
  Emerald:'/assets/media/images/necklace-emerald.webp',
  Jade:'/assets/media/images/jade-final-statement.webp',
  Sapphire:'/assets/media/images/necklace-princess.webp',
  Ruby:'/assets/media/images/ring-radiant-floral.webp',
  Amethyst:'/assets/media/images/necklace-heart.webp',
  Aquamarine:'/assets/media/images/necklace-emerald.webp',
  Citrine:'/assets/media/images/bracelet-radiant.webp'
}
const macroByStone = {
  Diamond:'/assets/media/images/ring-pear-close.webp',
  Emerald:'/assets/media/images/necklace-emerald.webp',
  Jade:'/assets/media/images/jade-dark.webp',
  Sapphire:'/assets/media/images/necklace-princess.webp',
  Ruby:'/assets/media/images/ring-radiant-floral.webp',
  Amethyst:'/assets/media/images/necklace-heart.webp',
  Aquamarine:'/assets/media/images/necklace-emerald.webp',
  Citrine:'/assets/media/images/bracelet-radiant.webp'
}

let index = 0
const state = { category:'Ring', stone:'Diamond', metal:'18K Yellow Gold' }
const label = document.querySelector('#config-label')
const question = document.querySelector('#config-question-title')
const copy = document.querySelector('#config-copy')
const options = document.querySelector('#config-options')
const current = document.querySelector('#config-current')
const fill = document.querySelector('#config-fill')
const next = document.querySelector('#config-next')
const back = document.querySelector('#config-back')
const previewStage = document.querySelector('.config-photo-stage')
const previewImage = document.querySelector('#config-preview-image')
const macroImage = document.querySelector('#config-macro-image')
const specForm = document.querySelector('#preview-form-label')
const specStone = document.querySelector('#preview-stone-label')
const specMetal = document.querySelector('#preview-metal-label')
const price = document.querySelector('#preview-price-value')
const designName = document.querySelector('#preview-design-name')
const designCopy = document.querySelector('#preview-design-copy')

function updatePreview(image, macro = null) {
  if (!previewImage || !image) return
  previewStage?.classList.add('is-changing')
  const preload = new Image()
  preload.src = image
  const commit = () => {
    previewImage.src = image
    if (macro && macroImage) macroImage.src = macro
    requestAnimationFrame(() => previewStage?.classList.remove('is-changing'))
  }
  preload.onload = commit
  preload.onerror = () => previewStage?.classList.remove('is-changing')
  if (preload.complete) commit()
}

function updatePrice() {
  const base = 4200
  const stoneCost = { Diamond:1800, Emerald:1300, Jade:2400, Sapphire:1100, Ruby:1250, Amethyst:700, Aquamarine:850, Citrine:620 }[state.stone] || 900
  const metalCost = { '18K Yellow Gold':700, '18K White Gold':850, '18K Rose Gold':780, 'Platinum 950':1600 }[state.metal] || 700
  price.textContent = `SGD ${(base + stoneCost + metalCost + index * 120).toLocaleString('en-SG')}`
}

function selectOption(step, option) {
  if (step.label === 'Category') {
    state.category = option
    specForm.textContent = `FORM / ${option.toUpperCase()}`
    designName.textContent = `${option} study`
    designCopy.textContent = 'The preview shifts to the closest available photographic form.'
    updatePreview(previewByCategory[option])
  }
  if (step.label === 'Main Stone') {
    state.stone = option
    specStone.textContent = `STONE / ${option.toUpperCase()}`
    designName.textContent = `${option} at the centre`
    designCopy.textContent = 'The stone changes the visual temperature and the way the piece attracts light.'
    updatePreview(previewByStone[option], macroByStone[option])
    const colors = { Diamond:'#dbe8ef', Emerald:'#176a50', Jade:'#1a8b59', Sapphire:'#244b92', Ruby:'#9e1b32', Amethyst:'#76518f', Aquamarine:'#71aebb', Citrine:'#d49a2a' }
    previewStage?.style.setProperty('--stone-color', colors[option] || '#dbe8ef')
  }
  if (step.label === 'Metal') {
    state.metal = option
    specMetal.textContent = `METAL / ${option.toUpperCase()}`
    const colors = { '18K Yellow Gold':'#d4af4a', '18K White Gold':'#d7dadd', '18K Rose Gold':'#c77a73', 'Platinum 950':'#b8c2c8' }
    previewStage?.style.setProperty('--metal-color', colors[option] || '#d4af4a')
  }
  updatePrice()
}

function render() {
  const step = steps[index]
  label.textContent = step.label.toUpperCase()
  question.textContent = step.question
  copy.textContent = step.copy
  current.textContent = `${String(index + 1).padStart(2,'0')} / 11`
  fill.style.width = `${((index + 1) / 11) * 100}%`
  options.innerHTML = ''
  step.options.forEach(option => {
    const button = document.createElement('button')
    button.className = 'config-option'
    button.type = 'button'
    button.textContent = option
    button.setAttribute('aria-pressed','false')
    button.addEventListener('click', () => {
      ;[...options.children].forEach(item => item.setAttribute('aria-pressed','false'))
      button.setAttribute('aria-pressed','true')
      selectOption(step, option)
    })
    options.appendChild(button)
  })
  back.disabled = index === 0
  next.querySelector('span').textContent = index === 10 ? 'Review design' : 'Continue'
  updatePrice()
}

next.addEventListener('click', () => {
  if (index < 10) { index += 1; render() }
  else alert('Static prototype: a design summary would open here.')
})
back.addEventListener('click', () => { if (index > 0) { index -= 1; render() } })
render()
