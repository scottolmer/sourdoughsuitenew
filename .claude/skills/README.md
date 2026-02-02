# SourdoughSuite Custom Skills

This directory contains custom Claude Code skills for the SourdoughSuite React Native app.

## Skills Overview

### 1. **sourdough-formulas** (Automatic)
**File**: `sourdough-formulas/SKILL.md`
**Purpose**: Centralized calculation library for sourdough math

Provides tested, type-safe utilities for:
- Baker's percentages
- Hydration calculations
- Scaling recipes
- Starter/levain decomposition
- Temperature calculations
- Formatting and validation

**Implementation**: `src/utils/sourdoughCalculations.ts`
**Tests**: `src/utils/__tests__/sourdoughCalculations.test.ts` (68 tests passing)

**Usage**: Functions are automatically available. Import from:
```typescript
import { calculateAmountFromPercentage, roundTo } from '../../utils/sourdoughCalculations';
```

---

### 2. **calculator-generator** (Manual)
**File**: `calculator-generator/SKILL.md`
**Purpose**: Generate new calculator screens from configuration

Reduces boilerplate from 700 lines to ~50 lines of config.

**Invoke with**:
```
/calculator-generator <config-file-path>
```

**Generated files**:
- Calculator screen component
- Navigation type updates
- Tools list integration

**Example config**:
```json
{
  "name": "Salt Calculator",
  "fileName": "SaltCalculatorScreen",
  "icon": "shaker-outline",
  "inputs": [...],
  "calculation": {...},
  "results": [...]
}
```

---

### 3. **crud-generator** (Manual)
**File**: `crud-generator/SKILL.md`
**Purpose**: Generate complete CRUD flows for new entities

Creates Add/Edit/Detail screens with storage service.

**Invoke with**:
```
/crud-generator <config-file-path>
```

**Generated files**:
- Type definition
- Storage service (AsyncStorage)
- Add/Edit/Detail screens
- Optional list screen
- Navigation updates
- Query key constants

**Example config**:
```json
{
  "entity": {
    "name": "BakingSession",
    "displayName": "Baking Session",
    "icon": "oven"
  },
  "fields": [...],
  "labels": {...}
}
```

---

## Implementation Status

### ✅ Completed

1. **Sourdough Formulas Library**
   - ✅ Created `src/utils/sourdoughCalculations.ts`
   - ✅ Created test suite (68 tests, all passing)
   - ✅ Documented skill in `sourdough-formulas/SKILL.md`

2. **Calculator Generator Skill**
   - ✅ Documented in `calculator-generator/SKILL.md`
   - ✅ Config schema defined
   - ✅ Generation patterns documented
   - ✅ Examples provided

3. **CRUD Generator Skill**
   - ✅ Documented in `crud-generator/SKILL.md`
   - ✅ Config schema defined
   - ✅ Screen patterns documented
   - ✅ Examples provided

---

## File Structure

```
.claude/skills/
├── README.md (this file)
├── calculator-generator/
│   └── SKILL.md
├── crud-generator/
│   └── SKILL.md
└── sourdough-formulas/
    └── SKILL.md

src/utils/
├── sourdoughCalculations.ts (NEW)
└── __tests__/
    └── sourdoughCalculations.test.ts (NEW)
```

---

## How to Use

### Verify Skills Are Loaded

In Claude Code CLI:
```
/skills
```

Should show:
- calculator-generator
- crud-generator
- sourdough-formulas

### Use Sourdough Formulas (Automatic)

The utility functions are always available. Just import and use:

```typescript
import {
  calculateAmountFromPercentage,
  calculateHydrationPercent,
  roundTo
} from '../../utils/sourdoughCalculations';

// Use in calculations
const water = roundTo(calculateAmountFromPercentage(flourWeight, 70));
const hydration = calculateHydrationPercent(waterWeight, flourWeight);
```

### Generate a Calculator (Manual)

1. Create a config file (or describe it to Claude)
2. Invoke the skill:
   ```
   /calculator-generator config/my-calculator.json
   ```
3. Claude will generate all necessary files
4. Test with `npx tsc` and `npm run android`

### Generate CRUD Screens (Manual)

1. Create an entity config file
2. Invoke the skill:
   ```
   /crud-generator config/my-entity.json
   ```
3. Claude will generate storage service + screens
4. Test the create → view → edit → delete flow

---

## Testing

