/**
 * Sourdough Calculation Utilities
 *
 * Centralized library for sourdough baking calculations used across
 * calculator screens. Provides type-safe, tested functions for common
 * operations like baker's percentages, hydration, scaling, and more.
 */

// ============================================================================
// Baker's Percentage Functions
// ============================================================================

/**
 * Calculate ingredient amount from baker's percentage
 * @param flourWeight - Total flour weight in grams
 * @param percentage - Ingredient percentage relative to flour
 * @returns Ingredient amount in grams
 * @example calculateAmountFromPercentage(1000, 70) // 700g water at 70%
 */
export function calculateAmountFromPercentage(
  flourWeight: number,
  percentage: number
): number {
  return (flourWeight * percentage) / 100;
}

/**
 * Calculate baker's percentage from ingredient amount
 * @param ingredientWeight - Ingredient weight in grams
 * @param flourWeight - Total flour weight in grams
 * @returns Baker's percentage
 * @example calculatePercentageFromAmount(700, 1000) // 70%
 */
export function calculatePercentageFromAmount(
  ingredientWeight: number,
  flourWeight: number
): number {
  if (flourWeight === 0) return 0;
  return (ingredientWeight / flourWeight) * 100;
}

// ============================================================================
// Hydration Functions
// ============================================================================

/**
 * Calculate dough hydration percentage
 * @param waterWeight - Water weight in grams
 * @param flourWeight - Flour weight in grams
 * @returns Hydration percentage
 * @example calculateHydrationPercent(700, 1000) // 70%
 */
export function calculateHydrationPercent(
  waterWeight: number,
  flourWeight: number
): number {
  if (flourWeight === 0) return 0;
  return (waterWeight / flourWeight) * 100;
}

/**
 * Calculate water needed for target hydration
 * @param flourWeight - Flour weight in grams
 * @param targetHydration - Desired hydration percentage
 * @returns Water weight in grams
 * @example calculateWaterNeeded(1000, 70) // 700g
 */
export function calculateWaterNeeded(
  flourWeight: number,
  targetHydration: number
): number {
  return (flourWeight * targetHydration) / 100;
}

/**
 * Calculate flour needed for target hydration
 * @param waterWeight - Water weight in grams
 * @param targetHydration - Desired hydration percentage
 * @returns Flour weight in grams
 * @example calculateFlourNeeded(700, 70) // 1000g
 */
export function calculateFlourNeeded(
  waterWeight: number,
  targetHydration: number
): number {
  if (targetHydration === 0) return 0;
  return (waterWeight * 100) / targetHydration;
}

// ============================================================================
// Scaling Functions
// ============================================================================

/**
 * Calculate scale factor between original and target
 * @param original - Original amount
 * @param target - Target amount
 * @returns Scale factor
 * @example calculateScaleFactor(1000, 1500) // 1.5
 */
export function calculateScaleFactor(
  original: number,
  target: number
): number {
  if (original === 0) return 1;
  return target / original;
}

/**
 * Scale an amount by a factor
 * @param amount - Original amount
 * @param scaleFactor - Multiplier
 * @returns Scaled amount
 * @example scaleAmount(500, 1.5) // 750
 */
export function scaleAmount(
  amount: number,
  scaleFactor: number
): number {
  return amount * scaleFactor;
}

// ============================================================================
// Starter/Preferment Functions
// ============================================================================

/**
 * Decompose levain into flour and water components
 * @param totalLevainWeight - Total levain weight in grams
 * @param hydration - Levain hydration percentage
 * @returns Object with flour and water amounts
 * @example decomposeLevain(100, 100) // { flour: 50, water: 50 }
 */
export function decomposeLevain(
  totalLevainWeight: number,
  hydration: number
): { flour: number; water: number } {
  const flour = totalLevainWeight / (1 + hydration / 100);
  const water = totalLevainWeight - flour;
  return { flour, water };
}

/**
 * Calculate starter percentage in recipe
 * @param starterFlour - Flour from starter in grams
 * @param totalFlour - Total flour in recipe in grams
 * @returns Starter percentage
 * @example calculateStarterPercentage(100, 1000) // 10%
 */
export function calculateStarterPercentage(
  starterFlour: number,
  totalFlour: number
): number {
  if (totalFlour === 0) return 0;
  return (starterFlour / totalFlour) * 100;
}

