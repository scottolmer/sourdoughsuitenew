# Modernist Formula Cards Replit Prompt Sequence

Use these prompts in order when working in Replit Agent. They assume the chosen visual direction is Modernist Formula Cards.

## Prompt 1: Orientation Only

```text
Read the project before editing.

This is SourdoughSuite, an Expo / React Native sourdough companion app. The hackathon goal is to preserve the golden demo path while redesigning the UI around Modernist Formula Cards: precise editorial recipe sheets, formula tables, thin teal rules, black typography, compact fact strips, and sparse copper accents.

Read:
- replit/MODERNIST_START_HERE.md
- replit/specs/modernist-formula-cards-style-guide.md
- replit/specs/modernist-redesign-plan.md
- replit/modernist-design-options.png
- replit/modernist-screen-system.png
- replit/specs/prd.md
- replit/specs/technical-spec.md
- replit/specs/ai-prompts.md
- src/theme/colors.ts
- src/theme/typography.ts
- src/theme/index.ts
- src/components/Card.tsx
- src/components/Button.tsx
- src/components/BasicInput.tsx
- src/navigation/MainTabNavigator.tsx
- src/screens/Home/HomeScreen.tsx
- src/screens/Recipes/RecipesScreen.tsx
- src/screens/Recipes/RecipeDetailScreen.tsx
- src/screens/Starters/StartersScreen.tsx
- src/screens/Tools/ToolsScreen.tsx
- src/screens/Tools/BakersCalculatorScreen.tsx
- src/screens/Tools/TimelineCalculatorScreen.tsx

Do not edit files yet.

Return:
1. Current navigation structure.
2. Current theme and reusable components.
3. Whether Photo Rescue exists and where.
4. Whether Bake Day Copilot exists and where.
5. Safest files to change first.
6. Expo web risks.
7. Implementation order for this Replit session.

Constraints:
- Do not rebuild from scratch.
- Do not add a new bottom tab.
- Do not remove existing calculators.
- Do not add a large UI kit.
- Do not hardcode API keys.
- Do not call Gemini from the client.
- Preserve Replit web compatibility.
```

## Prompt 2: Modernist Theme Foundation

```text
Implement the Modernist theme foundation.

Requirements:
- Add the `modernist` semantic palette from replit/specs/modernist-formula-cards-style-guide.md to src/theme/colors.ts.
- Keep all existing color keys for compatibility.
- Keep Playfair Display and Inter.
- Add typography role aliases only if it stays low-risk.
- Update shared Button, BasicInput, and Card visuals only if their public APIs remain stable.
- The visual direction should be white/paper, black ink, deep teal rules, compact controls, and sparse copper accents.
- Do not update full screens yet except to fix compile errors.

Run:
- npx tsc --noEmit

Stop after this phase and report:
- files changed
- TypeScript result
- any component API notes
```

## Prompt 3: Shared Modernist Components

```text
Create the shared Modernist components.

Create if missing:
- src/components/ModernistScreen.tsx
- src/components/FormulaSheet.tsx
- src/components/RuleHeader.tsx
- src/components/FactStrip.tsx
- src/components/FormulaTable.tsx
- src/components/StageDirections.tsx
- src/components/TimelineRail.tsx

Requirements:
- Components must be typed with simple props.
- Use existing theme and MaterialCommunityIcons.
- Use thin rules and table layout, not bulky card stacks.
- Keep mobile text wrapping safe.
- Do not add dependencies.
- Do not modify screens yet except a tiny sample import if needed for type validation.

Run:
- npx tsc --noEmit

Stop after this phase and report files changed plus any API examples.
```

## Prompt 4: Redesign Home As Command Sheet

```text
Redesign Home using the Modernist Formula Cards style.

Modify:
- src/screens/Home/HomeScreen.tsx

Requirements:
- Home should answer "what should I do next?"
- Use ModernistScreen, FormulaSheet, RuleHeader, FactStrip, and compact action cells.
- Add a SourdoughSuite title and concise status line.
- Add NEXT UP sheet for starter feeding, active bake plan, or useful empty state.
- Add a compact status table for Starter / Recipe / Timeline.
- Add quick actions for Photo Rescue, Bake Day Copilot, Tools, Starters, Recipes, and Learn if routes exist.
- If routes do not exist, use safe existing routes and leave a short comment only where necessary.
- Avoid a plain menu of big rounded cards.
- Keep navigation working.

Manual QA:
- Home renders with no data.
- Home renders with starter/recipe data if available.
- Every Home action opens a valid route.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and route QA.
```

## Prompt 5: Redesign Recipes

```text
Apply Modernist Formula Cards to Recipes.

Modify:
- src/screens/Recipes/RecipesScreen.tsx
- src/screens/Recipes/RecipeDetailScreen.tsx

Recipes list requirements:
- Formula index row style.
- Show recipe name, hydration, total dough weight, yield, and starter if linked.
- Add compact filters/search if existing data supports them.
- Use thin dividers and metric cells.
- Avoid bulky rounded cards.

Recipe detail requirements:
- Title and short note.
- Fact strip for hydration, total weight, yield, starter/storage if available.
- Ingredients formula table with ingredient / weight / volume / percent.
- Stage directions with labels like MIX, BULK, SHAPE, BAKE where recipe data supports them.
- Tips as small ruled callouts.
- Existing edit/delete actions still work.

Manual QA:
- Open recipes list.
- Open a recipe detail.
- Edit action still navigates.
- Delete action still prompts.
- Long ingredient names wrap without breaking columns.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and manual QA.
```

