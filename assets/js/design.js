import {
  configSteps,
  getActiveSteps,
  getStepById,
  getSizingOptions,
} from './configurator-options.js';
import {
  products,
  getProductBySlug,
} from './configurator-products.js';
import { resolvePreviewAsset } from './configurator-preview.js';

const STORAGE_KEY_PREFIX = 'woyke-configurator-v2';
const CART_KEY = 'woyke-cart-v1';
const ENGRAVING_SURCHARGE = 50;
const FALLBACK_PREVIEW = '/assets/media/images/ring-radiant-floral.webp';

const INTERCHANGEABILITY_BY_CATEGORY = {
  ring: ['none', 'ring-pendant', 'ring-brooch'],
  'stud-earring': ['none', 'stud-dangling'],
  'dangling-earring': ['none', 'stud-dangling'],
  pendant: ['none', 'ring-pendant', 'pendant-brooch'],
  necklace: ['none', 'bracelet-necklace'],
  bracelet: ['none', 'bracelet-necklace'],
  bangle: ['none'],
  brooch: ['none', 'ring-brooch', 'pendant-brooch'],
  anklet: ['none'],
};

const CATEGORY_FALLBACKS = {
  ring: '/assets/media/images/ring-radiant-floral.webp',
  'stud-earring': '/assets/media/images/hero-wide.webp',
  'dangling-earring': '/assets/media/images/hero-portrait.webp',
  pendant: '/assets/media/images/necklace-heart.webp',
  necklace: '/assets/media/images/necklace-princess.webp',
  bracelet: '/assets/media/images/bracelet-radiant.webp',
  bangle: '/assets/media/images/bracelet-bar.webp',
  brooch: '/assets/media/images/jade-final-statement.webp',
  anklet: '/assets/media/images/bracelet-charm.webp',
};

const els = {
  productName: document.querySelector('#config-product-name'),
  reset: document.querySelector('#config-reset'),
  current: document.querySelector('#config-current'),
  fill: document.querySelector('#config-fill'),
  label: document.querySelector('#config-label'),
  substep: document.querySelector('#config-substep'),
  editor: document.querySelector('#config-editor'),
  kicker: document.querySelector('#config-kicker'),
  title: document.querySelector('#config-question-title'),
  copy: document.querySelector('#config-copy'),
  guide: document.querySelector('#config-guide'),
  options: document.querySelector('#config-options'),
  extras: document.querySelector('#config-extras'),
  validation: document.querySelector('#config-validation'),
  summary: document.querySelector('#config-summary'),
  back: document.querySelector('#config-back'),
  next: document.querySelector('#config-next'),
  previewStage: document.querySelector('#config-preview-stage'),
  previewImage: document.querySelector('#config-preview-image'),
  previewBadge: document.querySelector('#config-preview-badge'),
  previewReference: document.querySelector('#preview-reference'),
  previewName: document.querySelector('#preview-design-name'),
  previewCopy: document.querySelector('#preview-design-copy'),
  price: document.querySelector('#preview-price-value'),
  form: document.querySelector('#preview-form-label'),
  stone: document.querySelector('#preview-stone-label'),
  metal: document.querySelector('#preview-metal-label'),
  toast: document.querySelector('#config-toast'),
};

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getInitialProduct() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('product') || params.get('slug') || 'imperial-jade-bloom-ring';
  return getProductBySlug(slug) || products[0];
}

const product = getInitialProduct();
const STORAGE_KEY = `${STORAGE_KEY_PREFIX}:${product.slug}`;
const restored = safeJsonParse(localStorage.getItem(STORAGE_KEY), {});
const state = {
  lang: restored.lang === 'cn' ? 'cn' : 'en',
  currentStepId: typeof restored.currentStepId === 'string' ? restored.currentStepId : null,
  selections: restored.selections && typeof restored.selections === 'object' ? restored.selections : {},
  engravingText: typeof restored.engravingText === 'string' ? restored.engravingText.slice(0, 30) : '',
  engravingFont: ['script', 'serif', 'block'].includes(restored.engravingFont) ? restored.engravingFont : 'script',
  giftMessage: typeof restored.giftMessage === 'string' ? restored.giftMessage.slice(0, 150) : '',
  isReviewing: false,
  lastPreview: els.previewImage?.getAttribute('src') || FALLBACK_PREVIEW,
};

