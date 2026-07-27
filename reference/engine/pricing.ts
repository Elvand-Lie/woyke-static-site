import type { ConfigStep } from '@/data/options';
import type { PriceBreakdown } from './types';

const ENGRAVING_SURCHARGE = 50;

/**
 * Calculates the full price breakdown for a configuration.
 *
 * @param basePrice    - The product's base price
 * @param selections   - Current step selections (step.id → option.value)
 * @param activeSteps  - The filtered list of currently active steps
 * @param engravingText - Current engraving text (surcharge if non-empty)
 * @returns A PriceBreakdown with itemised upcharges and total
 */
export function calculatePrice(
  basePrice: number,
  selections: Record<string, string>,
  activeSteps: ConfigStep[],
  engravingText: string
): PriceBreakdown {
  const upcharges: { stepName: string; amount: number }[] = [];

  activeSteps.forEach((step) => {
    const selectedValue = selections[step.id];
    if (selectedValue) {
      const option = step.options.find((o) => o.value === selectedValue);
      if (option && option.upcharge !== 0) {
        upcharges.push({ stepName: step.name, amount: option.upcharge });
      }
    }
  });

  const engravingSurcharge = engravingText.trim() ? ENGRAVING_SURCHARGE : 0;

  const total = Math.max(
    0,
    basePrice +
      upcharges.reduce((sum, u) => sum + u.amount, 0) +
      engravingSurcharge
  );

  return {
    basePrice,
    upcharges,
    engravingSurcharge,
    total,
  };
}
