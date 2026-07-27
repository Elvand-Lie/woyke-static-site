import { configSteps, getActiveSteps, getSizingOptions, type ConfigStep, type CustomOption } from '@/data/options';
import type { CartPayload, ConfiguratorState } from './types';

/**
 * Returns the ordered list of active configuration steps based on current selections.
 * Steps with a `condition` function are only included when the condition is met.
 */
export function getActiveConfigSteps(selections: Record<string, string>): ConfigStep[] {
  return getActiveSteps(selections);
}

/**
 * Returns filtered options for a given step, considering category-specific
 * interchangeability rules and sizing overrides.
 */
export function getFilteredOptions(
  step: ConfigStep,
  selections: Record<string, string>
): CustomOption[] {
  // Sizing override
  if (step.id === 'category-specific' && selections['category']) {
    return getSizingOptions(selections['category']);
  }

  // Filter interchangeability options based on the selected category
  if (step.id === 'interchangeability' && selections['category']) {
    const cat = selections['category'];
    const validMap: Record<string, string[]> = {
      'ring': ['none', 'ring-pendant', 'ring-brooch'],
      'stud-earring': ['none', 'stud-dangling'],
      'dangling-earring': ['none', 'stud-dangling'],
      'pendant': ['none', 'ring-pendant', 'pendant-brooch'],
      'necklace': ['none', 'bracelet-necklace'],
      'bracelet': ['none', 'bracelet-necklace'],
      'bangle': ['none'],
      'brooch': ['none', 'ring-brooch', 'pendant-brooch'],
      'anklet': ['none'],
    };
    const validIds = validMap[cat] || ['none'];
    return step.options.filter((o) => validIds.includes(o.value));
  }

  return step.options;
}

/**
 * Returns the display label for a selected option value within a given step ID.
 */
export function getSelectionLabel(
  stepId: string,
  selections: Record<string, string>,
  lang: 'en' | 'cn' = 'en'
): string {
  const value = selections[stepId];
  if (!value) return '';
  const step = configSteps.find((cs) => cs.id === stepId);
  if (!step) return value;
  const opt = step.options.find((o) => o.value === value);
  return opt ? (lang === 'cn' ? opt.labelCn : opt.label) : value;
}

/**
 * Builds a prose narrative describing the current configuration.
 */
export function buildNarrative(
  selections: Record<string, string>,
  lang: 'en' | 'cn' = 'en'
): string {
  const stone = getSelectionLabel('stone', selections, lang);
  const metal = getSelectionLabel('metal', selections, lang);
  const colour = getSelectionLabel('colour', selections, lang);
  const category = getSelectionLabel('category', selections, lang);
  const occasion = getSelectionLabel('occasion', selections, lang);

  if (!stone && !metal) return '';

  return lang === 'cn'
    ? `您的${category || '珠宝'}，采用${colour || ''}${metal || ''}镶嵌${stone || '宝石'}。为${occasion || '特别时刻'}精心打造。`
    : `Your ${stone || 'gemstone'} ${category || 'piece'}, set in ${colour ? colour + ' ' : ''}${metal || 'precious metal'}. Crafted for ${occasion ? 'your ' + occasion.toLowerCase() : 'a special moment'}.`;
}

/**
 * Creates a cart-compatible payload from the current configurator state.
 */
export function buildCartPayload(
  state: ConfiguratorState,
  totalPrice: number,
  lang: 'en' | 'cn' = 'en'
): CartPayload {
  return {
    productId: state.product.id,
    productName: lang === 'cn' ? state.product.nameCn : state.product.name,
    image: state.product.image,
    price: totalPrice,
    selections: state.selections,
    engraving: state.engravingText || undefined,
    engravingFont: state.engravingText ? state.engravingFont : undefined,
    giftMessage: state.giftMessage || undefined,
  };
}

/**
 * Returns the engraving placement description based on selected category.
 */
export function getEngravingPlacement(category: string, lang: 'en' | 'cn' = 'en'): string {
  const placements: Record<string, { en: string; cn: string }> = {
    'ring': { en: 'Inner band of ring', cn: '戒指内侧' },
    'stud-earring': { en: 'Reverse face of earring', cn: '耳环背面' },
    'dangling-earring': { en: 'Reverse face of earring', cn: '耳环背面' },
    'pendant': { en: 'Reverse face of pendant', cn: '吊坠背面' },
    'brooch': { en: 'Reverse face of brooch', cn: '胸针背面' },
    'bracelet': { en: 'Inside clasp bar', cn: '扣环内侧' },
    'bangle': { en: 'Inside clasp bar', cn: '扣环内侧' },
    'necklace': { en: 'On clasp tag', cn: '扣环标签上' },
    'anklet': { en: 'On clasp tag', cn: '扣环标签上' },
  };
  const p = placements[category] || { en: 'On the piece', cn: '在作品上' };
  return lang === 'cn' ? p.cn : p.en;
}