function t(en, cn) {
  return state.lang === 'cn' ? (cn || en) : en;
}

function formatMoney(value) {
  return `SGD ${Number(value || 0).toLocaleString('en-SG')}`;
}

function getFilteredOptions(step, selections = state.selections) {
  if (!step) return [];

  if (step.id === 'category-specific' && selections.category) {
    return getSizingOptions(selections.category);
  }

  if (step.id === 'interchangeability' && selections.category) {
    const valid = INTERCHANGEABILITY_BY_CATEGORY[selections.category] || ['none'];
    return step.options.filter((option) => valid.includes(option.value));
  }

  return step.options || [];
}

function getActiveConfigSteps(selections = state.selections) {
  return getActiveSteps(selections);
}

function getCurrentIndex(activeSteps) {
  if (!activeSteps.length) return 0;
  if (!state.currentStepId) return 0;
  const index = activeSteps.findIndex((step) => step.id === state.currentStepId);
  return index >= 0 ? index : Math.min(activeSteps.length - 1, 0);
}

function getCurrentStep() {
  const activeSteps = getActiveConfigSteps();
  return activeSteps[getCurrentIndex(activeSteps)] || activeSteps[0];
}

function removeInactiveSelections(nextSelections) {
  let candidate = { ...nextSelections };

  if (candidate.category) {
    const validInterchangeability = INTERCHANGEABILITY_BY_CATEGORY[candidate.category] || ['none'];
    if (candidate.interchangeability && !validInterchangeability.includes(candidate.interchangeability)) {
      delete candidate.interchangeability;
    }
  }

  if (candidate.stone === 'none') {
    delete candidate['stone-shape'];
    delete candidate['stone-size'];
    delete candidate['want-side-stones'];
    delete candidate['side-stones'];
    delete candidate['side-stone-shape'];
    delete candidate['add-second-side-stone'];
    delete candidate['side-stone-2'];
    delete candidate['side-stone-2-shape'];
  }

  if (candidate['want-side-stones'] !== 'yes') {
    delete candidate['side-stones'];
    delete candidate['side-stone-shape'];
    delete candidate['add-second-side-stone'];
    delete candidate['side-stone-2'];
    delete candidate['side-stone-2-shape'];
  }

  if (candidate['add-second-side-stone'] !== 'yes') {
    delete candidate['side-stone-2'];
    delete candidate['side-stone-2-shape'];
  }

  // Re-evaluate until conditional step membership stabilises.
  for (let pass = 0; pass < 3; pass += 1) {
    const activeIds = new Set(getActiveConfigSteps(candidate).map((step) => step.id));
    let changed = false;
    for (const key of Object.keys(candidate)) {
      const isKnownStep = configSteps.some((step) => step.id === key);
      if (isKnownStep && !activeIds.has(key)) {
        delete candidate[key];
        changed = true;
      }
    }
    if (!changed) break;
  }

  return candidate;
}

function selectionLabel(stepId, value = state.selections[stepId]) {
  if (!value) return '';
  const step = getStepById(stepId);
  const option = step?.options?.find((item) => item.value === value);
  if (!option) return value;
  return state.lang === 'cn' ? option.labelCn : option.label;
}