### Test Sourdough Calculations
```bash
npm test sourdoughCalculations
```

Expected: 68 tests passing

### Test Generated Calculators
```bash
# Type check
npx tsc

# Run app
npm run android
# or
npm run ios
```

### Test Generated CRUD Screens

1. Navigate to list screen
2. Create new entity
3. View detail screen
4. Edit entity
5. Delete entity

---

## Benefits

### Code Reduction
- **Calculators**: 700 lines → 50 lines of config (93% reduction)
- **CRUD Flows**: 1500 lines → 100 lines of config (93% reduction)
- **Calculations**: Eliminated duplication across 9+ screens

### Consistency
- All calculators follow same patterns
- Centralized validation logic
- Consistent styling and UX
- Standardized error handling

### Maintainability
- Single source of truth for calculations
- Tested utility functions
- Generated code follows best practices
- Easy to update patterns globally

### Velocity
- Generate new features in minutes instead of hours
- Focus on business logic, not boilerplate
- Consistent quality across features

---

## Examples in Codebase

### Existing Calculators (Can Be Refactored)
- `src/screens/tools/BakersCalculatorScreen.tsx`
- `src/screens/tools/HydrationCalculatorScreen.tsx`
- `src/screens/tools/LevainCalculatorScreen.tsx`
- `src/screens/tools/StarterPercentageCalculatorScreen.tsx`
- `src/screens/tools/PrefermentCalculatorScreen.tsx`
- `src/screens/tools/ScalingCalculatorScreen.tsx`
- `src/screens/tools/DoughWeightCalculatorScreen.tsx`
- `src/screens/tools/BakingLossCalculatorScreen.tsx`
- `src/screens/tools/RecipeRescueCalculatorScreen.tsx`

### Existing CRUD Patterns (Reference)
- Starters: `src/screens/starters/`
- Recipes: `src/screens/Recipes/`

---

## Next Steps

### Immediate (Optional)
1. Refactor 1-2 existing calculators to use `sourdoughCalculations` utilities
2. Verify the utilities work correctly in real screens
3. Generate a test calculator to validate the generator skill

### Future Features (Using Skills)
1. **Baking Journal** - Use CRUD generator for journal entries
2. **Flour Inventory** - Use CRUD generator for flour tracking
3. **Temperature Calculator** - Use calculator generator
4. **Autolyse Calculator** - Use calculator generator
5. **Equipment Manager** - Use CRUD generator

---

## Troubleshooting

### Skills Not Showing

Check that `.claude/skills/` directory exists and contains subdirectories with `SKILL.md` files.

### TypeScript Errors After Generation

Run `npx tsc --noEmit` to check for errors. Generated code should follow existing patterns.

### Tests Failing

For sourdoughCalculations:
```bash
npm test -- sourdoughCalculations.test.ts
```

All 68 tests should pass.

### Generated Calculator Not Appearing

Verify:
1. Screen registered in `ToolsNavigator.tsx`
2. Added to `ToolsListScreen.tsx` tools array
3. Navigation type added to `types.ts`

---

## Maintenance

### Updating Skills

Edit the corresponding `SKILL.md` file. Changes take effect immediately.

### Updating Calculation Library

1. Edit `src/utils/sourdoughCalculations.ts`
2. Add tests to `src/utils/__tests__/sourdoughCalculations.test.ts`
3. Run `npm test sourdoughCalculations` to verify
4. Update `sourdough-formulas/SKILL.md` if needed

### Adding New Patterns

Study existing calculators and CRUD screens to identify new patterns. Add them to the skill documentation.

---

## Resources

- **Sourdough Calculations Docs**: See JSDoc comments in `src/utils/sourdoughCalculations.ts`
- **Calculator Patterns**: Study `BakersCalculatorScreen.tsx`
- **CRUD Patterns**: Study `AddStarterScreen.tsx` and `RecipeDetailScreen.tsx`
- **React Query**: Used for all async operations
- **Theme Constants**: `src/theme.ts`
- **Navigation Types**: `src/navigation/types.ts`

---

## Version History

### v1.0.0 (2026-02-02)
- ✅ Created sourdough-formulas skill
- ✅ Created calculator-generator skill
- ✅ Created crud-generator skill
- ✅ Implemented sourdoughCalculations utility library
- ✅ Added 68 unit tests (all passing)
- ✅ Documented all skills and patterns