## Prompt 6: Redesign Starter Screens

```text
Apply Modernist Formula Cards to starter tracking.

Modify:
- src/screens/Starters/StartersScreen.tsx
- src/screens/Starters/StarterDetailScreen.tsx
- src/components/StarterCard.tsx

Requirements:
- Starter list rows should show state, hydration, flour type, last fed, and next feed.
- Starter detail should include a fact strip, feeding log table, and compact action row.
- Add a simple activity chart only if the data is already available cheaply.
- Overdue state must be clear without relying on color alone.
- Add Feeding and Edit flows must still work.

Manual QA:
- Open starter list.
- Open starter detail.
- Add feeding still works.
- Edit starter still works.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and manual QA.
```

## Prompt 7: Redesign Baker's Calculator

```text
Make Baker's Calculator result-first in the Modernist style.

Modify:
- src/screens/Tools/BakersCalculatorScreen.tsx

Requirements:
- Result preview near the top.
- Inputs as formula rows.
- Flour mode and total weight mode remain.
- Presets remain.
- Add/remove ingredient behavior remains.
- Save as Recipe remains.
- Hydration, total dough weight, and percentages are visible while editing.
- Use inline validation for routine errors where practical.
- Reduce Alert.alert for normal validation.

Manual QA:
- Flour mode: 500g flour, 70% water, 2% salt, 20% starter.
- Total mode: 1000g total dough.
- Load Country Loaf preset.
- Add ingredient.
- Remove ingredient.
- Save as Recipe still navigates correctly.

Run:
- npm test -- src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
- npx tsc --noEmit

Stop and report files changed, test results, TypeScript result, and manual QA.
```

## Prompt 8: Redesign Timeline Calculator

```text
Make Timeline Calculator feel like a production schedule.

Modify:
- src/screens/Tools/TimelineCalculatorScreen.tsx

Requirements:
- Use TimelineRail.
- Move result summary near the top after calculation.
- Keep target finish time selection.
- Keep add/remove step behavior.
- Calculated step times should be scannable.
- Put help/explanation copy below the working area.

Manual QA:
- Select finish time.
- Add a step.
- Remove a step.
- Calculate timeline.
- Confirm start time and step ranges are plausible.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and manual QA.
```

## Prompt 9: Align Photo Rescue

```text
Apply Modernist Formula Cards to Photo Rescue.

If Photo Rescue files do not exist, stop and list which routes/files need to exist first. If they exist, proceed.

Requirements:
- Subject segmented control.
- Image/sample input remains prominent.
- Context fields are compact rows.
- Analyze action is clear and accessible.
- Result uses a fact strip for subject, stage, confidence, and fallback status.
- Result sections use RuleHeader:
  - WHAT I SEE
  - DO NOW
  - NEXT BAKE
  - CAUTION
- Fallback copy must be exactly: Using quick rescue checklist
- Do not imply fallback analyzed the image.
- Confidence values must be low, medium, or high only.

Manual QA:
- Use sample image.
- Upload/select image if supported.
- Missing Gemini key triggers honest fallback.
- Result shows diagnosis, evidence, actions, next bake tips, and caution.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and manual QA.
```

## Prompt 10: Align Bake Day Copilot

```text
Apply Modernist Formula Cards to Bake Day Copilot.

If Bake Day Copilot files do not exist, implement or polish according to replit/specs/prd.md and replit/specs/technical-spec.md.

Requirements:
- Target bake time fact strip.
- Fermentation risk summary.
- TimelineRail for schedule.
- Notes table for starter, room temperature, hydration, and schedule style.
- Default demo path: overnight cold proof.
- Diagnosis handoff from Photo Rescue still works if already implemented.
- Reminder toggle fails softly on web.

Manual QA:
- Create overnight cold proof timeline.
- Review all timeline steps.
- Toggle reminders on web and confirm it does not block plan creation.

Run:
- npx tsc --noEmit

Stop and report files changed, TypeScript result, and manual QA.
```

## Prompt 11: Final Polish And Verification

```text
Run final hackathon verification for the Modernist Formula Cards build.

Verify:
- Expo web starts in Replit.
- Home opens and looks like a command sheet.
- Tools opens.
- Recipes list opens.
- Recipe detail opens and uses a formula table.
- Starter list/detail opens.
- Baker's Calculator works.
- Timeline Calculator works.
- Photo Rescue sample path works or honest fallback works.
- Bake Day Copilot creates overnight cold proof timeline.
- Existing calculators still open.
- No API keys are committed.
- UI is not dominated by tan, gold, beige, or brown.

Run:
- npx tsc --noEmit
- npm test -- --runInBand
- npm start -- --web

Return:
- files changed
- commands run
- what passed
- what failed
- known risks
- exact demo steps for judges
```