function calculatePrice() {
  const activeSteps = getActiveConfigSteps();
  const upcharges = [];

  for (const step of activeSteps) {
    const selectedValue = state.selections[step.id];
    if (!selectedValue) continue;
    const option = step.options?.find((item) => item.value === selectedValue);
    if (option && Number(option.upcharge)) {
      upcharges.push({
        stepId: step.id,
        label: state.lang === 'cn' ? step.nameCn : step.name,
        amount: Number(option.upcharge),
      });
    }
  }

  const engravingSurcharge = state.engravingText.trim() ? ENGRAVING_SURCHARGE : 0;
  return {
    basePrice: Number(product.basePrice || 0),
    upcharges,
    engravingSurcharge,
    total: Math.max(0, Number(product.basePrice || 0) + upcharges.reduce((sum, item) => sum + item.amount, 0) + engravingSurcharge),
  };
}

function buildNarrative() {
  const category = selectionLabel('category') || t('piece', '珠宝');
  const stone = selectionLabel('stone');
  const metal = selectionLabel('metal');
  const colour = selectionLabel('colour');
  const occasion = selectionLabel('occasion');

  if (state.lang === 'cn') {
    return `您的${category}，采用${colour || ''}${metal || '贵金属'}${stone && stone !== '无宝石' ? `镶嵌${stone}` : ''}。为${occasion || '特别时刻'}精心打造。`;
  }

  const material = `${colour ? `${colour} ` : ''}${metal || 'precious metal'}`;
  const stonePhrase = stone && stone !== 'None' ? `${stone} ` : '';
  return `Your ${stonePhrase}${category.toLowerCase()}, set in ${material}. Crafted for ${occasion ? `your ${occasion.toLowerCase()}` : 'a special moment'}.`;
}

function validateCurrentStep(step) {
  if (!step) return { valid: false, message: t('No active step is available.', '当前没有可用步骤。') };
  if (step.type === 'text') return { valid: true, message: '' };

  if (!state.selections[step.id]) {
    return {
      valid: false,
      message: t('Choose an option before continuing.', '请选择一个选项后继续。'),
    };
  }

  if (step.id === 'stone-size' && state.selections.stone !== 'none' && !state.selections['want-side-stones']) {
    return {
      valid: false,
      message: t('Tell us whether you would like side stones.', '请选择是否添加副石。'),
    };
  }

  return { valid: true, message: '' };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    lang: state.lang,
    currentStepId: state.currentStepId,
    selections: state.selections,
    engravingText: state.engravingText,
    engravingFont: state.engravingFont,
    giftMessage: state.giftMessage,
  }));
}

function setSelection(stepId, value) {
  const currentStepId = state.currentStepId;
  state.selections = removeInactiveSelections({ ...state.selections, [stepId]: value });

  const activeSteps = getActiveConfigSteps();
  if (activeSteps.some((step) => step.id === currentStepId)) {
    state.currentStepId = currentStepId;
  } else {
    state.currentStepId = activeSteps[0]?.id || null;
  }

  state.isReviewing = false;
  els.validation.textContent = '';
  saveState();
  render();
}

