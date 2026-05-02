# Local Modernist Build Handoff For Replit

Use this when Replit is not matching the local simulator build.

The local copy now has the desired Modernist Formula Cards implementation. Replit should replicate the local version, not reinterpret the earlier moodboard.

## The Target

Match the local simulator build:

- Home: Modernist command sheet.
- Second Home section: one horizontal 4-cell fact strip, not vertical and not a 2x2 stack.
- Tools: grouped formula workbench with Photo Rescue and Bake Planner featured first.
- Photo Rescue: sample/upload input, context fields, visible signs, honest Quick Rescue fallback, diagnosis result.
- Bake Planner: deterministic production schedule, diagnosis handoff, timeline rail.
- Recipes: formula index list and recipe detail with ingredient table and staged directions.

## Read These First

Read these local files before editing:

- `replit/specs/local-modernist-file-map.md`
- `replit/specs/local-modernist-screen-spec.md`
- `replit/specs/local-modernist-replit-prompt.md`
- `replit/specs/modernist-formula-cards-style-guide.md`
- `replit/modernist-screen-system.png`

Then inspect the current local implementation files listed in the file map.

## Do Not Improvise These Details

### FactStrip Must Be Horizontal

The Home status section must be a single horizontal row of four equal cells.

In `src/components/FactStrip.tsx`, the key layout rules are:

```ts
container: {
  flexDirection: 'row',
  borderWidth: 1,
}

item: {
  flex: 1,
  minWidth: 0,
}
```

Do not use:

```ts
flexWrap: 'wrap'
minWidth: '50%'
flexBasis: '50%'
```

Those create the odd vertical/2x2 layout.

### Cards Should Look Like Sheets

Use thin rules, paper backgrounds, and restrained borders. Avoid:

- big rounded tan cards
- heavy shadows
- stacked dashboard cards
- beige/gold dominance

### Photo Rescue Must Be Honest

If Gemini/backend analysis is unavailable, show checklist guidance. Do not fake an AI result.

Required fallback phrase:

```text
Using quick rescue checklist
```

### Bake Planner Must Be Deterministic

Timeline math lives in code. Do not ask AI to invent times.

## Dependencies Added Locally

The local build added:

- `expo-image-picker`
- `react-dom`
- `react-native-web`

Use `npx expo install` where possible. If npm hits the existing React types peer conflict, finish with:

```bash
npm install --legacy-peer-deps
```

## Validation

Run:

```bash
npx tsc --noEmit
npm test -- src/utils/__tests__/photoRescueRules.test.ts src/utils/__tests__/bakePlanner.test.ts src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
npx expo start --web
```

Known local note:

- Full Jest may fail on `__tests__/App.test.tsx` because Jest is not configured to transform React Navigation ESM. The feature/domain tests pass.
- Expo may warn that several packages are not the exact SDK-preferred versions. The local web build still starts.

## Visual Acceptance Checklist

- Home title says `Bench command sheet`.
- `NEXT UP` is a formula sheet with thin teal rule.
- The status strip under `NEXT UP` is horizontal: Starter / Recipes / Last Plan / Rescue.
- Quick actions are a 2-column grid of cells.
- Tools first section is `Hackathon Path`.
- Photo Rescue and Bake Planner are the first two tool rows.
- Recipe cards look like compact formula index sheets.
- Recipe detail has `INGREDIENTS` table and `GENERAL DIRECTIONS`.
- Bake plan uses a vertical timeline rail.
- The app is mostly white/paper, black ink, and teal rules, with sparse copper.
