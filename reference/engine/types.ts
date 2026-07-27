import type { Product } from '@/data/products';

/** Result of resolving a preview image for a configuration state */
export interface PreviewResult {
  src: string;
  match: 'exact' | 'representative' | 'fallback';
  alt: string;
}

/** The full state of a configurator session */
export interface ConfiguratorState {
  product: Product;
  currentStep: number;
  selections: Record<string, string>;
  engravingText: string;
  engravingFont: 'script' | 'serif' | 'block';
  giftMessage: string;
}

/** A payload ready for the cart store */
export interface CartPayload {
  productId: string;
  productName: string;
  image: string;
  price: number;
  selections: Record<string, string>;
  engraving?: string;
  engravingFont?: string;
  giftMessage?: string;
}

/** Price breakdown for display */
export interface PriceBreakdown {
  basePrice: number;
  upcharges: { stepName: string; amount: number }[];
  engravingSurcharge: number;
  total: number;
}