function ensureGuideDialog() {
  let dialog = document.querySelector('#atelier-guide-dialog');
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.id = 'atelier-guide-dialog';
  dialog.className = 'atelier-guide-dialog';
  dialog.setAttribute('aria-label', t('Size guide', '尺寸指南'));
  dialog.innerHTML = `
    <div class="atelier-guide-dialog-inner">
      <button class="atelier-guide-dialog-close" type="button" aria-label="${t('Close size guide', '关闭尺寸指南')}">×</button>
      <img class="atelier-guide-dialog-image" alt="">
      <p class="atelier-guide-dialog-caption"></p>
    </div>
  `;

  dialog.querySelector('.atelier-guide-dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return dialog;
}

function openGuideDialog(src, alt, caption) {
  const dialog = ensureGuideDialog();
  const image = dialog.querySelector('.atelier-guide-dialog-image');
  const captionNode = dialog.querySelector('.atelier-guide-dialog-caption');
  image.src = src;
  image.alt = alt;
  captionNode.textContent = caption || '';
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else window.open(src, '_blank', 'noopener,noreferrer');
}

function renderGuide(step) {
  const guide = step?.guide;
  els.guide.innerHTML = '';
  if (!guide || (!guide.images?.length && !guide.text)) {
    els.guide.hidden = true;
    return;
  }

  els.guide.hidden = false;
  const caption = state.lang === 'cn' ? (guide.textCn || guide.text || '') : (guide.text || '');

  for (const src of guide.images || []) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'atelier-guide-media';
    button.setAttribute('aria-label', t(`Open ${step.name} guide`, `打开${step.nameCn}指南`));

    const img = document.createElement('img');
    const alt = t(`${step.name} guide`, `${step.nameCn}指南`);
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.addEventListener('error', () => button.remove(), { once: true });

    const action = document.createElement('span');
    action.className = 'atelier-guide-action mono';
    action.textContent = t('View full guide', '查看完整指南');

    button.append(img, action);
    button.addEventListener('click', () => openGuideDialog(src, alt, caption));
    els.guide.append(button);
  }

  if (caption) {
    const copy = document.createElement('div');
    copy.className = 'atelier-guide-copy';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'mono';
    eyebrow.textContent = t('Size guide', '尺寸指南');
    const p = document.createElement('p');
    p.textContent = caption;
    copy.append(eyebrow, p);
    els.guide.append(copy);
  }
}

function createOptionButton(step, option) {
  const button = document.createElement('button');
  const selected = state.selections[step.id] === option.value;
  button.type = 'button';
  button.className = 'atelier-option';
  button.setAttribute('role', 'radio');
  button.setAttribute('aria-checked', String(selected));
  button.dataset.value = option.value;

  const title = document.createElement('span');
  title.className = 'atelier-option-title';

  const mark = document.createElement('span');
  mark.className = 'atelier-option-mark';
  mark.setAttribute('aria-hidden', 'true');
  if (option.color) mark.style.background = option.color;
  title.append(mark);

  const titleText = document.createElement('span');
  titleText.textContent = state.lang === 'cn' ? option.labelCn : option.label;
  title.append(titleText);
  button.append(title);

  const description = state.lang === 'cn' ? option.descriptionCn : option.description;
  if (description) {
    const copy = document.createElement('span');
    copy.className = 'atelier-option-copy';
    copy.textContent = description;
    button.append(copy);
  }

  if (Number(option.upcharge)) {
    const price = document.createElement('span');
    price.className = 'atelier-option-price';
    price.textContent = `${option.upcharge > 0 ? '+' : '−'}${formatMoney(Math.abs(option.upcharge))}`;
    button.append(price);
  }

  button.addEventListener('click', () => setSelection(step.id, option.value));
  return button;
}

function renderOptions(step) {
  const options = getFilteredOptions(step);
  els.options.innerHTML = '';
  els.options.dataset.type = step.type;
  els.options.setAttribute('aria-label', state.lang === 'cn' ? step.nameCn : step.name);

  if (step.type === 'text') {
    els.options.hidden = true;
    return;
  }

  els.options.hidden = false;
  for (const option of options) {
    els.options.append(createOptionButton(step, option));
  }
}

function renderMiniChoice(container, choices, selectedValue, onSelect) {
  const row = document.createElement('div');
  row.className = 'atelier-choice-row';
  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'atelier-mini-button';
    button.setAttribute('aria-pressed', String(selectedValue === choice.value));
    button.textContent = t(choice.en, choice.cn);
    button.addEventListener('click', () => onSelect(choice.value));
    row.append(button);
  }
  container.append(row);
}

