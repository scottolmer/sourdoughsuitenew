import {
  // Baker's Percentage
  calculateAmountFromPercentage,
  calculatePercentageFromAmount,
  // Hydration
  calculateHydrationPercent,
  calculateWaterNeeded,
  calculateFlourNeeded,
  // Scaling
  calculateScaleFactor,
  scaleAmount,
  // Starter/Preferment
  decomposeLevain,
  calculateStarterPercentage,
  calculatePrefermentFlour,
  // Dough Weight
  calculatePreBakeWeight,
  calculateWeightLoss,
  calculateWeightLossPercent,
  // Temperature
  calculateWaterTemperature,
  // Utilities
  roundTo,
  formatWeight,
  formatPercent,
  validatePositiveNumber,
  validatePercentage,
} from '../sourdoughCalculations';

describe('sourdoughCalculations', () => {
  // ==========================================================================
  // Baker's Percentage Functions
  // ==========================================================================

  describe('calculateAmountFromPercentage', () => {
    it('calculates water at 70% correctly', () => {
      expect(calculateAmountFromPercentage(1000, 70)).toBe(700);
    });

    it('calculates salt at 2% correctly', () => {
      expect(calculateAmountFromPercentage(1000, 2)).toBe(20);
    });

    it('handles zero flour weight', () => {
      expect(calculateAmountFromPercentage(0, 70)).toBe(0);
    });

    it('handles fractional percentages', () => {
      expect(calculateAmountFromPercentage(1000, 2.5)).toBe(25);
    });
  });

  describe('calculatePercentageFromAmount', () => {
    it('calculates 70% from amounts', () => {
      expect(calculatePercentageFromAmount(700, 1000)).toBe(70);
    });

    it('calculates 2% from amounts', () => {
      expect(calculatePercentageFromAmount(20, 1000)).toBe(2);
    });

    it('handles zero flour weight', () => {
      expect(calculatePercentageFromAmount(100, 0)).toBe(0);
    });

    it('handles fractional results', () => {
      expect(calculatePercentageFromAmount(333, 1000)).toBeCloseTo(33.3, 1);
    });
  });

  // ==========================================================================
  // Hydration Functions
  // ==========================================================================

  describe('calculateHydrationPercent', () => {
    it('calculates 70% hydration correctly', () => {
      expect(calculateHydrationPercent(700, 1000)).toBe(70);
    });

    it('calculates 100% hydration correctly', () => {
      expect(calculateHydrationPercent(1000, 1000)).toBe(100);
    });

    it('handles zero flour weight', () => {
      expect(calculateHydrationPercent(700, 0)).toBe(0);
    });

    it('handles high hydration (>100%)', () => {
      expect(calculateHydrationPercent(1200, 1000)).toBe(120);
    });
  });

  describe('calculateWaterNeeded', () => {
    it('calculates water for 70% hydration', () => {
      expect(calculateWaterNeeded(1000, 70)).toBe(700);
    });

    it('calculates water for 100% hydration', () => {
      expect(calculateWaterNeeded(1000, 100)).toBe(1000);
    });

    it('handles zero flour', () => {
      expect(calculateWaterNeeded(0, 70)).toBe(0);
    });
  });

  describe('calculateFlourNeeded', () => {
    it('calculates flour for 70% hydration', () => {
      expect(calculateFlourNeeded(700, 70)).toBe(1000);
    });

    it('calculates flour for 100% hydration', () => {
      expect(calculateFlourNeeded(1000, 100)).toBe(1000);
    });

    it('handles zero hydration', () => {
      expect(calculateFlourNeeded(700, 0)).toBe(0);
    });
  });

  // ==========================================================================
  // Scaling Functions
  // ==========================================================================

  describe('calculateScaleFactor', () => {
    it('calculates 1.5x scale factor', () => {
      expect(calculateScaleFactor(1000, 1500)).toBe(1.5);
    });

    it('calculates 0.5x scale factor', () => {
      expect(calculateScaleFactor(1000, 500)).toBe(0.5);
    });

    it('handles zero original (returns 1)', () => {
      expect(calculateScaleFactor(0, 1000)).toBe(1);
    });

    it('calculates 2x scale factor', () => {
      expect(calculateScaleFactor(500, 1000)).toBe(2);
    });
  });

  describe('scaleAmount', () => {
    it('scales amount by 1.5x', () => {
      expect(scaleAmount(500, 1.5)).toBe(750);
    });

    it('scales amount by 0.5x', () => {
      expect(scaleAmount(500, 0.5)).toBe(250);
    });

    it('scales amount by 2x', () => {
      expect(scaleAmount(500, 2)).toBe(1000);
    });
  });

  // ==========================================================================
  // Starter/Preferment Functions
  // ==========================================================================

  describe('decomposeLevain', () => {
    it('decomposes 100g levain at 100% hydration', () => {
      const result = decomposeLevain(100, 100);
      expect(result.flour).toBeCloseTo(50, 1);
      expect(result.water).toBeCloseTo(50, 1);
    });

    it('decomposes 100g levain at 80% hydration', () => {
      const result = decomposeLevain(100, 80);
      expect(result.flour).toBeCloseTo(55.56, 1);
      expect(result.water).toBeCloseTo(44.44, 1);
    });

    it('decomposes 200g levain at 100% hydration', () => {
      const result = decomposeLevain(200, 100);
      expect(result.flour).toBeCloseTo(100, 1);
      expect(result.water).toBeCloseTo(100, 1);
    });

    it('handles 50% hydration (stiff starter)', () => {
      const result = decomposeLevain(150, 50);
      expect(result.flour).toBeCloseTo(100, 1);
      expect(result.water).toBeCloseTo(50, 1);
    });
  });

  describe('calculateStarterPercentage', () => {
    it('calculates 10% starter', () => {
      expect(calculateStarterPercentage(100, 1000)).toBe(10);
    });

    it('calculates 20% starter', () => {
      expect(calculateStarterPercentage(200, 1000)).toBe(20);
    });

    it('handles zero total flour', () => {
      expect(calculateStarterPercentage(100, 0)).toBe(0);
    });
  });

  describe('calculatePrefermentFlour', () => {
    it('calculates 20% preferment flour', () => {
      expect(calculatePrefermentFlour(1000, 20)).toBe(200);
    });

    it('calculates 30% preferment flour', () => {
      expect(calculatePrefermentFlour(1000, 30)).toBe(300);
    });

    it('handles 0% preferment', () => {
      expect(calculatePrefermentFlour(1000, 0)).toBe(0);
    });
  });

  // ==========================================================================
  // Dough Weight Functions
  // ==========================================================================

  describe('calculatePreBakeWeight', () => {
    it('calculates pre-bake weight with 20% loss', () => {
      expect(calculatePreBakeWeight(800, 20)).toBe(1000);
    });

    it('calculates pre-bake weight with 15% loss', () => {
      expect(calculatePreBakeWeight(850, 15)).toBeCloseTo(1000, 1);
    });

    it('handles 0% loss', () => {
      expect(calculatePreBakeWeight(1000, 0)).toBe(1000);
    });

    it('handles 100% loss (edge case)', () => {
      expect(calculatePreBakeWeight(800, 100)).toBe(0);
    });
  });

  describe('calculateWeightLoss', () => {
    it('calculates 200g loss', () => {
      expect(calculateWeightLoss(1000, 800)).toBe(200);
    });

    it('calculates 150g loss', () => {
      expect(calculateWeightLoss(1000, 850)).toBe(150);
    });

    it('handles no loss', () => {
      expect(calculateWeightLoss(1000, 1000)).toBe(0);
    });
  });

  describe('calculateWeightLossPercent', () => {
    it('calculates 20% loss', () => {
      expect(calculateWeightLossPercent(1000, 800)).toBe(20);
    });

    it('calculates 15% loss', () => {
      expect(calculateWeightLossPercent(1000, 850)).toBe(15);
    });

    it('handles zero pre-bake weight', () => {
      expect(calculateWeightLossPercent(0, 800)).toBe(0);
    });

    it('handles no loss', () => {
      expect(calculateWeightLossPercent(1000, 1000)).toBe(0);
    });
  });

  // ==========================================================================
  // Temperature Functions
  // ==========================================================================

  describe('calculateWaterTemperature', () => {
    it('calculates water temp with DDT method', () => {
      // Target DDT: 78°F, Room: 70°F, Flour: 68°F, Starter: 72°F, Friction: 5°F
      // Formula: (78 * 4) - 70 - 68 - 72 - 5 = 312 - 215 = 97°F
      expect(calculateWaterTemperature(78, 70, 68, 72, 5)).toBe(97);
    });

    it('calculates water temp without friction factor', () => {
      // Target DDT: 78°F, Room: 70°F, Flour: 68°F, Starter: 72°F
      // Formula: (78 * 4) - 70 - 68 - 72 = 312 - 210 = 102°F
      expect(calculateWaterTemperature(78, 70, 68, 72)).toBe(102);
    });

    it('handles cold ingredients requiring hot water', () => {
      expect(calculateWaterTemperature(78, 60, 60, 60, 0)).toBe(132);
    });
  });

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  describe('roundTo', () => {
    it('rounds to 1 decimal place by default', () => {
      expect(roundTo(123.456)).toBe(123.5);
    });

    it('rounds to 0 decimal places', () => {
      expect(roundTo(123.456, 0)).toBe(123);
    });

    it('rounds to 2 decimal places', () => {
      expect(roundTo(123.456, 2)).toBe(123.46);
    });

    it('handles whole numbers', () => {
      expect(roundTo(123, 1)).toBe(123);
    });
  });

  describe('formatWeight', () => {
    it('formats weight with no decimals by default', () => {
      expect(formatWeight(500.7)).toBe('501g');
    });

    it('formats weight with 1 decimal', () => {
      expect(formatWeight(500.67, 1)).toBe('500.7g');
    });

    it('handles whole numbers', () => {
      expect(formatWeight(500)).toBe('500g');
    });
  });

  describe('formatPercent', () => {
    it('formats percentage with 1 decimal by default', () => {
      expect(formatPercent(70.123)).toBe('70.1%');
    });

    it('formats percentage with 0 decimals', () => {
      expect(formatPercent(70.123, 0)).toBe('70%');
    });

    it('formats percentage with 2 decimals', () => {
      expect(formatPercent(70.123, 2)).toBe('70.12%');
    });
  });

  describe('validatePositiveNumber', () => {
    it('returns null for valid positive number', () => {
      expect(validatePositiveNumber(10, 'Flour')).toBeNull();
    });

    it('returns error for negative number', () => {
      expect(validatePositiveNumber(-5, 'Water')).toBe('Water must be positive');
    });

    it('returns error for zero', () => {
      expect(validatePositiveNumber(0, 'Salt')).toBe('Salt must be positive');
    });

    it('returns error for NaN', () => {
      expect(validatePositiveNumber(NaN, 'Weight')).toBe(
        'Weight must be a valid number'
      );
    });
  });

  describe('validatePercentage', () => {
    it('returns null for valid percentage', () => {
      expect(validatePercentage(70, 'Hydration')).toBeNull();
    });

    it('returns error for percentage > 100', () => {
      expect(validatePercentage(150, 'Hydration')).toBe(
        'Hydration must be between 0 and 100%'
      );
    });

    it('returns error for negative percentage', () => {
      expect(validatePercentage(-10, 'Percentage')).toBe(
        'Percentage must be positive'
      );
    });

    it('returns error for zero', () => {
      expect(validatePercentage(0, 'Percentage')).toBe(
        'Percentage must be positive'
      );
    });

    it('accepts 100%', () => {
      expect(validatePercentage(100, 'Hydration')).toBeNull();
    });
  });
});
