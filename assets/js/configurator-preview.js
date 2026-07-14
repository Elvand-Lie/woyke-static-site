/**
 * Resolves the best available preview image for the current configuration.
 *
 * The generated image directory structure uses naming conventions per category:
 *   - /images/rings/ring-pendant/ring-{shape}/ring-{shape}-{stone}.png
 *   - /images/stud/stud-{gold-}earring-{shape}.png
 *   - /images/pendant/pendant-{gold-}{shape}.png
 *   - /images/dangling/dangling-{gold-}{shape}.png
 *   - /images/Necklace/necklace-{gold-}{shape}.png
 *   - /images/Bracelet/bracelet-{gold-}{shape}.png
 *   - /images/Bangle/bangle-{gold-}{shape}.png
 *   - /images/Brooch/brooch-{gold-}{shape}.png
 *   - /images/Angklet/angklet-{gold-}{shape}.png
 *
 * @returns PreviewResult with src path, match quality, and alt text
 */
export function resolvePreviewAsset(selections, product, currentStep) {
    const category = selections['category'];
    const interchangeability = selections['interchangeability'];
    const stone = selections['stone'];
    const stoneShape = selections['stone-shape'];
    const metal = selections['metal'];
    const isGold = metal === '18k-gold';
    // ── Ring category ──
    if (category === 'ring') {
        const ringStyle = selections['ring-sub-type'];
        // Ring style previews (step 8a-0)
        if (ringStyle && (currentStep?.id === 'ring-sub-type' || interchangeability !== 'ring-pendant')) {
            const styleFileNameMap = {
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
                return {
                    src: `/images/rings/ring-pendant/ring-style/${isGold ? 'ring-gold-style' : 'ring-style'}-${mappedStyle}.png`,
                    match: 'exact',
                    alt: `${ringStyle} ring style preview`,
                };
            }
        }
    }
    // ── Ring ↔ Pendant interchangeable flow ──
    if (interchangeability === 'ring-pendant' && (category === 'ring' || category === 'pendant')) {
        if (stoneShape && stone && stone !== 'none') {
            const shapeFileMap = {
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
            const stoneFileMap = {
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
                    return {
                        src: `/images/rings/ring-pendant/ring-gold/ring-gold-${goldShapeName}-${stoneFile}.png`,
                        match: 'exact',
                        alt: `${stone} ${stoneShape} ring in gold`,
                    };
                }
                return {
                    src: `/images/rings/ring-pendant/ring-${stoneShape}/ring-${shapeName}-${stoneFile}.png`,
                    match: 'exact',
                    alt: `${stone} ${stoneShape} ring`,
                };
            }
        }
        if (stone && stone !== 'none') {
            return {
                src: `/images/rings/ring-pendant/ring-pendant-${stone}.png`,
                match: 'representative',
                alt: `${stone} ring-pendant preview`,
            };
        }
        return {
            src: '/images/rings/ring-pendant/ring-pendant-hero.png',
            match: 'fallback',
            alt: 'Ring-pendant design preview',
        };
    }
    // ── Standalone pendant ──
    if (category === 'pendant') {
        const pendantStyle = selections['pendant-style'];
        const styleMap = {
            'solitaire-pendant': 'solitaire',
            'halo-pendant': 'halo',
        };
        const mappedStyle = pendantStyle ? styleMap[pendantStyle] : null;
        const pendantShapeMap = {
            'asscher': 'asscher', 'cushion': 'cushion', 'emerald-cut': 'emerald',
            'heart': 'heart', 'marquise': 'marquise', 'oval': 'oval',
            'pear': 'pear', 'princess': 'princess', 'radiant': 'radiant',
        };
        const mappedShape = stoneShape ? pendantShapeMap[stoneShape] : null;
        if (mappedStyle && isGold) {
            return { src: `/images/pendant/pendant-style/pendant-gold-style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} pendant in gold` };
        }
        if (mappedShape) {
            return { src: `/images/pendant/pendant-${isGold ? 'gold-' : ''}${mappedShape}.png`, match: 'exact', alt: `${mappedShape} pendant` };
        }
        return { src: `/images/pendant/pendant${isGold ? '-gold' : ''}.png`, match: 'fallback', alt: 'Pendant preview' };
    }
    // ── Stud earring (or dangling with stud-dangling interchangeability) ──
    if (category === 'stud-earring' || (category === 'dangling-earring' && interchangeability === 'stud-dangling')) {
        const isDangling = interchangeability === 'stud-dangling';
        const studSetting = selections['stud-setting'];
        const studShapeMap = {
            'asscher': 'asscher', 'cushion': 'cushion', 'emerald-cut': 'emerald',
            'heart': 'heart', 'marquise': 'marquise', 'oval': 'oval',
            'pear': 'pear', 'princess': 'princess', 'radiant': 'radiant',
        };
        const studStyleGoldMap = {
            'round-claw-6': '6 claw', 'sharp-claw': 'sharp pointed',
            'l-prong': 'L prong', 'bezel-full': 'bazel full',
            'half-bezel': 'half bazel', 'halo-stud': 'halo',
            'wrapped': 'wrapped', 'milgrain-halo': 'milgrain halo',
            'starburst': 'starbust',
        };
        const studStylePlatinumMap = {
            'round-claw-6': '6 claw', 'sharp-claw': 'sharp pointed',
            'l-prong': 'L Prong', 'bezel-full': 'bazel full',
            'half-bezel': 'half-bazel', 'halo-stud': 'halo',
            'wrapped': 'wrapped', 'milgrain-halo': 'milgrain halo',
            'starburst': 'starbust',
        };
        const mappedShape = stoneShape ? studShapeMap[stoneShape] : null;
        const mappedStyle = studSetting
            ? (isGold ? studStyleGoldMap[studSetting] : studStylePlatinumMap[studSetting])
            : null;
        if (isDangling) {
            if (mappedStyle) {
                if (isGold) {
                    return { src: `/images/stud/stud-dangling-style/stud-gold-dangling-style-${mappedStyle}.png`, match: 'exact', alt: `Gold dangling stud ${mappedStyle}` };
                }
                return { src: `/images/stud/stud-dangling-style/stud-dangling-style-${mappedStyle}.png`, match: 'exact', alt: `Dangling stud ${mappedStyle}` };
            }
            if (isGold) {
                return { src: '/images/stud/stud-dangling-style/stud-gold-dangling-style.png', match: 'representative', alt: 'Gold dangling stud preview' };
            }
            if (mappedShape) {
                return { src: `/images/stud/stud-dangling/stud-earring-dangling-${mappedShape}.png`, match: 'exact', alt: `Dangling stud ${mappedShape}` };
            }
            return { src: '/images/stud/stud-dangling/stud-earring-dangling-oval.png', match: 'fallback', alt: 'Dangling stud preview' };
        }
        else {
            if (mappedStyle) {
                const prefix = isGold ? 'stud-gold-style-earring' : 'sstud-style-earring';
                const goldStyle = mappedStyle === 'starbust' && isGold ? 'startbust' : mappedStyle;
                const finalStyle = isGold ? goldStyle : mappedStyle;
                return { src: `/images/stud/stud-style/${prefix}-${finalStyle}.png`, match: 'exact', alt: `Stud earring ${finalStyle}` };
            }
            if (mappedShape) {
                return { src: `/images/stud/stud-${isGold ? 'gold-' : ''}earring-${mappedShape}.png`, match: 'exact', alt: `Stud earring ${mappedShape}` };
            }
            return { src: `/images/stud/stud-${isGold ? 'gold-' : ''}earring.png`, match: 'fallback', alt: 'Stud earring preview' };
        }
    }
    // ── Standalone dangling earring ──
    if (category === 'dangling-earring') {
        const danglingShapeMap = {
            'asscher': 'asscher', 'cushion': 'cushion', 'emerald-cut': 'emerald',
            'heart': 'heart', 'marquise': 'marquise', 'oval': 'oval',
            'pear': 'pear', 'princess': 'princess', 'radiant': 'radiant',
        };
        const mappedShape = stoneShape ? danglingShapeMap[stoneShape] : null;
        if (mappedShape) {
            return { src: `/images/dangling/dangling-${isGold ? 'gold-' : ''}${mappedShape}.png`, match: 'exact', alt: `Dangling earring ${mappedShape}` };
        }
        return { src: `/images/dangling/dangling${isGold ? '-gold' : ''}.png`, match: 'fallback', alt: 'Dangling earring preview' };
    }
    // ── Generic shape map for remaining categories ──
    const shapeMap = {
        'asscher': 'asscher', 'cushion': 'cushion', 'emerald-cut': 'emerald',
        'heart': 'heart', 'marquise': 'marquise', 'oval': 'oval',
        'pear': 'pear', 'princess': 'princess', 'radiant': 'radiant',
    };
    const mappedGenericShape = stoneShape ? shapeMap[stoneShape] : null;
    // ── Necklace ──
    if (category === 'necklace') {
        const nStyle = selections['necklace-style'];
        const styleMap = {
            'tennis': 'tennis', 'station': 'station', 'graduated': 'graduated',
            'lariat': 'lariat y', 'bib': 'bib', 'collar-choker': 'collar',
            'opera-long': 'opera chain', 'layering-chain': 'layering',
        };
        const mappedStyle = nStyle ? styleMap[nStyle] : null;
        if (mappedStyle)
            return { src: `/images/Necklace/necklace-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} necklace` };
        if (mappedGenericShape)
            return { src: `/images/Necklace/necklace-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`, match: 'exact', alt: `${mappedGenericShape} necklace` };
        return { src: `/images/Necklace/necklace-${isGold ? 'gold-' : ''}style-tennis.png`, match: 'fallback', alt: 'Necklace preview' };
    }
    // ── Bracelet ──
    if (category === 'bracelet') {
        const bStyle = selections['bracelet-style'];
        const styleMap = {
            'tennis': 'tennis', 'station': 'station', 'chain-bracelet': 'chain',
            'cuff-bracelet': 'cuff', 'charm-bracelet': 'charm', 'link-bracelet': 'link',
            'bar-bracelet': 'bar',
        };
        const mappedStyle = bStyle ? styleMap[bStyle] : null;
        if (mappedStyle)
            return { src: `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} bracelet` };
        if (mappedGenericShape) {
            let shapeName = mappedGenericShape;
            if (isGold && shapeName === 'emerald')
                shapeName = 'emeraldd';
            return { src: `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}${shapeName}.png`, match: 'exact', alt: `${shapeName} bracelet` };
        }
        return { src: `/images/Bracelet/bracelet-${isGold ? 'gold-' : ''}style-tennis.png`, match: 'fallback', alt: 'Bracelet preview' };
    }
    // ── Bangle ──
    if (category === 'bangle') {
        const bStruct = selections['bangle-structure'];
        const styleMap = {
            'full-round': 'full', 'hinged': 'hinged', 'hinged-safety': 'hinged safety lock',
            'c-shaped': 'c shape', 'spiral-coil': 'spiral', 'stacking-set': 'stacking',
        };
        const mappedStyle = bStruct ? styleMap[bStruct] : null;
        if (mappedStyle)
            return { src: `/images/Bangle/bangle-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} bangle` };
        if (mappedGenericShape)
            return { src: `/images/Bangle/bangle-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`, match: 'exact', alt: `${mappedGenericShape} bangle` };
        return { src: `/images/Bangle/bangle-${isGold ? 'gold-' : ''}style-full.png`, match: 'fallback', alt: 'Bangle preview' };
    }
    // ── Brooch ──
    if (category === 'brooch') {
        const brStyle = selections['brooch-style'];
        const styleMap = {
            'floral-corsage': 'floral', 'starburst': 'starburst', 'bar-brooch': 'bar-brooch',
            'cluster-bouquet': 'cluster-bouquet', 'geometric-abstract': 'geometric',
            'animal-figural': 'animal', 'crescent': 'moon', 'circular-disc': 'circular',
            'bow-ribbon': 'bow-ribbonn',
        };
        const mappedStyle = brStyle ? styleMap[brStyle] : null;
        if (mappedStyle) {
            if (isGold) {
                if (mappedStyle === 'bow-ribbonn')
                    return { src: '/images/Brooch/brooch-gold-style-bow-ribbon.png', match: 'exact', alt: 'Gold bow ribbon brooch' };
                return { src: `/images/Brooch/brooch-style-gold-${mappedStyle}.png`, match: 'exact', alt: `Gold ${mappedStyle} brooch` };
            }
            return { src: `/images/Brooch/brooch-style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} brooch` };
        }
        if (mappedGenericShape)
            return { src: `/images/Brooch/brooch-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`, match: 'exact', alt: `${mappedGenericShape} brooch` };
        if (isGold)
            return { src: '/images/Brooch/brooch-style-gold-floral.png', match: 'fallback', alt: 'Gold brooch preview' };
        return { src: '/images/Brooch/brooch-style-floral.png', match: 'fallback', alt: 'Brooch preview' };
    }
    // ── Anklet ──
    if (category === 'anklet') {
        const aStyle = selections['anklet-style'];
        const styleMap = {
            'delicate-chain': 'delicate chain', 'station-anklet': 'station',
            'tennis-anklet': 'tennis', 'layered-anklet': 'layered',
            'charm-anklet': 'charm', 'body-chain-anklet': 'body chain',
        };
        const mappedStyle = aStyle ? styleMap[aStyle] : null;
        if (mappedStyle)
            return { src: `/images/Angklet/angklet-${isGold ? 'gold-' : ''}style-${mappedStyle}.png`, match: 'exact', alt: `${mappedStyle} anklet` };
        if (mappedGenericShape)
            return { src: `/images/Angklet/angklet-${isGold ? 'gold-' : ''}${mappedGenericShape}.png`, match: 'exact', alt: `${mappedGenericShape} anklet` };
        return { src: `/images/Angklet/angklet-${isGold ? 'gold-' : ''}style-delicate chain.png`, match: 'fallback', alt: 'Anklet preview' };
    }
    // ── Ring fallback (no interchangeability, early steps) ──
    if (category === 'ring') {
        return { src: '/images/rings/ring-hero.png', match: 'fallback', alt: 'Ring design preview' };
    }
    // ── Final fallback: product hero image ──
    return { src: product.image, match: 'fallback', alt: product.name };
}