function renderTextInput(step) {
  const field = document.createElement('div');
  field.className = 'atelier-extra-card atelier-field';

  const label = document.createElement('label');
  label.className = 'mono';
  label.htmlFor = 'atelier-engraving';
  label.textContent = t('Engraving text — optional', '刻字内容 — 可选');

  const input = document.createElement('input');
  input.id = 'atelier-engraving';
  input.className = 'atelier-input';
  input.type = 'text';
  input.maxLength = 30;
  input.value = state.engravingText;
  input.placeholder = t('Name, date or private message', '姓名、日期或私人留言');
  input.addEventListener('input', () => {
    state.engravingText = input.value.slice(0, 30);
    count.textContent = `${state.engravingText.length}/30`;
    preview.textContent = state.engravingText || t('Your words appear here.', '您的文字将显示在这里。');
    priceRenderOnly();
    saveState();
  });

  const meta = document.createElement('div');
  meta.className = 'atelier-input-meta mono';
  const placement = document.createElement('span');
  placement.textContent = t('Placement confirmed by atelier', '刻字位置由工坊确认');
  const count = document.createElement('span');
  count.textContent = `${state.engravingText.length}/30`;
  meta.append(placement, count);

  const fontTitle = document.createElement('p');
  fontTitle.textContent = t('Choose the character of the lettering.', '选择刻字风格。');

  field.append(label, input, meta, fontTitle);
  renderMiniChoice(field, [
    { value: 'script', en: 'Script', cn: '手写体' },
    { value: 'serif', en: 'Classic serif', cn: '经典衬线体' },
    { value: 'block', en: 'Modern block', cn: '现代方体' },
  ], state.engravingFont, (value) => {
    state.engravingFont = value;
    saveState();
    render();
  });

  const preview = document.createElement('div');
  preview.className = 'atelier-engraving-preview';
  preview.dataset.font = state.engravingFont;
  preview.textContent = state.engravingText || t('Your words appear here.', '您的文字将显示在这里。');
  field.append(preview);

  els.extras.append(field);
}

function renderSideStonePrompt(step) {
  if (step.id !== 'stone-size' || state.selections.stone === 'none') return;

  const card = document.createElement('div');
  card.className = 'atelier-extra-card';
  const title = document.createElement('p');
  title.textContent = t('Would you like to add side stones?', '您想添加副石吗？');
  card.append(title);

  renderMiniChoice(card, [
    { value: 'yes', en: 'Yes, frame the centre', cn: '是，衬托主石' },
    { value: 'no', en: 'No, keep it singular', cn: '不，保持简洁' },
  ], state.selections['want-side-stones'], (value) => {
    state.selections = removeInactiveSelections({ ...state.selections, 'want-side-stones': value });
    saveState();
    render();
  });

  els.extras.append(card);
}

function renderGiftMessage(step) {
  if (step.id !== 'gift' || !state.selections.gift || state.selections.gift === 'standard') return;

  const field = document.createElement('div');
  field.className = 'atelier-extra-card atelier-field';
  const label = document.createElement('label');
  label.className = 'mono';
  label.htmlFor = 'atelier-gift-message';
  label.textContent = t('Gift message — optional', '礼物留言 — 可选');
  const input = document.createElement('textarea');
  input.id = 'atelier-gift-message';
  input.className = 'atelier-input';
  input.maxLength = 150;
  input.rows = 3;
  input.value = state.giftMessage;
  input.placeholder = t('A message to accompany the piece', '随首饰附上的留言');
  input.addEventListener('input', () => {
    state.giftMessage = input.value.slice(0, 150);
    count.textContent = `${state.giftMessage.length}/150`;
    saveState();
  });
  const count = document.createElement('span');
  count.className = 'atelier-input-meta mono';
  count.textContent = `${state.giftMessage.length}/150`;
  field.append(label, input, count);
  els.extras.append(field);
}

function renderExtras(step) {
  els.extras.innerHTML = '';
  if (step.type === 'text') renderTextInput(step);
  renderSideStonePrompt(step);
  renderGiftMessage(step);
}

