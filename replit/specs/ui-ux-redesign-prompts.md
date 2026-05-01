# Replit Agent UI/UX Redesign Prompt Sequence

Use these prompts after the agent has read the existing hackathon docs. This sequence assumes the goal is to redo the app UI/UX for the hackathon while preserving the existing product functionality.

## Prompt 1: UI/UX Orientation Only

```text
Read the project before editing.

This is SourdoughSuite, an Expo / React Native sourdough companion app. The goal is to redesign the UI/UX so it feels like a premium baker's bench, not a generic utility app.

Read these files:
- replit/specs/ui-ux-style-guide.md
- replit/specs/ui-ux-redesign-plan.md
- replit/ui-ux-review-board.png
- replit/photo-rescue-input.png
- replit/dough-diagnosis-result.png
- replit/bake-day-copilot.png
- replit/specs/prd.md
- replit/specs/technical-spec.md
- src/theme/colors.ts
- src/theme/typography.ts
- src/theme/index.ts
- src/components/Card.tsx
- src/components/Button.tsx
- src/components/BasicInput.tsx
- src/navigation/MainTabNavigator.tsx
- src/screens/Home/HomeScreen.tsx
- src/screens/Tools/ToolsScreen.tsx
- src/screens/Tools/BakersCalculatorScreen.tsx
- src/screens/Tools/TimelineCalculatorScreen.tsx
- src/screens/Starters/StartersScreen.tsx
- src/components/StarterCard.tsx
- src/screens/Recipes/RecipesScreen.tsx

Do not edit files yet.

Return:
1. The current UI structure.
2. The main visual gaps versus replit/ui-ux-review-board.png.
3. The exact screens/components you recommend changing first.
4. Any risks to Expo web or existing navigation.
5. A short implementation order for this session.

Constraints:
- Do not rebuild the app from scratch.
- Do not add a new bottom tab.
- Do not remove existing calculators.
- Do not add a large UI kit.
- Do not hardcode API keys.
- Preserve Replit web demo compatibility.
```

## Prompt 2: Implement Design Foundation

```text
Implement Phase 2 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Add the shared baker bench design foundation.

Requirements:
- Add semantic bench colors to src/theme/colors.ts without deleting existing palette keys.
- Keep Playfair Display and Inter, but use them more intentionally.
- Create shared components:
  - src/components/Screen.tsx
  - src/components/BenchCard.tsx
  - src/components/SectionHeader.tsx
  - src/components/MetricTile.tsx
  - src/components/SegmentedControl.tsx
- Warm up Button and BasicInput visuals without changing their public APIs.
- Do not modify screens yet except to fix compile errors caused by the foundation.

Run:
- npx tsc --noEmit

Stop after this phase and report:
- files changed
- TypeScript result
- any component API notes
```

## Prompt 3: Redesign Home As Command Center

```text
Implement Phase 3 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Redesign Home so it answers "what should I do next?" instead of showing a plain menu.

Requirements:
- Modify src/screens/Home/HomeScreen.tsx.
- Use the new shared components.
- Add a warm app header.
- Add a "Next Up" card.
- Prioritize starter feeding if starter data exists.
- If no starter data exists, show a useful empty-state next action.
- Add prominent actions for Photo Rescue and Bake Day Copilot if those routes exist.
- If those routes do not exist yet, use safe existing routes and leave clear comments only where necessary.
- Keep quick actions for Tools, Starters, Recipes, and Academy.
- De-emphasize social footer.

Manual QA:
- Home renders with no data.
- Home renders with starter/recipe data if available.
- All Home navigation actions work.

Stop after this phase and report files changed plus screenshots/preview notes if available.
```

## Prompt 4: Redesign Tools Hub

```text
Implement Phase 4 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Tools feel like a baker's workbench, not a long undifferentiated list.

Requirements:
- Modify src/screens/Tools/ToolsScreen.tsx.
- Group tools into Plan, Formula, Rescue, and Build.
- Feature Photo Rescue, Bake Day Copilot, and Baker's Percentage if available.
- If Photo Rescue or Bake Day Copilot are not implemented yet, feature Baker's Percentage, Timeline Calculator, and Recipe Rescue.
- Every existing calculator route must still open.
- Use warm cards, section headers, and compact visual hierarchy.

Manual QA:
- Tap every tool card.
- Confirm no route is broken.

Stop after this phase and report files changed plus route QA result.
```

## Prompt 5: Make Baker's Percentage Result-First

```text
Implement the Baker's Percentage part of Phase 5 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Baker's Percentage the first result-first calculator/workbench.

Requirements:
- Modify src/screens/Tools/BakersCalculatorScreen.tsx.
- Create src/components/FormulaPreview.tsx if useful.
- Move the visual result preview near the top.
- Show hydration/ratio summary before or while editing, not only after pressing Calculate.
- Keep flour mode and total weight mode.
- Keep recipe presets.
- Keep add/remove ingredient behavior.
- Preserve Save as Recipe behavior.
- Add inline validation for obvious invalid input.
- Reduce reliance on Alert.alert for routine validation.

Run:
- npm test -- src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
- npx tsc --noEmit

Manual QA:
- Flour mode: 500g flour, 70% water, 2% salt, 20% starter.
- Total mode: 1000g total dough.
- Load Country Loaf preset.
- Add and remove ingredient.
- Save as Recipe still navigates correctly.

Stop after this phase and report files changed, test results, and manual QA.
```

