# Local Modernist Screen Spec

This document describes how the local simulator version should look and behave.

## Home

File:

- `src/screens/Home/HomeScreen.tsx`

Structure:

1. `ModernistScreen`
2. Header:
   - Kicker: `SOURDOUGH SUITE`
   - Title: `Bench command sheet`
   - Subtitle: `Formula-first tools for rescue, planning, starters, and recipes.`
3. `FormulaSheet accented` for `NEXT UP`
4. Horizontal `FactStrip`
5. `Quick Actions` grid

FactStrip items:

- Starter
- Recipes
- Last Plan
- Rescue

Important:

- The fact strip is one horizontal row.
- Each cell has `flex: 1`.
- Use `minWidth: 0`.
- Do not use `flexWrap`.

Quick actions:

- Photo Rescue
- Bake Planner
- Formulas
- Recipes
- Starters
- Academy

Quick actions are a 2-column grid with thin borders, not cards.

## Tools

File:

- `src/screens/Tools/ToolsScreen.tsx`

Structure:

1. Header:
   - Kicker: `TOOLS`
   - Title: `Formula workbench`
2. Grouped `FormulaSheet` sections.

Groups:

- `Hackathon Path`
  - Photo Rescue
  - Bake Day Copilot
- `Formula`
  - Baker's Percentage
  - Hydration Converter
  - Flour Blend
- `Schedule And Build`
  - Timeline Calculator
  - Levain Builder
  - Preferment Calculator
- `Adjust`
  - Recipe Rescue
  - Recipe Scaler
  - Temperature Calculator
  - Dough Weight
  - Starter Percentage

Rows use icons, title, label, and chevron. The first two rows are subtly featured with paper-warm background and copper/teal icon accents.

## Photo Rescue

Files:

- `src/screens/PhotoRescue/PhotoRescueScreen.tsx`
- `src/screens/PhotoRescue/PhotoRescueResultScreen.tsx`

Input screen:

- Kicker: `PHOTO RESCUE`
- Title: `Read the dough in front of you.`
- Subject segmented control: Dough, Starter, Crumb, Loaf.
- Image sheet with sample-photo state.
- Buttons: `Use Sample`, `Upload`.
- Context fields:
  - Stage
  - Room temp F
  - Elapsed min
  - Hydration %
  - Notes
- Visible sign chips based on subject.
- Analyze button.

Result screen:

- Kicker: `DIAGNOSIS RESULT`
- Diagnosis title.
- Summary.
- FactStrip:
  - Subject
  - Stage
  - Confidence
  - Mode
- Sections:
  - `WHAT I SEE`
  - `DO NOW`
  - `NEXT BAKE`
  - `CAUTION`
- Button: `Create Bake Plan`

Fallback:

- Must include `Using quick rescue checklist`.
- Must not imply image analysis happened.

## Bake Planner

Files:

- `src/screens/BakePlanner/BakePlannerScreen.tsx`
- `src/screens/BakePlanner/BakePlanDetailScreen.tsx`

Planner screen:

- Kicker: `BAKE DAY COPILOT`
- Title: `Build a production schedule.`
- FactStrip:
  - Risk
  - Style
  - Hydration
  - Loaves
- Target sheet:
  - Target bake time
  - Overnight / Same Day segmented control
- Formula inputs:
  - Room temp F
  - Hydration %
  - Loaf count
  - Dough weight
  - Starter readiness segmented control
- Optional Diagnosis Seed sheet if coming from Photo Rescue.
- Planner notes.
- Buttons:
  - Create Bake Plan
  - Reminders On/Off

Plan detail:

- Kicker: `BAKE PLAN`
- Title: `Overnight production schedule`
- Target bake subtitle.
- FactStrip:
  - Risk
  - Room
  - Hydration
  - Reminders
- Timeline rail.
- Notes sheet.

## Recipes

Files:

- `src/screens/Recipes/RecipesScreen.tsx`
- `src/screens/Recipes/RecipeDetailScreen.tsx`

Recipes list:

- Kicker: `RECIPES`
- Title: `Formula index`
- Recipe rows are `FormulaSheet accented`.
- Each recipe shows:
  - name
  - description
  - FactStrip with hydration, weight, yield, starter
  - mini formula row: Flour / Water / Salt / Starter

Recipe detail:

- Kicker: `RECIPE FORMULA`
- Recipe title and description.
- FactStrip.
- `INGREDIENTS` formula table.
- `GENERAL DIRECTIONS` staged directions.
- Optional `NOTES`.
- Edit/Delete actions.

## Visual Rules

Use:

- `theme.colors.modernist.paper`
- `theme.colors.modernist.porcelain`
- `theme.colors.modernist.ink`
- `theme.colors.modernist.ruleTeal`
- `theme.colors.modernist.hairline`
- sparse `theme.colors.modernist.copper`

Avoid:

- dominant tan/gold
- big rounded cards
- heavy shadows
- 2x2 metric blocks on Home
- generic utility dashboard styling
