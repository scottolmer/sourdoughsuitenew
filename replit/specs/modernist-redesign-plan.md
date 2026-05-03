# Modernist Formula Cards Redesign Plan

> For Replit Agent: implement task-by-task. Preserve existing product behavior and the hackathon golden path. Use checkbox syntax in progress updates.

## Goal

Apply the Modernist Formula Cards visual system across the SourdoughSuite app while keeping Expo / React Native, navigation, storage, calculators, Photo Rescue, Bake Day Copilot, and Replit web compatibility intact.

## Required Reading

Read before editing:

- `replit/MODERNIST_START_HERE.md`
- `replit/specs/modernist-formula-cards-style-guide.md`
- `replit/modernist-screen-system.png`
- `replit/specs/prd.md`
- `replit/specs/technical-spec.md`
- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/index.ts`
- `src/components/Card.tsx`
- `src/components/Button.tsx`
- `src/components/BasicInput.tsx`
- `src/navigation/MainTabNavigator.tsx`
- `src/screens/Home/HomeScreen.tsx`
- `src/screens/Recipes/RecipesScreen.tsx`
- `src/screens/Recipes/RecipeDetailScreen.tsx`
- `src/screens/Starters/StartersScreen.tsx`
- `src/screens/Tools/BakersCalculatorScreen.tsx`
- `src/screens/Tools/TimelineCalculatorScreen.tsx`

## Constraints

- Do not rebuild from scratch.
- Do not remove existing calculators.
- Do not remove Photo Rescue or Bake Day Copilot if present.
- Do not add a large UI kit.
- Do not add a new bottom tab.
- Do not hardcode API keys.
- Do not call Gemini from the client.
- Preserve Expo web.
- Keep fallback behavior honest.

## Phase 1: Orient And Capture Baseline

- [ ] Inspect `src` structure.
- [ ] Identify navigation routes.
- [ ] Identify whether Photo Rescue exists.
- [ ] Identify whether Bake Day Copilot exists.
- [ ] Identify reusable components and theme tokens.
- [ ] Run baseline tests if practical.
- [ ] Start Expo web if practical.
- [ ] Record current visual risks.

Commands:

```bash
find src -maxdepth 3 -type f | sort
npx tsc --noEmit
npm test -- --runInBand
npm start -- --web
```

If any command fails because of existing setup issues, record the failure and continue only if the app can still be safely edited.

## Phase 2: Theme Foundation

- [ ] Add `modernist` semantic colors to `src/theme/colors.ts`.
- [ ] Keep existing palette keys for compatibility.
- [ ] Add typography role aliases if they do not cause type churn.
- [ ] Keep Playfair Display and Inter.
- [ ] Reduce reliance on warm amber/gold as the primary visual identity.
- [ ] Update button/input/card visuals only if their public APIs can remain stable.

Design target:

- paper background
- black ink text
- teal rules
- compact controls
- sparse copper actions

Verification:

```bash
npx tsc --noEmit
```

## Phase 3: Shared Modernist Components

Create these components if they do not already exist:

- `src/components/ModernistScreen.tsx`
- `src/components/FormulaSheet.tsx`
- `src/components/RuleHeader.tsx`
- `src/components/FactStrip.tsx`
- `src/components/FormulaTable.tsx`
- `src/components/StageDirections.tsx`
- `src/components/TimelineRail.tsx`

Component guidance:

- Keep components focused.
- Avoid broad new dependencies.
- Make props simple and typed.
- Allow screens to pass data arrays rather than hardcoded children where useful.
- Keep line-height and column alignment stable on mobile.

Verification:

```bash
npx tsc --noEmit
```

## Phase 4: Home Command Sheet

Modify:

- `src/screens/Home/HomeScreen.tsx`

Requirements:

- App title at top.
- Compact status line.
- `NEXT UP` sheet for starter feeding, active bake plan, or useful empty state.
- Status table for Starter / Recipe / Timeline.
- Quick actions as compact cells.
- Recent recipe or recent diagnosis row if data exists.
- No large generic card menu.

Manual QA:

- Home renders with no data.
- Home renders with starter/recipe data if available.
- All quick actions navigate correctly.

## Phase 5: Recipes System

Modify:

- `src/screens/Recipes/RecipesScreen.tsx`
- `src/screens/Recipes/RecipeDetailScreen.tsx`

Requirements for Recipes list:

- Formula index row style.
- Hydration, total weight, yield, and starter metadata visible.
- Segmented filters if existing data supports them.
- Search field as a thin outlined control.
- No bulky rounded recipe cards.

Requirements for Recipe detail:

- Recipe title and short note.
- Fact strip.
- Ingredient formula table with ingredient / weight / volume / percent.
- Stage directions with narrow label column.
- Tips as small ruled callouts.
- Actions at bottom or top right depending on screen layout.

Manual QA:

- Open recipes list.
- Open recipe detail.
- Edit/delete actions still work.
- Long ingredient names wrap cleanly.

Verification:

```bash
npx tsc --noEmit
```

## Phase 6: Starter Culture Logs

Modify:

- `src/screens/Starters/StartersScreen.tsx`
- `src/screens/Starters/StarterDetailScreen.tsx`
- `src/components/StarterCard.tsx`

Requirements:

- Starter rows show status, hydration, flour type, last fed, next feed.
- Detail screen uses fact strip and feeding log table.
- Add a simple activity chart if existing data supports it cheaply.
- Use semantic status colors sparingly.
- Feeding actions remain easy to find.

Manual QA:

- Open starter list.
- Open starter detail.
- Add feeding still works.
- Overdue state is visible without relying on color alone.

## Phase 7: Result-First Calculators

Modify first:

- `src/screens/Tools/BakersCalculatorScreen.tsx`

Then if time:

- `src/screens/Tools/TimelineCalculatorScreen.tsx`
- other calculator screens

Requirements:

- Result preview appears near top.
- Inputs look like formula rows.
- Mode controls use segmented controls.
- Formula percentages are visible while editing.
- Validation is inline where possible.
- Existing save/navigation behavior remains.

Manual QA for Baker's Calculator:

- Flour mode: 500g flour, 70 percent water, 2 percent salt, 20 percent starter.
- Total mode: 1000g total dough.
- Load Country Loaf preset.
- Add and remove ingredient.
- Save as Recipe still works.

Verification:

```bash
npm test -- src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
npx tsc --noEmit
```

## Phase 8: Photo Rescue Modernist Alignment

Modify Photo Rescue files if present. If they do not exist, follow the product/technical specs first.

Requirements:

- Subject segmented control.
- Image/sample input remains prominent.
- Context fields become compact rows.
- Result uses fact strip for confidence and subject/stage.
- Sections: `WHAT I SEE`, `DO NOW`, `NEXT BAKE`, `CAUTION`.
- Fallback copy is exact: `Using quick rescue checklist`.
- Do not imply fallback analyzed the image.

Manual QA:

- Sample image path works.
- Upload path works if supported.
- Missing Gemini key triggers Quick Rescue honestly.
- Result screen shows all required fields.

## Phase 9: Bake Day Copilot Production Schedule

Modify Bake Day Copilot files if present. If absent, implement from product/technical specs.

Requirements:

- Target bake time fact strip.
- Fermentation risk summary.
- Timeline rail.
- Notes table for starter, temperature, hydration.
- Reminder toggle fails softly on web.
- Diagnosis handoff from Photo Rescue still works if implemented.

Manual QA:

- Create overnight cold proof plan.
- Review all timeline steps.
- Confirm reminders do not block web.

## Phase 10: Learn, Profile, And Polish

Modify only if the golden path is stable:

- `src/screens/Learn/LearnScreen.tsx`
- `src/screens/Profile/ProfileScreen.tsx`
- landing page files if needed

Requirements:

- Learn articles use editorial method sheets.
- Profile avoids generic settings-card sprawl.
- Landing page can remain existing if app demo path is stronger.

## Final Verification

Run:

```bash
npx tsc --noEmit
npm test -- --runInBand
npm start -- --web
```

Verify:

- Home opens.
- Tools opens.
- Recipes opens.
- Recipe detail opens.
- Starter list/detail opens.
- Baker's Calculator works.
- Photo Rescue golden path works or honest fallback works.
- Bake Day Copilot timeline works.
- Existing calculators still open.
- No API keys are committed.

Return:

- files changed
- commands run
- what passed
- what failed
- known risks
- demo steps