## Prompt 6: Refresh Timeline Calculator

```text
Implement the Timeline Calculator part of Phase 5 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Timeline Calculator feel like a visual schedule tool.

Requirements:
- Modify src/screens/Tools/TimelineCalculatorScreen.tsx.
- Add or reuse a vertical timeline rail component.
- Move result summary near the top after calculation.
- Keep target finish time selection.
- Keep add/remove step behavior.
- Make calculated step times visually scannable.
- Keep the help/how-to copy below the working area or reduce it.

Manual QA:
- Select a finish time.
- Add a step.
- Remove a step.
- Calculate timeline.
- Confirm start time and step ranges are plausible.

Run:
- npx tsc --noEmit

Stop after this phase and report files changed and QA.
```

## Prompt 7: Align Photo Rescue UI

```text
Implement Phase 6 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Photo Rescue visually match:
- replit/photo-rescue-input.png
- replit/dough-diagnosis-result.png

If Photo Rescue files are not implemented yet, stop and say which files/routes need to exist first.

Requirements:
- Warm cream screen.
- Large Photo Rescue title.
- Large image preview.
- Subject segmented control: Starter, Dough, Crumb, Loaf.
- Context chips/controls.
- Strong Analyze button.
- Result image hero with confidence badge.
- Diagnosis conclusion card.
- WHAT I SEE evidence rows.
- DO NOW ordered action list.
- NEXT BAKE prevention chips.
- Risk/caution note.
- Button to Create Bake Plan.
- Fallback state must say "Using quick rescue checklist."
- Confidence must be low/medium/high only.

Manual QA:
- Analyze sample image or mock result.
- Render low/medium/high confidence labels.
- Trigger fallback/missing-key state if backend supports it.

Stop after this phase and report files changed and QA.
```

## Prompt 8: Align Bake Day Copilot UI

```text
Implement Phase 7 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Bake Day Copilot visually match:
- replit/bake-day-copilot.png

If Bake Day Copilot files are not implemented yet, stop and say which files/routes need to exist first.

Requirements:
- Warm cream screen.
- Top title: Bake Day Copilot.
- Control strip with Bake by, Room, Starter, Hydration.
- Vertical timeline rail with icon circles.
- Include mix, folds, bulk check, shape/cold proof, preheat, bake.
- Insight card based on room temp/starter/hydration.
- Reminder toggle that fails softly on web.
- Prominent Create Bake Plan button.
- Preserve deterministic timeline logic.

Manual QA:
- Overnight cold proof default path.
- Same-day path if implemented.
- Reminder unavailable state on web.

Run:
- npx tsc --noEmit

Stop after this phase and report files changed and QA.
```

## Prompt 9: Refresh Starter And Recipe Cards

```text
Implement Phases 8 and 9 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Make Starters and Recipes scannable, visual, and consistent with the baker bench direction.

Starter requirements:
- Modify src/components/StarterCard.tsx.
- Modify src/screens/Starters/StartersScreen.tsx.
- Show starter name, health, next feeding, flour type, starter type.
- Make overdue feeding visually prominent.
- Refresh empty state with no emoji.

Recipe requirements:
- Modify src/screens/Recipes/RecipesScreen.tsx.
- Show recipe name, hydration, total weight, yield, linked starter, and formula mini-grid.
- Ensure long recipe names and starter badges do not overlap.
- Refresh empty state with no emoji.

Manual QA:
- Empty starters.
- Starter list.
- Overdue starter if sample data can be created.
- Empty recipes.
- Recipe list with long names.

Run:
- npx tsc --noEmit

Stop after this phase and report files changed and QA.
```

## Prompt 10: Secondary Polish And Navigation

```text
Implement Phases 10 and 11 from replit/specs/ui-ux-redesign-plan.md.

Goal:
Warm up secondary screens and navigation chrome without over-refactoring.

Requirements:
- Modify src/screens/Learn/LearnScreen.tsx.
- Modify src/screens/Profile/ProfileScreen.tsx if time permits.
- Modify src/navigation/MainTabNavigator.tsx.
- Use warm tab background, copper active state, crust-soft inactive state.
- Keep bottom tabs exactly: Home, Tools, Starters, Recipes, Profile.
- Do not add auth behavior.
- Do not remove existing links/settings.

Manual QA:
- Open every bottom tab.
- Open Learn from Home.
- Open Profile subpages.

Run:
- npx tsc --noEmit

Stop after this phase and report files changed and QA.
```

## Prompt 11: Final UI/UX Verification

```text
Run final verification for the UI/UX refresh.

Run:
- npx tsc --noEmit
- npm test -- --runInBand
- npm start -- --web

Manual QA:
- Home command center.
- Tools grouped workbench.
- Baker's Percentage result-first calculator.
- Timeline visual schedule.
- Starters list and empty state.
- Recipes list and empty state.
- Photo Rescue if present.
- Diagnosis Result if present.
- Bake Day Copilot if present.
- Learn.
- Profile.
- Bottom tab navigation.

Check:
- No text overlaps on mobile viewport.
- No broken routes.
- No API keys committed.
- No auth gate blocks the demo.
- Existing calculators still open.
- Hackathon golden path is obvious from Home.

Return:
- files changed
- commands run
- what passed
- what failed
- known risks
- exact demo steps
```