function getDisplayGroupDetails(step, activeSteps) {
  const displayStep = Number(step.displayStep || 1);
  const peers = activeSteps.filter((item) => Number(item.displayStep || 1) === displayStep);
  const peerIndex = Math.max(0, peers.findIndex((item) => item.id === step.id));
  return {
    displayStep,
    peerIndex,
    peerCount: peers.length,
  };
}

function renderStep() {
  const activeSteps = getActiveConfigSteps();
  if (!activeSteps.length) return;

  let currentIndex = getCurrentIndex(activeSteps);
  if (!state.currentStepId || !activeSteps[currentIndex]) {
    currentIndex = 0;
    state.currentStepId = activeSteps[0].id;
  }
  const step = activeSteps[currentIndex];
  state.currentStepId = step.id;

  const group = getDisplayGroupDetails(step, activeSteps);
  els.editor.hidden = false;
  els.summary.hidden = true;
  els.current.textContent = `${String(group.displayStep).padStart(2, '0')} / 11`;
  els.fill.style.width = `${Math.max(3, Math.min(100, (group.displayStep / 11) * 100))}%`;
  els.label.textContent = (state.lang === 'cn' ? step.nameCn : step.name).toUpperCase();
  els.substep.textContent = group.peerCount > 1
    ? t(`Detail ${group.peerIndex + 1} of ${group.peerCount} within step ${group.displayStep}`, `第 ${group.displayStep} 步中的细节 ${group.peerIndex + 1}/${group.peerCount}`)
    : '';
  els.kicker.textContent = group.displayStep === 1 ? t('Begin with a reason', '从一个理由开始') : t('Shape the next detail', '塑造下一个细节');
  els.title.textContent = state.lang === 'cn' ? step.nameCn : step.name;
  els.copy.textContent = state.lang === 'cn' ? (step.descriptionCn || step.description || '') : (step.description || '');

  renderGuide(step);
  renderOptions(step);
  renderExtras(step);

  const validation = validateCurrentStep(step);
  els.validation.textContent = '';
  els.back.hidden = currentIndex === 0;
  els.next.disabled = !validation.valid;
  els.next.innerHTML = `<span>${currentIndex < activeSteps.length - 1 ? t('Continue', '继续') : t('Review design', '查看设计')}</span><span>→</span>`;
}