/**
 * Calculate preferment flour amount
 * @param totalFlour - Total flour in recipe in grams
 * @param prefermentPercent - Preferment percentage
 * @returns Preferment flour amount in grams
 * @example calculatePrefermentFlour(1000, 20) // 200g
 */
export function calculatePrefermentFlour(
  totalFlour: number,
  prefermentPercent: number
): number {
  return (totalFlour * prefermentPercent) / 100;
}

// ============================================================================
// Dough Weight Functions
// ============================================================================

/**
 * Calculate pre-bake weight accounting for baking loss
 * @param postBakeWeight - Final baked weight in grams
 * @param bakingLossPercent - Expected weight loss percentage
 * @returns Pre-bake weight in grams
 * @example calculatePreBakeWeight(800, 20) // 1000g
 */
export function calculatePreBakeWeight(
  postBakeWeight: number,
  bakingLossPercent: number
): number {
  if (bakingLossPercent >= 100) return 0;
  return postBakeWeight / (1 - bakingLossPercent / 100);
}

/**
 * Calculate weight loss amount
 * @param preBakeWeight - Pre-bake weight in grams
 * @param postBakeWeight - Post-bake weight in grams
 * @returns Weight loss in grams
 * @example calculateWeightLoss(1000, 800) // 200g
 */
export function calculateWeightLoss(
  preBakeWeight: number,
  postBakeWeight: number
): number {
  return preBakeWeight - postBakeWeight;
}

/**
 * Calculate weight loss percentage
 * @param preBakeWeight - Pre-bake weight in grams
 * @param postBakeWeight - Post-bake weight in grams
 * @returns Weight loss percentage
 * @example calculateWeightLossPercent(1000, 800) // 20%
 */
export function calculateWeightLossPercent(
  preBakeWeight: number,
  postBakeWeight: number
): number {
  if (preBakeWeight === 0) return 0;
  return ((preBakeWeight - postBakeWeight) / preBakeWeight) * 100;
}

// ============================================================================
// Temperature Functions
// ============================================================================

/**
 * Calculate water temperature for desired dough temperature (DDT method)
 * @param targetDDT - Desired dough temperature in °F
 * @param roomTemp - Room temperature in °F
 * @param flourTemp - Flour temperature in °F
 * @param starterTemp - Starter temperature in °F
 * @param frictionFactor - Friction factor (mixing heat), default 0
 * @returns Required water temperature in °F
 * @example calculateWaterTemperature(78, 70, 68, 72, 5) // 83°F
 */
export function calculateWaterTemperature(
  targetDDT: number,
  roomTemp: number,
  flourTemp: number,
  starterTemp: number,
  frictionFactor: number = 0
): number {
  return targetDDT * 4 - roomTemp - flourTemp - starterTemp - frictionFactor;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Round to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 1)
 * @returns Rounded number
 * @example roundTo(123.456, 1) // 123.5
 */
export function roundTo(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format weight with unit
 * @param grams - Weight in grams
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string (e.g., "500g")
 * @example formatWeight(500.7) // "501g"
 */
export function formatWeight(grams: number, decimals: number = 0): string {
  return `${roundTo(grams, decimals)}g`;
}

/**
 * Format percentage
 * @param percent - Percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "70.0%")
 * @example formatPercent(70.123) // "70.1%"
 */
export function formatPercent(percent: number, decimals: number = 1): string {
  return `${roundTo(percent, decimals)}%`;
}

/**
 * Validate positive number input
 * @param value - Value to validate
 * @param fieldName - Name of field for error message
 * @returns Error message or null if valid
 * @example validatePositiveNumber(10, "Flour") // null
 * @example validatePositiveNumber(-5, "Water") // "Water must be positive"
 */
export function validatePositiveNumber(
  value: number,
  fieldName: string
): string | null {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  if (value <= 0) {
    return `${fieldName} must be positive`;
  }
  return null;
}

/**
 * Validate percentage range (0-100)
 * @param value - Percentage value to validate
 * @param fieldName - Name of field for error message
 * @returns Error message or null if valid
 * @example validatePercentage(70, "Hydration") // null
 * @example validatePercentage(150, "Hydration") // "Hydration must be 0-100%"
 */
export function validatePercentage(
  value: number,
  fieldName: string
): string | null {
  const baseError = validatePositiveNumber(value, fieldName);
  if (baseError) return baseError;

  if (value > 100) {
    return `${fieldName} must be between 0 and 100%`;
  }
  return null;
}
