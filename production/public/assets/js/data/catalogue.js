import { products, categoryLabels, allCategories, getProductBySlug } from '../configurator-products.js';

// These five are the strongest existing studies for the initial interest test.
// They remain representative until client-approved SKU photography replaces them.
export const FEATURED_MEDIA_SLUGS = [
  'imperial-jade-bloom-ring',
  'jade-cabochon-statement-ring',
  'celestial-diamond-floral-ring',
  'cushion-brilliance-ring',
  'emerald-marquise-ring',
];

const CURATED_MEDIA = {
  'imperial-jade-bloom-ring': ['/assets/media/images/jade-final-statement.webp', '/assets/media/images/jade-final-hand.webp', '/assets/media/images/jade-initial-hand.webp'],
  'jade-cabochon-statement-ring': ['/assets/media/images/jade-dark.webp', '/assets/media/images/jade-final-statement.webp', '/assets/media/images/jade-final-hand.webp'],
  'celestial-diamond-floral-ring': ['/images/rings/ring_01.png', '/images/rings/ring_02.png'],
  'cushion-brilliance-ring': ['/images/rings/ring_05.png', '/images/rings/ring_06.png'],
  'emerald-marquise-ring': ['/images/rings/ring_20.png', '/images/rings/ring_21.png'],
};

const CATEGORY_STUDIES = {
  ring: ['/images/rings/ring_01.png', '/images/rings/ring_02.png'],
  'stud-earring': ['/images/stud/stud-earring.png', '/images/stud/stud-gold-earring.png'],
  'dangling-earring': ['/images/dangling/dangling.png', '/images/dangling/dangling-gold.png'],
  pendant: ['/images/pendant/pendant.png', '/images/pendant/pendant-gold.png'],
  necklace: ['/images/Necklace/necklace-gold.png', '/images/Necklace/necklace-gold.png'],
  bracelet: ['/images/Bracelet/bracelet.png', '/images/Bracelet/bracelet-gold.png'],
  bangle: ['/images/Bangle/bangle.png', '/images/Bangle/bangle-gold.png'],
  brooch: ['/images/Brooch/brooch.png', '/images/Brooch/brooch-gold.png'],
  anklet: ['/images/Angklet/angklet.png', '/images/Angklet/angklet-gold.png'],
};

export { products, categoryLabels, allCategories, getProductBySlug };

export function productMedia(product) {
  const curated = CURATED_MEDIA[product?.slug];
  const studies = CATEGORY_STUDIES[product?.category] || ['/assets/media/images/product-final.webp'];
  return { images: [...new Set(curated || studies)], isCurated: Boolean(curated) };
}

export function productImage(product) {
  return productMedia(product).images[0];
}

export function productImages(product) {
  return productMedia(product).images;
}

export function isLeadMediaProduct(product) {
  return product?.slug === FEATURED_MEDIA_SLUGS[0];
}

export function categoryName(category) {
  return categoryLabels[category]?.en || category;
}

export function catalogueQuery({ category = 'all', query = '', sort = 'featured' } = {}) {
  const needle = query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const categoryMatch = category === 'all' || product.category === category;
    const haystack = `${product.name} ${product.description} ${product.materials?.join(' ') || ''}`.toLowerCase();
    return categoryMatch && (!needle || haystack.includes(needle));
  });
  return filtered.sort((a, b) => {
    if (sort === 'featured') {
      const rankA = FEATURED_MEDIA_SLUGS.indexOf(a.slug);
      const rankB = FEATURED_MEDIA_SLUGS.indexOf(b.slug);
      if (rankA >= 0 || rankB >= 0) return (rankA < 0 ? Number.MAX_SAFE_INTEGER : rankA) - (rankB < 0 ? Number.MAX_SAFE_INTEGER : rankB);
    }
    if (sort === 'price-asc') return a.basePrice - b.basePrice;
    if (sort === 'price-desc') return b.basePrice - a.basePrice;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
  });
}