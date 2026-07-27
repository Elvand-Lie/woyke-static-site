'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useLangStore } from '@/store/lang-store';
import { useCartStore } from '@/store/cart-store';
import { configSteps, getActiveSteps, getSizingOptions, type CustomOption, type ConfigStep } from '@/data/options';
import type { Product } from '@/data/products';

interface Props {
  product: Product;
}

export default function Configurator({ product }: Props) {
  const { t, lang } = useLangStore();
  const addItem = useCartStore((s) => s.addItem);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState<'script' | 'serif' | 'block'>('script');
  const [giftMessage, setGiftMessage] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [show4C, setShow4C] = useState(false);
  const [advanced4C, setAdvanced4C] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const activeSteps = useMemo(() => getActiveSteps(selections), [selections]);

  const progress = activeSteps.length > 0 ? ((currentStep + 1) / activeSteps.length) * 100 : 0;
  const step = activeSteps[currentStep];

  // Dynamic preview image based on selections
  const previewImage = useMemo(() => {
    const category = selections['category'];
    const interchangeability = selections['interchangeability'];
    const stone = selections['stone'];
    const stoneShape = selections['stone-shape'];
    const metal = selections['metal'];

    // If they choose 18k-gold (Step 6), show gold immediately and for all colors (Step 7)
    const isGold = metal === '18k-gold';

    // Ring Style (Step 8a-0) logic
    if (category === 'ring') {
      const ringStyle = selections['ring-sub-type'];
      
      // We want to show the style image if:
      // 1. The user is currently on the Ring Style step (to see what they are picking)
      // OR 2. The user is making a standard ring (not a pendant), so the style image acts as the best available preview.
      if (ringStyle && (step?.id === 'ring-sub-type' || interchangeability !== 'ring-pendant')) {
        const styleFileNameMap: Record<string, string> = {
          'solitaire': 'solitaire',
          'halo': 'halo',
          'three-stone': 'three stone',
          'pave-eternity': 'pave',
          'cocktail': 'cocktail',
          'stacking': 'stacking',
          'signet': 'signet',
        };
        const mappedStyle = styleFileNameMap[ringStyle];
        if (mappedStyle) {
          return `/images/rings/ring-pendant/ring-style/${isGold ? 'ring-gold-style' : 'ring-style'}-${mappedStyle}.png`;
        }
      }
    }

    // Ring → Pendant flow (also handles Pendant → Ring)
    if (interchangeability === 'ring-pendant' && (category === 'ring' || category === 'pendant')) {
      if (stoneShape && stone && stone !== 'none') {
        const shapeFileMap: Record<string, string> = {
          'princess': 'ring-princess',
          'cushion': 'ring-cushion',
          'oval': 'ring-oval',
          'pear': 'ring-pear',
          'emerald-cut': 'ring-emerald',
          'asscher': 'ring-asscher',
          'marquise': 'ring-marquise',
          'radiant': 'ring-radiant',
          'heart': 'ring-heart',
        };
        const stoneFileMap: Record<string, string> = {
          'diamond': 'diamond',
          'ruby': 'ruby',
          'emerald': 'emerald',
          'blue-diamond': 'blue diamond',
          'blue-sapphire': 'blue sapphire',
          'pink-diamond': 'pink diamond',
          'pink-sapphire': 'pink sapphire',
        };
        const shapePrefix = shapeFileMap[stoneShape];
        const stoneFile = stoneFileMap[stone];
        if (shapePrefix && stoneFile) {
          const shapeName = shapePrefix.split('ring-')[1];
          if (isGold) {
            const goldShapeName = shapeName === 'marquise' ? 'masquise' : shapeName;
            return `/images/rings/ring-pendant/ring-gold/ring-gold-${goldShapeName}-${stoneFile}.png`;
          }
          return `/images/rings/ring-pendant/ring-${stoneShape}/ring-${shapeName}-${stoneFile}.png`;
        }
      }
      if (stone && stone !== 'none') {
        return `/images/rings/ring-pendant/ring-pendant-${stone}.png`;
      }
      return '/images/rings/ring-pendant/ring-pendant-hero.png';
    }

    // Pendant flow (Standalone)
    if (category === 'pendant') {
      const pendantStyle = selections['pendant-style'];
      const styleMap: Record<string, string> = {
        'solitaire-pendant': 'solitaire',
        'halo-pendant': 'halo',
      };
      const mappedStyle = pendantStyle ? styleMap[pendantStyle] : null;

      const pendantShapeMap: Record<string, string> = {
        'asscher': 'asscher',
        'cushion': 'cushion',
        'emerald-cut': 'emerald',
        'heart': 'heart',
        'marquise': 'marquise',
        'oval': 'oval',
        'pear': 'pear',
        'princess': 'princess',
        'radiant': 'radiant',
      };
      const mappedShape = stoneShape ? pendantShapeMap[stoneShape] : null;

      // Pendant styles (only gold available currently)
      if (mappedStyle && isGold) {
        return `/images/pendant/pendant-style/pendant-gold-style-${mappedStyle}.png`;
      }

      // Pendant shapes
      if (mappedShape) {
        return `/images/pendant/pendant-${isGold ? 'gold-' : ''}${mappedShape}.png`;
      }

      // Default Pendant
      return `/images/pendant/pendant${isGold ? '-gold' : ''}.png`;
    }

    // Stud Earring flow (also handles Dangling → Stud)
    if (category === 'stud-earring' || (category === 'dangling-earring' && interchangeability === 'stud-dangling')) {
      const isDangling = interchangeability === 'stud-dangling';
      const studSetting = selections['stud-setting'];

      const studShapeMap: Record<string, string> = {
        'asscher': 'asscher',
        'cushion': 'cushion',
        'emerald-cut': 'emerald',
        'heart': 'heart',
        'marquise': 'marquise',
        'oval': 'oval',
        'pear': 'pear',
        'princess': 'princess',
        'radiant': 'radiant',
      };

      // Map stud-setting values to file name portions
      // 'round-claw-4' → default (no style override)
      // Gold filenames use: 'L prong', 'half bazel'
      // Platinum filenames use: 'L Prong', 'half-bazel'
      const studStyleGoldMap: Record<string, string> = {
        'round-claw-6':   '6 claw',
        'sharp-claw':     'sharp pointed',
        'l-prong':        'L prong',
        'bezel-full':     'bazel full',
        'half-bezel':     'half bazel',
        'halo-stud':      'halo',
        'wrapped':        'wrapped',
        'milgrain-halo':  'milgrain halo',
        'starburst':      'starbust',
      };
      const studStylePlatinumMap: Record<string, string> = {
        'round-claw-6':   '6 claw',
        'sharp-claw':     'sharp pointed',
        'l-prong':        'L Prong',
        'bezel-full':     'bazel full',
        'half-bezel':     'half-bazel',
        'halo-stud':      'halo',
        'wrapped':        'wrapped',
        'milgrain-halo':  'milgrain halo',
        'starburst':      'starbust',
      };

      const mappedShape = stoneShape ? studShapeMap[stoneShape] : null;
      const mappedStyle = studSetting
        ? (isGold ? studStyleGoldMap[studSetting] : studStylePlatinumMap[studSetting])
        : null;

      if (isDangling) {
        if (mappedStyle) {
          if (isGold) {
            return `/images/stud/stud-dangling-style/stud-gold-dangling-style-${mappedStyle}.png`;
          } else {
            return `/images/stud/stud-dangling-style/stud-dangling-style-${mappedStyle}.png`;
          }
        }
        if (isGold) {
          return '/images/stud/stud-dangling-style/stud-gold-dangling-style.png';
        }
        if (mappedShape) {
          return `/images/stud/stud-dangling/stud-earring-dangling-${mappedShape}.png`;
        }
        return '/images/stud/stud-dangling/stud-earring-dangling-oval.png';
      } else {
        if (mappedStyle) {
          const prefix = isGold ? 'stud-gold-style-earring' : 'sstud-style-earring';
          const goldStyle = mappedStyle === 'starbust' && isGold ? 'startbust' : mappedStyle;
          const finalStyle = isGold ? goldStyle : mappedStyle;
          return `/images/stud/stud-style/${prefix}-${finalStyle}.png`;
        }
        if (mappedShape) {
          return `/images/stud/stud-${isGold ? 'gold-' : ''}earring-${mappedShape}.png`;
        }
        return `/images/stud/stud-${isGold ? 'gold-' : ''}earring.png`;
      }
    }

    // Standalone Dangling Earring flow (no interchangeability or different type)
    if (category === 'dangling-earring') {
      const danglingShapeMap: Record<string, string> = {
        'asscher': 'asscher',
        'cushion': 'cushion',
        'emerald-cut': 'emerald',
        'heart': 'heart',
        'marquise': 'marquise',
        'oval': 'oval',
        'pear': 'pear',
        'princess': 'princess',
        'radiant': 'radiant',
      };
      const mappedShape = stoneShape ? danglingShapeMap[stoneShape] : null;

      if (mappedShape) {
        return `/images/dangling/dangling-${isGold ? 'gold-' : ''}${mappedShape}.png`;
      }
      return `/images/dangling/dangling${isGold ? '-gold' : ''}.png`;
    }

    const shapeMap: Record<string, string> = {
      'asscher': 'asscher',
      'cushion': 'cushion',
      'emerald-cut': 'emerald',
      'heart': 'heart',
      'marquise': 'marquise',
      'oval': 'oval',
      'pear': 'pear',
      'princess': 'princess',
      'radiant': 'radiant',
    };
    const mappedGenericShape = stoneShape ? shapeMap[stoneShape] : null;

    if (category === 'necklace') {
      const nStyle = selections['necklace-style'];
      const styleMap: Record<string, string> = {
        'tennis': 'tennis',
        'station': 'station',
        'graduated': 'graduated',
        'lariat': 'lariat y',
        'bib': 'bib',
        'collar-choker': 'collar',
        'opera-long': 'opera chain',
        'layering-chain': 'layering',
      };
      const mappedStyle = nStyle ? styleMap[nStyle] : null;
      if (mappedStyle) return `/images/Necklace/necklace-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`;
      if (mappedGenericShape) return `/images/Necklace/necklace-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`;
      return `/images/Necklace/necklace-${isGold ? 'gold-' : ''}style-tennis.png`;
    }

    if (category === 'bracelet') {
      const bStyle = selections['bracelet-style'];
      const styleMap: Record<string, string> = {
        'tennis': 'tennis',
        'station': 'station',
        'chain-bracelet': 'chain',
        'cuff-bracelet': 'cuff',
        'charm-bracelet': 'charm',
        'link-bracelet': 'link',
        'bar-bracelet': 'bar'
      };
      const mappedStyle = bStyle ? styleMap[bStyle] : null;
      if (mappedStyle) return `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`;
      if (mappedGenericShape) {
         let shapeName = mappedGenericShape;
         if (isGold && shapeName === 'emerald') shapeName = 'emeraldd'; // Fix typo in asset name
         return `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}${shapeName}.png`;
      }
      return `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}style-tennis.png`;
    }

    if (category === 'bangle') {
      const bStruct = selections['bangle-structure'];
      const styleMap: Record<string, string> = {
        'full-round': 'full',
        'hinged': 'hinged',
        'hinged-safety': 'hinged safety lock',
        'c-shaped': 'c shape',
        'spiral-coil': 'spiral',
        'stacking-set': 'stacking'
      };
      const mappedStyle = bStruct ? styleMap[bStruct] : null;
      if (mappedStyle) return `/images/Bangle/bangle-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`;
      if (mappedGenericShape) return `/images/Bangle/bangle-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`;
      return `/images/Bangle/bangle-${isGold ? 'gold-' : ''}style-full.png`;
    }

    if (category === 'brooch') {
      const brStyle = selections['brooch-style'];
      const styleMap: Record<string, string> = {
        'floral-corsage': 'floral',
        'starburst': 'starburst',
        'bar-brooch': 'bar-brooch',
        'cluster-bouquet': 'cluster-bouquet',
        'geometric-abstract': 'geometric',
        'animal-figural': 'animal',
        'crescent': 'moon',
        'circular-disc': 'circular',
        'bow-ribbon': 'bow-ribbonn'
      };
      const mappedStyle = brStyle ? styleMap[brStyle] : null;
      if (mappedStyle) {
        if (isGold) {
           if (mappedStyle === 'bow-ribbonn') return '/images/Brooch/brooch-gold-style-bow-ribbon.png';
           return `/images/Brooch/brooch-style-gold-${mappedStyle}.png`;
        }
        return `/images/Brooch/brooch-style-${mappedStyle}.png`;
      }
      if (mappedGenericShape) return `/images/Brooch/brooch-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`;
      if (isGold) return '/images/Brooch/brooch-style-gold-floral.png';
      return '/images/Brooch/brooch-style-floral.png';
    }

    if (category === 'anklet') {
      const aStyle = selections['anklet-style'];
      const styleMap: Record<string, string> = {
        'delicate-chain': 'delicate chain',
        'station-anklet': 'station',
        'tennis-anklet': 'tennis',
        'layered-anklet': 'layered',
        'charm-anklet': 'charm',
        'body-chain-anklet': 'body chain'
      };
      const mappedStyle = aStyle ? styleMap[aStyle] : null;
      if (mappedStyle) return `/images/Angklet/angklet-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`;
      if (mappedGenericShape) return `/images/Angklet/angklet-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`;
      return `/images/Angklet/angklet-${isGold ? 'gold-' : ''}style-delicate chain.png`;
    }

    // Step 2: Ring selected (no interchangeability yet, or none)
    if (category === 'ring') {
      return '/images/rings/ring-hero.png';
    }

    // Default: product image
    return product.image;
  }, [selections, product.image]);

  // Dynamic price calculation
  const totalPrice = useMemo(() => {
    let price = product.basePrice;
    activeSteps.forEach((s) => {
      const selectedValue = selections[s.id];
      if (selectedValue) {
        const option = s.options.find((o) => o.value === selectedValue);
        if (option) price += option.upcharge;
      }
    });
    if (engravingText.trim()) price += 50;
    return Math.max(0, price);
  }, [selections, product.basePrice, activeSteps, engravingText]);

  // Get appropriate options for each step
  const getStepOptions = useCallback((s: ConfigStep): CustomOption[] => {
    if (s.id === 'category-specific' && selections['category']) {
      return getSizingOptions(selections['category']);
    }
    // Filter interchangeability options based on selected category
    if (s.id === 'interchangeability' && selections['category']) {
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
      return s.options.filter((o) => validIds.includes(o.value));
    }
    return s.options;
  }, [selections]);

  const handleSelect = useCallback((stepId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [stepId]: value }));

    // Show certificate preview after stone selection
    if (stepId === 'stone' && value !== 'none') {
      setShowCertificate(true);
      setTimeout(() => setShowCertificate(false), 3000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSurpriseMe = () => {
    const randomSelections: Record<string, string> = {};
    activeSteps.forEach((s) => {
      const opts = getStepOptions(s);
      if (opts.length > 0 && s.type !== 'text') {
        const randomIdx = Math.floor(Math.random() * opts.length);
        randomSelections[s.id] = opts[randomIdx].value;
      }
    });
    setSelections(randomSelections);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: lang === 'cn' ? product.nameCn : product.name,
      image: product.image,
      price: totalPrice,
      selections,
      engraving: engravingText,
      engravingFont,
      giftMessage,
    });
    window.location.href = '/cart';
  };

  const getSelectionLabel = (stepId: string): string => {
    const value = selections[stepId];
    if (!value) return '';
    const s = configSteps.find((cs) => cs.id === stepId);
    if (!s) return value;
    const opt = s.options.find((o) => o.value === value);
    return opt ? (lang === 'cn' ? opt.labelCn : opt.label) : value;
  };

  // Build narrative summary
  const narrative = useMemo(() => {
    const stone = getSelectionLabel('stone');
    const metal = getSelectionLabel('metal');
    const colour = getSelectionLabel('colour');
    const category = getSelectionLabel('category');
    const occasion = getSelectionLabel('occasion');

    if (!stone && !metal) return '';

    return lang === 'cn'
      ? `您的${category || '珠宝'}，采用${colour || ''}${metal || ''}镶嵌${stone || '宝石'}。为${occasion || '特别时刻'}精心打造。`
      : `Your ${stone || 'gemstone'} ${category || 'piece'}, set in ${colour ? colour + ' ' : ''}${metal || 'precious metal'}. Crafted for ${occasion ? 'your ' + occasion.toLowerCase() : 'a special moment'}.`;
  }, [selections, lang]);

  // ── COMPLETE / SUMMARY VIEW ──
  if (isComplete) {
    return (
      <div className="configurator-layout">
        <div className="configurator-steps" style={{ maxHeight: 'none' }}>
          <div className="summary-card">
            <h2>{t('Your Design Summary', '您的设计摘要')}</h2>

            {narrative && (
              <div className="summary-narrative">{narrative}</div>
            )}

            {activeSteps.map((s) => {
              const label = getSelectionLabel(s.id);
              if (!label) return null;
              return (
                <div key={s.id} className="summary-row">
                  <span className="label">{lang === 'cn' ? s.nameCn : s.name}</span>
                  <span className="value">{label}</span>
                </div>
              );
            })}

            {engravingText && (
              <div className="summary-row">
                <span className="label">{t('Engraving', '刻字')}</span>
                <span className="value">&ldquo;{engravingText}&rdquo;</span>
              </div>
            )}

            <div className="summary-total">
              <span>{t('Total', '总计')}</span>
              <span>SGD {totalPrice.toLocaleString()}</span>
            </div>

            <div className="lead-time">
              <strong>{t('Crafted with care in 3–4 weeks', '3-4周精心制作')}</strong>
            </div>

            <div className="step-nav" style={{ marginTop: 'var(--space-xl)' }}>
              <button className="btn btn-ghost" onClick={() => setIsComplete(false)}>
                {t('← Edit Design', '← 编辑设计')}
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="add-to-cart-btn">
                {t('Add to Cart', '加入购物车')}
              </button>
            </div>

            <div className="consult-cta" style={{ marginTop: 'var(--space-xl)' }}>
              <p>{t('Not sure yet? Talk to our jewellery experts.', '还不确定？与我们的珠宝专家交谈。')}</p>
              <button className="btn btn-champagne-outline btn-sm">
                {t('Book a Free Virtual Consultation', '预约免费线上咨询')}
              </button>
            </div>
          </div>
        </div>
        <div className="configurator-preview">
          <div className="preview-image-container">
            <Image src={previewImage} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="420px" />
          </div>
          <div className="preview-price">
            <div className="label">{t('Your Price', '您的价格')}</div>
            <div className="amount">SGD {totalPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP VIEW ──
  if (!step) return null;

  const stepOptions = getStepOptions(step);

  return (
    <div className="configurator-layout">
      <div className="configurator-steps">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="step-header">
          <span className="step-counter">
            {t(`Step ${step.displayStep || currentStep + 1} of 11`, `第 ${step.displayStep || currentStep + 1} 步，共 11 步`)}
          </span>
          <h2>{lang === 'cn' ? step.nameCn : step.name}</h2>
          {step.description && (
            <p>{lang === 'cn' ? step.descriptionCn : step.description}</p>
          )}
        </div>

        {step.guide && (
          <div className="step-guide-container" style={{ marginBottom: 'var(--space-xl)', background: 'var(--champagne-faded)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            {step.guide.images && step.guide.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', display: 'inline-block', cursor: 'zoom-in', marginBottom: '16px' }} onClick={() => setZoomImg(img)}>
                <img src={img} alt="Size Guide" style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', display: 'block' }} />
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', pointerEvents: 'none' }}>
                  🔍 Tap to zoom
                </span>
              </div>
            ))}
            {(step.guide.text || step.guide.textCn) && (
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--charcoal-primary)' }}>
                {lang === 'cn' ? (step.guide.textCn || step.guide.text) : step.guide.text}
              </p>
            )}
          </div>
        )}

        {zoomImg && (
          <div
            onClick={() => setZoomImg(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out', padding: '16px',
            }}
          >
            <img
              src={zoomImg}
              alt="Size Guide Zoomed"
              style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
            />
            <button
              onClick={() => setZoomImg(null)}
              style={{
                position: 'absolute', top: '20px', right: '24px',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: '#fff', fontSize: '1.6rem', cursor: 'pointer',
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        )}

        {step.type === 'card-grid' && (
          <div className="options-grid">
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                className={`option-card ${selections[step.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                {opt.emoji && <span className="option-emoji">{opt.emoji}</span>}
                <span className="option-label">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.description && (
                  <span className="option-description">{lang === 'cn' ? opt.descriptionCn : opt.description}</span>
                )}
                {opt.upcharge !== 0 && (
                  <span className="option-price">
                    {opt.upcharge > 0 ? `+SGD ${opt.upcharge}` : `-SGD ${Math.abs(opt.upcharge)}`}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {step.id === 'stone-size' && (
          <div className="advanced-toggle-section">
            <button className="advanced-toggle-btn" onClick={() => setShow4C(!show4C)}>
              {show4C ? '▾' : '▸'} {t('Advanced: Exact carat, cut, colour, clarity', '高级选项：精确克拉、切工、颜色、净度')}
            </button>
            {show4C && (
              <div className="advanced-4c-panel">
                <div className="four-c-group">
                  <label>{t('Cut Grade', '切工等级')}</label>
                  <div className="four-c-options">
                    {['Good', 'Very Good', 'Ideal', 'Super Ideal'].map((g) => (
                      <button key={g} className={`four-c-pill ${advanced4C['cut'] === g ? 'selected' : ''}`} onClick={() => setAdvanced4C(p => ({...p, cut: g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="four-c-group">
                  <label>{t('Colour Grade', '颜色等级')}</label>
                  <div className="four-c-options">
                    {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map((g) => (
                      <button key={g} className={`four-c-pill ${advanced4C['colour'] === g ? 'selected' : ''}`} onClick={() => setAdvanced4C(p => ({...p, colour: g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="four-c-group">
                  <label>{t('Clarity', '净度')}</label>
                  <div className="four-c-options">
                    {['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'].map((g) => (
                      <button key={g} className={`four-c-pill ${advanced4C['clarity'] === g ? 'selected' : ''}`} onClick={() => setAdvanced4C(p => ({...p, clarity: g}))}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="four-c-group">
                  <label>{t('Certificate', '证书')}</label>
                  <div className="four-c-options">
                    {['IGI', 'GIA'].map((g) => (
                      <button key={g} className={`four-c-pill ${advanced4C['certificate'] === g ? 'selected' : ''}`} onClick={() => setAdvanced4C(p => ({...p, certificate: g}))}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="side-stones-prompt">
              <p className="side-stones-prompt-label">{t('Would you like to add side stones?', '您想要添加副石吗？')}</p>
              <div className="side-stones-prompt-buttons">
                <button
                  className={`btn ${selections['want-side-stones'] === 'yes' ? 'btn-primary' : 'btn-champagne-outline'} btn-sm`}
                  onClick={() => handleSelect('want-side-stones', 'yes')}
                >
                  ✨ {t('Yes', '是')}
                </button>
                <button
                  className={`btn ${selections['want-side-stones'] === 'no' ? 'btn-primary' : 'btn-champagne-outline'} btn-sm`}
                  onClick={() => handleSelect('want-side-stones', 'no')}
                >
                  {t('No, skip to metal', '不，跳到金属')}
                </button>
              </div>
            </div>
          </div>
        )}

        {step.type === 'swatch' && (
          <div className="swatch-grid">
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                className={`swatch-option ${selections[step.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                <div
                  className="swatch-circle"
                  style={{
                    background: opt.color || 'var(--ivory-warm)',
                    border: opt.color === 'transparent' ? '2px dashed var(--charcoal-faint)' : undefined,
                  }}
                />
                <span className="swatch-label">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.description && (
                  <span className="swatch-personality">{lang === 'cn' ? opt.descriptionCn : opt.description}</span>
                )}
                {opt.upcharge !== 0 && (
                  <span className="option-price" style={{ fontSize: '10px' }}>
                    {opt.upcharge > 0 ? `+${opt.upcharge}` : `${opt.upcharge}`}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {step.type === 'image-swatch' && (
          <div className="options-grid">
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                className={`option-card ${selections[step.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                <span className="option-label">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.upcharge !== 0 && (
                  <span className="option-price">
                    {opt.upcharge > 0 ? `+SGD ${opt.upcharge}` : `-SGD ${Math.abs(opt.upcharge)}`}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {step.type === 'dropdown' && (
          <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                className={`option-card ${selections[step.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                <span className="option-label">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.upcharge !== 0 && (
                  <span className="option-price">+SGD {opt.upcharge}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {step.type === 'text' && (
          <div>
            <input
              type="text"
              className="engraving-input"
              placeholder={t('Enter your message (max 30 characters)', '输入您的信息（最多30个字符）')}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value.slice(0, 30))}
              maxLength={30}
            />
            <div style={{ fontSize: '12px', color: 'var(--charcoal-muted)', marginTop: '8px', textAlign: 'right' }}>
              {engravingText.length}/30
            </div>

            {engravingText && (
              <>
                <p className="engraving-font-label">{t('Choose your font', '选择字体')}</p>
                <div className="font-select-grid">
                  <button
                    className={`font-option ${engravingFont === 'script' ? 'selected' : ''}`}
                    onClick={() => setEngravingFont('script')}
                    style={{ fontFamily: 'var(--font-engraving-script)', fontStyle: 'italic' }}
                  >
                    <span className="font-option-name">Script (Cursive)</span>
                    <span className="font-option-desc">{t('', '流畅浪漫。最适合名字和短语。')}</span>
                  </button>
                  <button
                    className={`font-option ${engravingFont === 'serif' ? 'selected' : ''}`}
                    onClick={() => setEngravingFont('serif')}
                    style={{ fontFamily: 'var(--font-engraving-serif)' }}
                  >
                    <span className="font-option-name">Classic Serif</span>
                    <span className="font-option-desc">{t('', '优雅正式。永恒。')}</span>
                  </button>
                  <button
                    className={`font-option ${engravingFont === 'block' ? 'selected' : ''}`}
                    onClick={() => setEngravingFont('block')}
                    style={{ fontFamily: 'var(--font-engraving-block)', letterSpacing: '0.08em' }}
                  >
                    <span className="font-option-name">Modern Block</span>
                    <span className="font-option-desc">{t('', '简洁大胆。当代感。')}</span>
                  </button>
                </div>
                <div className={`engraving-preview font-${engravingFont}`}>
                  {engravingText}
                </div>
                <p className="engraving-placement-note">
                  {t(
                    `Placement: ${
                      selections['category'] === 'ring' ? 'Inner band of ring' :
                      ['stud-earring', 'dangling-earring'].includes(selections['category'] || '') ? 'Reverse face of earring' :
                      selections['category'] === 'pendant' ? 'Reverse face of pendant' :
                      selections['category'] === 'brooch' ? 'Reverse face of brooch' :
                      ['bracelet', 'bangle'].includes(selections['category'] || '') ? 'Inside clasp bar' :
                      selections['category'] === 'necklace' ? 'On clasp tag' :
                      selections['category'] === 'anklet' ? 'On clasp tag' : 'On the piece'
                    }.`,
                    `位置：${
                      selections['category'] === 'ring' ? '戒指内侧' :
                      ['stud-earring', 'dangling-earring'].includes(selections['category'] || '') ? '耳环背面' :
                      selections['category'] === 'pendant' ? '吊坠背面' :
                      selections['category'] === 'brooch' ? '胸针背面' :
                      ['bracelet', 'bangle'].includes(selections['category'] || '') ? '扣环内侧' :
                      selections['category'] === 'necklace' ? '扣环标签上' :
                      selections['category'] === 'anklet' ? '扣环标签上' : '在作品上'
                    }。`
                  )}
                </p>
              </>
            )}
          </div>
        )}

        {step.id === 'gift' && selections['gift'] && selections['gift'] !== 'standard' && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <input
              type="text"
              className="engraving-input"
              placeholder={t('Gift message (max 150 characters)', '礼物留言（最多150个字符）')}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value.slice(0, 150))}
              maxLength={150}
            />
          </div>
        )}

        {showCertificate && selections['stone'] && selections['stone'] !== 'none' && (
          <div className="certificate-preview fade-up">
            <h4>{t('Digital Certificate Preview', '数字证书预览')}</h4>
            <div className="certificate-detail">
              <span className="cert-label">{t('Stone', '宝石')}</span>
              <span className="cert-value">{getSelectionLabel('stone')}</span>
            </div>
            <div className="certificate-detail">
              <span className="cert-label">{t('Origin', '来源')}</span>
              <span className="cert-value">{t('Lab-Harvested', '实验室培育')}</span>
            </div>
            <div className="certificate-detail">
              <span className="cert-label">{t('Certification', '认证')}</span>
              <span className="cert-value">IGI / GIA</span>
            </div>
            <div className="certificate-detail">
              <span className="cert-label">{t('Unique ID', '唯一编号')}</span>
              <span className="cert-value">WK-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>
        )}

        {currentStep === 0 && (
          <button className="surprise-me-btn" onClick={handleSurpriseMe}>
            ✨ {t('Surprise Me — Randomise My Design', '惊喜推荐 — 随机配置')}
          </button>
        )}

        <div className="step-nav">
          {currentStep > 0 && (
            <button className="btn btn-ghost" onClick={handleBack}>
              {t('← Back', '← 返回')}
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ marginLeft: currentStep === 0 ? 'auto' : undefined }}
          >
            {currentStep < activeSteps.length - 1
              ? t('Continue →', '继续 →')
              : t('Review Design →', '审查设计 →')
            }
          </button>
        </div>
      </div>

      <div className="configurator-preview">
        <div className="preview-image-container">
          <Image
            src={previewImage}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="420px"
          />
        </div>
        <div className="preview-price">
          <div className="label">{t('Running Total', '动态总价')}</div>
          <div className="amount">SGD {totalPrice.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
