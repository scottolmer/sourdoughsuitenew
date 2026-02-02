---
name: sourdough-formulas
description: Centralized sourdough calculation library utilities
invocation: automatic
---

# Sourdough Formula Library Skill

This skill provides centralized, tested calculation utilities for sourdough math used throughout the SourdoughSuite app.

## Purpose

The `src/utils/sourdoughCalculations.ts` library eliminates duplicated formulas across calculator screens by providing:
- Type-safe functions for baker's percentages, hydration, scaling, etc.
- Consistent precision and formatting
- Testable and maintainable calculations
- Single source of truth for sourdough math

## Available Functions

### Baker's Percentage Functions
```typescript
calculateAmountFromPercentage(flourWeight, percentage) // Ingredient amount from %
calculatePercentageFromAmount(ingredientWeight, flourWeight) // % from amounts
```

### Hydration Functions
```typescript
calculateHydrationPercent(waterWeight, flourWeight) // Hydration %
calculateWaterNeeded(flourWeight, targetHydration) // Water for target %
calculateFlourNeeded(waterWeight, targetHydration) // Flour for target %
```

### Scaling Functions
```typescript
calculateScaleFactor(original, target) // Scale multiplier
scaleAmount(amount, scaleFactor) // Scale an amount
```

### Starter/Preferment Functions
```typescript
decomposeLevain(totalLevainWeight, hydration) // { flour, water }
calculateStarterPercentage(starterFlour, totalFlour) // Starter %
calculatePrefermentFlour(totalFlour, prefermentPercent) // Preferment flour
```

### Dough Weight Functions
```typescript
calculatePreBakeWeight(postBakeWeight, bakingLossPercent) // Pre-bake weight
calculateWeightLoss(preBakeWeight, postBakeWeight) // Weight loss amount
calculateWeightLossPercent(preBakeWeight, postBakeWeight) // Loss %
```

### Temperature Functions
```typescript
calculateWaterTemperature(targetDDT, roomTemp, flourTemp, starterTemp, frictionFactor) // DDT method
```

### Utility Functions
```typescript
roundTo(value, decimals = 1) // Round to decimal places
formatWeight(grams, decimals = 0) // Format as "500g"
formatPercent(percent, decimals = 1) // Format as "70.0%"
validatePositiveNumber(value, fieldName) // Validation with error message
validatePercentage(value, fieldName) // Validate 0-100% range
```

## Usage Guidelines

When working with calculator screens or recipe calculations:

1. **Import functions** from the centralized library:
   ```typescript
   import { calculateAmountFromPercentage, roundTo } from '../../utils/sourdoughCalculations';
   ```

2. **Use functions instead of inline math**:
   ```typescript
   // Before:
   const waterAmount = ((flourWeight * waterPercent) / 100).toFixed(1);

   // After:
   const waterAmount = roundTo(calculateAmountFromPercentage(flourWeight, waterPercent));
   ```

3. **Leverage validation helpers**:
   ```typescript
   const error = validatePositiveNumber(parseFloat(flourWeight), 'Flour Weight');
   if (error) {
     Alert.alert('Validation Error', error);
     return;
   }
   ```

4. **Use formatting utilities**:
   ```typescript
   // Consistent formatting across all calculators
   const displayWeight = formatWeight(waterAmount); // "700g"
   const displayPercent = formatPercent(hydration); // "70.0%"
   ```

## Migration Pattern

When refactoring existing calculators:

### Before (inline calculations)
```typescript
const handleCalculate = () => {
  const flourNum = parseFloat(flourWeight);
  const waterAmount = ((flourNum * 70) / 100).toFixed(1);
  const saltAmount = ((flourNum * 2) / 100).toFixed(1);

  setResults({
    flour: flourNum.toFixed(0),
    water: waterAmount,
    salt: saltAmount,
  });
};
```

### After (using library)
```typescript
import { calculateAmountFromPercentage, roundTo, formatWeight } from '../../utils/sourdoughCalculations';

const handleCalculate = () => {
  const flourNum = parseFloat(flourWeight);
  const waterAmount = roundTo(calculateAmountFromPercentage(flourNum, 70));
  const saltAmount = roundTo(calculateAmountFromPercentage(flourNum, 2));

  setResults({
    flour: formatWeight(flourNum),
    water: formatWeight(waterAmount),
    salt: formatWeight(saltAmount),
  });
};
```

## When to Use This Skill

This skill is **automatic** - use these functions whenever:
- Creating new calculator screens
- Refactoring existing calculators
- Adding recipe calculations
- Implementing formula-based features
- Need consistent number formatting

## Benefits

1. **DRY Principle**: Single source of truth for calculations
2. **Testable**: Each function has unit tests (68 tests passing)
3. **Consistent**: Same precision across all calculators
4. **Maintainable**: Fix bugs in one place
5. **Discoverable**: IDE autocomplete shows all available formulas
6. **Documented**: JSDoc comments explain parameters and returns

## Related Files

- Implementation: `src/utils/sourdoughCalculations.ts`
- Tests: `src/utils/__tests__/sourdoughCalculations.test.ts`
- Used in: All calculator screens in `src/screens/tools/`

## Examples from Codebase

### Baker's Percentage Calculator
```typescript
import { calculateAmountFromPercentage, roundTo } from '../../utils/sourdoughCalculations';

const water = roundTo(calculateAmountFromPercentage(flourWeight, waterPercent));
const salt = roundTo(calculateAmountFromPercentage(flourWeight, saltPercent));
```

### Hydration Calculator
```typescript
import { calculateHydrationPercent, calculateWaterNeeded } from '../../utils/sourdoughCalculations';

const hydration = calculateHydrationPercent(waterWeight, flourWeight);
const neededWater = calculateWaterNeeded(flourWeight, targetHydration);
```

### Levain Calculator
```typescript
import { decomposeLevain, calculateStarterPercentage } from '../../utils/sourdoughCalculations';

const { flour: levainFlour, water: levainWater } = decomposeLevain(levainWeight, hydration);
const starterPercent = calculateStarterPercentage(levainFlour, totalFlour);
```

## Testing

Run tests with:
```bash
npm test sourdoughCalculations
```

All 68 tests should pass, covering:
- Edge cases (zero values, division by zero)
- Fractional numbers
- Typical baking scenarios
- Validation logic
- Formatting functions
