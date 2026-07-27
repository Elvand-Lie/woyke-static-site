'use client';

import { use, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, products } from '@/data/products';

import { useCartStore } from '@/store/cart-store';
import { useLangStore } from '@/store/lang-store';
import { getActiveConfigSteps, getFilteredOptions, getSelectionLabel, buildNarrative, buildCartPayload, getEngravingPlacement } from '@/domain/configurator/engine';
import { calculatePrice } from '@/domain/configurator/pricing';
import { resolvePreviewAsset } from '@/domain/configurator/preview';
import type { PreviewResult } from '@/domain/configurator/types';
import './design.css';

export default function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const { t, lang } = useLangStore();
  const addItem = useCartStore((s) => s.addItem);

  // ── State ──
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState<'script' | 'serif' | 'block'>('script');
  const [giftMessage, setGiftMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [show4C, setShow4C] = useState(false);
  const [advanced4C, setAdvanced4C] = useState<Record<string, string>>({});

  // ── Derived state via extracted engine ──
  const activeSteps = useMemo(() => getActiveConfigSteps(selections), [selections]);
  const step = activeSteps[currentStep];
  const progress = activeSteps.length > 0 ? ((currentStep + 1) / activeSteps.length) * 100 : 0;
  const stepOptions = step ? getFilteredOptions(step, selections) : [];

  const preview: PreviewResult = useMemo(
    () => product ? resolvePreviewAsset(selections, product, step) : { src: '', match: 'fallback' as const, alt: '' },
    [selections, product, step]
  );

  const priceBreakdown = useMemo(
    () => product ? calculatePrice(product.basePrice, selections, activeSteps, engravingText) : { basePrice: 0, upcharges: [], engravingSurcharge: 0, total: 0 },
    [selections, product, activeSteps, engravingText]
  );

  const narrative = useMemo(() => buildNarrative(selections, lang), [selections, lang]);

  // ── Handlers ──
  const handleSelect = useCallback((stepId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const payload = buildCartPayload(
      { product, currentStep, selections, engravingText, engravingFont, giftMessage },
      priceBreakdown.total,
      lang
    );
    addItem(payload);
    window.location.href = '/cart';
  };

  // ── Not found ──
  if (!product) {
    const fallback = products[0];
    return (
      <div className="wy-design-not-found">
        <h2>{t('Product not found', '未找到产品')}</h2>
        <p>{t('The requested design was not found.', '未找到请求的设计。')}</p>
        <Link href={`/design/${fallback.slug}`} className="wy-btn wy-btn-primary">
          {t('Start Designing', '开始设计')}
        </Link>
      </div>
    );
  }

  // ── Summary / Complete view ──
  if (isComplete) {
    return (
      <div className="wy-design">
        <div className="wy-design-controls">
          <div className="wy-summary">
            <div className="wy-summary-header">
              <span className="wy-mono wy-kicker">Design Summary</span>
              <h2 className="wy-display">{t('Your Design', '您的设计')}</h2>
            </div>

            {narrative && <p className="wy-narrative">{narrative}</p>}

            <div className="wy-summary-rows">
              {activeSteps.map((s) => {
                const label = getSelectionLabel(s.id, selections, lang);
                if (!label) return null;
                return (
                  <div key={s.id} className="wy-summary-row">
                    <span className="wy-summary-key">{lang === 'cn' ? s.nameCn : s.name}</span>
                    <span className="wy-summary-val">{label}</span>
                  </div>
                );
              })}
              {engravingText && (
                <div className="wy-summary-row">
                  <span className="wy-summary-key">{t('Engraving', '刻字')}</span>
                  <span className="wy-summary-val">&ldquo;{engravingText}&rdquo;</span>
                </div>
              )}
            </div>

            <div className="wy-summary-total">
              <span>{t('Total', '总计')}</span>
              <span>SGD {priceBreakdown.total.toLocaleString()}</span>
            </div>

            <p className="wy-lead-time">{t('Crafted with care in 3–4 weeks', '3-4周精心制作')}</p>

            <div className="wy-summary-actions">
              <button className="wy-btn wy-btn-ghost" onClick={() => setIsComplete(false)}>
                {t('← Edit Design', '← 编辑设计')}
              </button>
              <button className="wy-btn wy-btn-primary" onClick={handleAddToCart} id="add-to-cart-btn">
                {t('Add to Cart', '加入购物车')}
              </button>
            </div>
          </div>
        </div>

        <aside className="wy-design-preview">
          <div className="wy-preview-stage">
            <Image src={preview.src} alt={preview.alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            {preview.match !== 'exact' && (
              <span className="wy-preview-badge wy-mono">{t('Representative preview', '代表性预览')}</span>
            )}
          </div>
          <div className="wy-preview-price">
            <span className="wy-mono">TOTAL</span>
            <strong>SGD {priceBreakdown.total.toLocaleString()}</strong>
          </div>
        </aside>
      </div>
    );
  }

  // ── Step view ──
  if (!step) return null;

  return (
    <div className="wy-design">
      {/* ── Controls ── */}
      <section className="wy-design-controls" aria-labelledby="wy-step-title">
        {/* Progress */}
        <div className="wy-progress">
          <span className="wy-mono">{String(step.displayStep || currentStep + 1).padStart(2, '0')} / 11</span>
          <div className="wy-progress-track"><div className="wy-progress-fill" style={{ width: `${progress}%` }} /></div>
          <span className="wy-mono wy-progress-label">{(step.name).toUpperCase()}</span>
        </div>

        {/* Question */}
        <div className="wy-question">
          <span className="wy-kicker wy-mono">Digital atelier</span>
          <h1 id="wy-step-title" className="wy-display">{lang === 'cn' ? step.nameCn : step.name}</h1>
          {step.description && <p className="wy-lede">{lang === 'cn' ? step.descriptionCn : step.description}</p>}
        </div>

        {/* Guide images */}
        {step.guide?.images && (
          <div className="wy-guide">
            {step.guide.images.map((img, i) => (
              <Image key={i} src={img} alt="Size guide" width={400} height={300} className="wy-guide-img" />
            ))}
            {step.guide.text && <p className="wy-guide-text">{lang === 'cn' ? (step.guide.textCn || step.guide.text) : step.guide.text}</p>}
          </div>
        )}

        {/* Options: card-grid / image-swatch / dropdown */}
        {(step.type === 'card-grid' || step.type === 'image-swatch' || step.type === 'dropdown') && (
          <div className={`wy-options ${step.type === 'dropdown' ? 'wy-options-compact' : ''}`} role="radiogroup" aria-label={step.name}>
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                role="radio"
                aria-checked={selections[step.id] === opt.value}
                className={`wy-option ${selections[step.id] === opt.value ? 'wy-option-selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                {opt.color && <span className="wy-option-swatch" style={{ background: opt.color }} />}
                <span className="wy-option-label">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.description && <span className="wy-option-desc">{lang === 'cn' ? opt.descriptionCn : opt.description}</span>}
                {opt.upcharge !== 0 && (
                  <span className="wy-option-price">{opt.upcharge > 0 ? `+SGD ${opt.upcharge}` : `-SGD ${Math.abs(opt.upcharge)}`}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Options: swatch (metal colour) */}
        {step.type === 'swatch' && (
          <div className="wy-swatches" role="radiogroup" aria-label={step.name}>
            {stepOptions.map((opt) => (
              <button
                key={opt.id}
                role="radio"
                aria-checked={selections[step.id] === opt.value}
                className={`wy-swatch ${selections[step.id] === opt.value ? 'wy-swatch-selected' : ''}`}
                onClick={() => handleSelect(step.id, opt.value)}
              >
                <span className="wy-swatch-disc" style={{ background: opt.color || '#ccc' }} />
                <span className="wy-swatch-name">{lang === 'cn' ? opt.labelCn : opt.label}</span>
                {opt.description && <span className="wy-swatch-desc">{lang === 'cn' ? opt.descriptionCn : opt.description}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Options: text (engraving) */}
        {step.type === 'text' && (
          <div className="wy-engraving">
            <input
              type="text"
              className="wy-input"
              placeholder={t('Enter your message (max 30 characters)', '输入您的信息（最多30个字符）')}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value.slice(0, 30))}
              maxLength={30}
            />
            <span className="wy-char-count wy-mono">{engravingText.length}/30</span>

            {engravingText && (
              <>
                <p className="wy-font-label">{t('Choose your font', '选择字体')}</p>
                <div className="wy-font-grid">
                  {(['script', 'serif', 'block'] as const).map((f) => (
                    <button
                      key={f}
                      className={`wy-font-btn ${engravingFont === f ? 'wy-font-btn-selected' : ''}`}
                      onClick={() => setEngravingFont(f)}
                      style={{ fontFamily: f === 'script' ? 'Georgia, serif' : f === 'serif' ? 'Georgia, serif' : 'monospace', fontStyle: f === 'script' ? 'italic' : 'normal' }}
                    >
                      {f === 'script' ? 'Script' : f === 'serif' ? 'Classic Serif' : 'Modern Block'}
                    </button>
                  ))}
                </div>
                <div className="wy-engraving-preview" style={{ fontFamily: engravingFont === 'block' ? 'monospace' : 'Georgia, serif', fontStyle: engravingFont === 'script' ? 'italic' : 'normal' }}>
                  {engravingText}
                </div>
                <p className="wy-placement wy-mono">
                  {t('Placement', '位置')}: {getEngravingPlacement(selections['category'] || '', lang)}
                </p>
              </>
            )}
          </div>
        )}

        {/* Advanced 4C (on stone-size step) */}
        {step.id === 'stone-size' && (
          <div className="wy-advanced">
            <button className="wy-advanced-toggle" onClick={() => setShow4C(!show4C)}>
              {show4C ? '▾' : '▸'} {t('Advanced: Exact carat, cut, colour, clarity', '高级选项')}
            </button>
            {show4C && (
              <div className="wy-four-c">
                {[
                  { key: 'cut', label: t('Cut Grade', '切工等级'), options: ['Good', 'Very Good', 'Ideal', 'Super Ideal'] },
                  { key: 'colour', label: t('Colour Grade', '颜色等级'), options: ['D', 'E', 'F', 'G', 'H', 'I', 'J'] },
                  { key: 'clarity', label: t('Clarity', '净度'), options: ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'] },
                  { key: 'certificate', label: t('Certificate', '证书'), options: ['IGI', 'GIA'] },
                ].map(({ key, label, options }) => (
                  <div key={key} className="wy-four-c-group">
                    <label className="wy-mono">{label}</label>
                    <div className="wy-four-c-row">
                      {options.map((g) => (
                        <button key={g} className={`wy-pill ${advanced4C[key] === g ? 'wy-pill-selected' : ''}`} onClick={() => setAdvanced4C((p) => ({ ...p, [key]: g }))}>{g}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Side stones prompt */}
            <div className="wy-side-prompt">
              <p>{t('Would you like to add side stones?', '您想要添加副石吗？')}</p>
              <div className="wy-side-prompt-btns">
                <button className={`wy-btn wy-btn-sm ${selections['want-side-stones'] === 'yes' ? 'wy-btn-primary' : 'wy-btn-ghost'}`} onClick={() => handleSelect('want-side-stones', 'yes')}>
                  {t('Yes', '是')}
                </button>
                <button className={`wy-btn wy-btn-sm ${selections['want-side-stones'] === 'no' ? 'wy-btn-primary' : 'wy-btn-ghost'}`} onClick={() => handleSelect('want-side-stones', 'no')}>
                  {t('No, skip to metal', '不，跳到金属')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gift message */}
        {step.id === 'gift' && selections['gift'] && selections['gift'] !== 'standard' && (
          <div className="wy-gift-msg">
            <input
              type="text"
              className="wy-input"
              placeholder={t('Gift message (max 150 characters)', '礼物留言（最多150个字符）')}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value.slice(0, 150))}
              maxLength={150}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="wy-nav">
          {currentStep > 0 && (
            <button className="wy-btn wy-btn-ghost" onClick={handleBack}>
              <span>{t('Back', '返回')}</span>
            </button>
          )}
          <button
            className="wy-btn wy-btn-primary"
            onClick={handleNext}
            style={{ marginLeft: currentStep === 0 ? 'auto' : undefined }}
          >
            <span>{currentStep < activeSteps.length - 1 ? t('Continue', '继续') : t('Review Design', '审查设计')}</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* ── Preview ── */}
      <aside className="wy-design-preview" aria-label="Live design preview">
        <div className="wy-preview-stage">
          <Image
            src={preview.src}
            alt={preview.alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {preview.match !== 'exact' && (
            <span className="wy-preview-badge wy-mono">{t('Representative preview', '代表性预览')}</span>
          )}
        </div>

        <div className="wy-preview-price">
          <span className="wy-mono">DEMO TOTAL</span>
          <strong>SGD {priceBreakdown.total.toLocaleString()}</strong>
        </div>

        <div className="wy-preview-specs wy-mono">
          <span>FORM / {(selections['category'] || 'RING').toUpperCase()}</span>
          <span>STONE / {(selections['stone'] || 'DIAMOND').toUpperCase()}</span>
          <span>METAL / {(selections['metal'] || '—').toUpperCase()}</span>
        </div>
      </aside>
    </div>
  );
}