function renderSummary() {
  const activeSteps = getActiveConfigSteps();
  const rows = [];

  for (const step of activeSteps) {
    const value = state.selections[step.id];
    if (!value || step.type === 'text') continue;
    const label = selectionLabel(step.id, value);
    if (!label) continue;
    rows.push({
      key: state.lang === 'cn' ? step.nameCn : step.name,
      value: label,
    });
  }

  if (state.engravingText) {
    rows.push({ key: t('Engraving', '刻字'), value: `“${state.engravingText}”` });
  }
  if (state.giftMessage) {
    rows.push({ key: t('Gift message', '礼物留言'), value: state.giftMessage });
  }

  const price = calculatePrice();
  els.editor.hidden = true;
  els.summary.hidden = false;
  els.summary.innerHTML = `
    <div class="atelier-summary-intro">
      <span class="section-kicker">${t('Design summary', '设计摘要')}</span>
      <h1>${t('Your design.', '您的设计。')}</h1>
      <p>${buildNarrative()}</p>
    </div>
    <dl class="atelier-summary-list">
      ${rows.map((row) => `<div class="atelier-summary-row"><dt>${escapeHtml(row.key)}</dt><dd>${escapeHtml(row.value)}</dd></div>`).join('')}
    </dl>
    <div class="atelier-summary-total"><span>${t('Demo total', '演示总计')}</span><strong>${formatMoney(price.total)}</strong></div>
    <p class="atelier-summary-note">${t('Representative visual preview. Final feasibility and quotation are confirmed by the WOYKE atelier.', '视觉效果仅供参考。最终可行性与报价由 WOYKE 工坊确认。')}</p>
    <div class="atelier-summary-buttons">
      <button id="summary-edit" class="btn btn-secondary" type="button"><span>${t('Edit design', '编辑设计')}</span></button>
      <button id="summary-cart" class="btn" type="button"><span>${t('Add to bag', '加入购物袋')}</span><span>↗</span></button>
    </div>`;

  els.back.hidden = false;
  els.next.hidden = true;
  els.current.textContent = '11 / 11';
  els.fill.style.width = '100%';
  els.label.textContent = t('REVIEW', '查看');
  els.substep.textContent = '';

  document.querySelector('#summary-edit')?.addEventListener('click', () => {
    state.isReviewing = false;
    els.next.hidden = false;
    render();
  });
  document.querySelector('#summary-cart')?.addEventListener('click', addToCart);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function previewFallbackForCategory() {
  return CATEGORY_FALLBACKS[state.selections.category] || product.image || FALLBACK_PREVIEW;
}

function resolvePreview(step) {
  const result = resolvePreviewAsset(state.selections, product, step);
  return {
    src: result?.src || previewFallbackForCategory(),
    match: result?.match || 'fallback',
    alt: result?.alt || product.name,
  };
}

function updatePreviewImage(preview) {
  const target = preview.src || previewFallbackForCategory();
  if (!target) return;

  if (target === state.lastPreview) {
    if (els.previewImage.getAttribute('src') !== target) els.previewImage.src = target;
    els.previewImage.alt = preview.alt;
    return;
  }

  els.previewStage.classList.add('is-changing');
  const probe = new Image();
  probe.onload = () => {
    els.previewImage.src = target;
    els.previewImage.alt = preview.alt;
    state.lastPreview = target;
    requestAnimationFrame(() => els.previewStage.classList.remove('is-changing'));
  };
  probe.onerror = () => {
    const fallback = previewFallbackForCategory();
    els.previewImage.src = fallback;
    els.previewImage.alt = t('Representative WOYKE jewellery preview', 'WOYKE 珠宝代表性预览');
    state.lastPreview = fallback;
    els.previewStage.classList.remove('is-changing');
    els.previewBadge.dataset.match = 'fallback';
    els.previewBadge.textContent = t('REPRESENTATIVE PREVIEW', '代表性预览');
  };
  probe.src = target;
}

function priceRenderOnly() {
  const price = calculatePrice();
  els.price.textContent = formatMoney(price.total);
}

function renderPreview() {
  const step = getCurrentStep();
  const preview = resolvePreview(step);
  updatePreviewImage(preview);
  els.previewBadge.dataset.match = preview.match;
  els.previewBadge.textContent = preview.match === 'exact'
    ? t('MATCHED PREVIEW', '匹配预览')
    : t('REPRESENTATIVE PREVIEW', '代表性预览');

  const category = selectionLabel('category') || t('Unformed piece', '待定作品');
  const stone = selectionLabel('stone') || '—';
  const metal = selectionLabel('metal') || '—';
  const colour = selectionLabel('colour');
  const occasion = selectionLabel('occasion');

  els.previewReference.textContent = `${product.slug.toUpperCase()} / ${preview.match.toUpperCase()}`;
  els.previewName.textContent = state.isReviewing
    ? t('A piece shaped by you.', '一件由您塑造的作品。')
    : occasion
      ? t(`For ${occasion.toLowerCase()}.`, `为${occasion}而作。`)
      : t('A piece shaped by you.', '一件由您塑造的作品。');
  els.previewCopy.textContent = preview.match === 'exact'
    ? t('The current choices match a generated product state.', '当前选择与生成的产品状态相匹配。')
    : t('The closest available image is shown while your specification remains exact.', '显示最接近的可用图像，您的规格仍会被准确记录。');

  els.form.textContent = `FORM / ${String(category).toUpperCase()}`;
  els.stone.textContent = `STONE / ${String(stone).toUpperCase()}`;
  els.metal.textContent = `METAL / ${String(colour ? `${colour} ${metal}` : metal).toUpperCase()}`;
  priceRenderOnly();
}

function syncLanguageButton() {
  const languageButton = document.querySelector('.language-button');
  if (!languageButton) return;
  languageButton.textContent = state.lang === 'en' ? '中文' : 'EN';
  languageButton.setAttribute(
    'aria-label',
    state.lang === 'en' ? 'Switch to Chinese' : 'Switch to English',
  );
}

function render() {
  const activeSteps = getActiveConfigSteps();
  if (!state.currentStepId || !activeSteps.some((step) => step.id === state.currentStepId)) {
    state.currentStepId = activeSteps[0]?.id || null;
  }

  els.productName.textContent = state.lang === 'cn' ? product.nameCn : product.name;
  syncLanguageButton();
  els.next.hidden = false;

  if (state.isReviewing) renderSummary();
  else renderStep();

  renderPreview();
  saveState();
}

function goNext() {
  const activeSteps = getActiveConfigSteps();
  const index = getCurrentIndex(activeSteps);
  const step = activeSteps[index];
  const validation = validateCurrentStep(step);
  if (!validation.valid) {
    els.validation.textContent = validation.message;
    els.next.disabled = true;
    return;
  }

  if (index >= activeSteps.length - 1) {
    state.isReviewing = true;
    render();
    return;
  }

  state.currentStepId = activeSteps[index + 1].id;
  state.isReviewing = false;
  els.validation.textContent = '';
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  render();
}

function goBack() {
  if (state.isReviewing) {
    state.isReviewing = false;
    els.next.hidden = false;
    render();
    return;
  }

  const activeSteps = getActiveConfigSteps();
  const index = getCurrentIndex(activeSteps);
  if (index <= 0) return;
  state.currentStepId = activeSteps[index - 1].id;
  els.validation.textContent = '';
  render();
}

function buildCartItem() {
  const price = calculatePrice();
  const preview = resolvePreview(getCurrentStep());
  return {
    id: `woyke-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId: product.id,
    productSlug: product.slug,
    productName: state.lang === 'cn' ? product.nameCn : product.name,
    image: preview.src || previewFallbackForCategory(),
    previewMatch: preview.match,
    price: price.total,
    quantity: 1,
    selections: { ...state.selections },
    selectionLabels: Object.fromEntries(
      Object.entries(state.selections).map(([key, value]) => [key, selectionLabel(key, value)])
    ),
    engraving: state.engravingText || undefined,
    engravingFont: state.engravingText ? state.engravingFont : undefined,
    giftMessage: state.giftMessage || undefined,
    createdAt: new Date().toISOString(),
  };
}

function addToCart() {
  const cart = safeJsonParse(localStorage.getItem(CART_KEY), []);
  const nextCart = Array.isArray(cart) ? [...cart, buildCartItem()] : [buildCartItem()];
  localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  showToast(t('Design added to your shopping bag.', '设计已加入购物袋。'));
  setTimeout(() => { window.location.href = '/cart/'; }, 450);
}

let toastTimer = 0;
function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.hidden = false;
  toastTimer = window.setTimeout(() => { els.toast.hidden = true; }, 2800);
}

function resetConfigurator() {
  const accepted = window.confirm(t('Start over and clear every selection?', '重新开始并清除所有选择？'));
  if (!accepted) return;
  state.currentStepId = getActiveConfigSteps({})[0]?.id || null;
  state.selections = {};
  state.engravingText = '';
  state.engravingFont = 'script';
  state.giftMessage = '';
  state.isReviewing = false;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

els.next?.addEventListener('click', goNext);
els.back?.addEventListener('click', goBack);
els.reset?.addEventListener('click', resetConfigurator);

// The shared site shell owns the visible language button. This listener connects
// that existing control to the configurator's bilingual data.
queueMicrotask(() => {
  const languageButton = document.querySelector('.language-button');
  languageButton?.addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'cn' : 'en';
    render();
  });
});

render();
