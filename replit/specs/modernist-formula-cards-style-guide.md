# Modernist Formula Cards Style Guide

## Purpose

This is the visual source of truth for the Modernist Formula Cards redesign of SourdoughSuite.

Use it with:

- `replit/modernist-design-options.png`
- `replit/modernist-screen-system.png`
- `replit/MODERNIST_START_HERE.md`
- `replit/specs/modernist-redesign-plan.md`
- `replit/specs/modernist-replit-prompts.md`

## Product Thesis

SourdoughSuite should feel like a precise culinary-science companion: the clarity of a technical cookbook, the utility of a baker's formula sheet, and the immediacy of a mobile tool.

The design should borrow the spirit of modern technical recipe formatting without copying any specific page:

- dense but readable information
- thin rules instead of bulky cards
- tables for formulas
- staged method labels
- small icon fact strips
- restrained accent color
- very intentional typography

## Personality

SourdoughSuite is:

- precise, not sterile
- premium, not decorative
- technical, not intimidating
- editorial, not bloggy
- calm, not sleepy
- data-rich, not cluttered

Avoid:

- beige and gold dominance
- large tan panels
- generic rounded white cards
- oversized marketing headers
- stock-photo hero backgrounds
- purple gradients
- cartoon baking illustration
- decorative flour blobs or rustic textures

## Palette

Use bright paper, black ink, deep teal rules, and sparse functional accents.

Add these semantic tokens inside `src/theme/colors.ts` without deleting existing keys:

```ts
modernist: {
  paper: '#FFFDF8',
  paperWarm: '#F7F4EE',
  porcelain: '#FFFFFF',
  ink: '#111111',
  graphite: '#2B2B2B',
  graphiteMuted: '#66615B',
  hairline: '#D8D3CB',
  hairlineDark: '#A9A49B',
  ruleTeal: '#2E7474',
  tealSoft: '#E6F0EF',
  copper: '#B46F2B',
  copperSoft: '#F2E1D0',
  starterGreen: '#4D6F3A',
  waterBlue: '#356F8C',
  heatRed: '#9B3F2F',
  warningAmber: '#B87A1D',
}
```

Usage:

- `paper` is the default screen background.
- `porcelain` is used only for elevated sheets or input fields.
- `ink` is primary text.
- `graphiteMuted` is helper text.
- `ruleTeal` is the signature line color for section rules and table dividers.
- `copper` is a rare accent for primary actions, callouts, and one selected state.
- `starterGreen`, `waterBlue`, and `heatRed` encode meaning.

Color ratio:

- 70 percent paper and white
- 20 percent ink and graphite
- 7 percent teal rules and labels
- 3 percent copper or semantic status color

## Typography

Keep the existing app fonts for hackathon speed:

- Playfair Display
- Inter

Use them differently:

- Playfair Display for recipe names, screen titles, and large result numbers.
- Inter for all controls, table text, labels, badges, and body copy.
- Avoid serif body paragraphs in dense mobile areas.
- Use uppercase labels sparingly with letter spacing around `0.6`.
- Keep normal body letter spacing at `0`.
- Avoid negative letter spacing.

Recommended roles:

```ts
type: {
  display: typography.fonts.heading,
  displayRegular: typography.fonts.headingRegular,
  body: typography.fonts.regular,
  bodyMedium: typography.fonts.medium,
  bodySemibold: typography.fonts.semibold,
  bodyBold: typography.fonts.bold,
}
```

Mobile scale:

- Screen title: 30-36
- Recipe title: 28-34
- Section title: 12-14 uppercase
- Body: 14-16
- Table text: 13-15
- Micro labels: 10-12
- Large result number: 40-56

## Layout Rules

### Prefer Rules Over Cards

Modernist Formula Cards should not look like a stack of generic rounded cards.

Use:

- hairline separators
- grouped sheets
- table rows
- fact strips
- section rules
- structured whitespace

Avoid:

- nested cards
- heavy shadows
- huge radii everywhere
- full-screen warm panels
- big decorative containers

### Mobile Density

Dense information is allowed, but it must be scannable.

Use:

- short row labels
- aligned columns
- fixed-width metric cells
- section anchors
- sticky action rows where useful
- collapsed detail rows for long explanations

Avoid:

- long paragraphs above the payoff
- three-column text when labels wrap badly
- tiny tap targets
- tables wider than the screen without a clear strategy

### Shape

Recommended:

- sheet radius: 8-12
- input radius: 6-8
- icon button radius: 8
- segmented control radius: 8
- fact cell radius: 0-6
- modal radius: 12

This direction should feel sharper than the old baker's bench design.

## Core Components

### ModernistScreen

Shared page wrapper.

Responsibilities:

- safe-area handling
- paper background
- consistent horizontal padding
- optional scroll
- optional bottom action inset

### FormulaSheet

Reusable flat sheet with a thin border and optional top rule.

Use for:

- recipe detail sections
- calculator result blocks
- Photo Rescue diagnosis result
- Bake Day Copilot plan summary

### RuleHeader

Uppercase section header with a teal hairline.

Examples:

- `FORMULA`
- `GENERAL DIRECTIONS`
- `FEEDING LOG`
- `DO NOW`
- `BAKE PLAN`

### FactStrip

Horizontal or wrapped metric row with icon, label, and value.

Examples:

- total time
- difficulty
- yield
- storage
- hydration
- last fed
- next feed
- confidence

### FormulaTable

Structured row table.

Common columns:

- ingredient
- weight
- volume
- percent

Mobile behavior:

- ingredient column flexes
- numeric columns stay narrow and right aligned
- long ingredient names wrap within the ingredient column
- row height may grow but columns should not drift

### StageDirections

Method section with stage labels in a narrow left column and procedure text in the right column.

Examples:

- `MIX`
- `BULK`
- `DIVIDE`
- `SHAPE`
- `PROOF`
- `BAKE`

### TimelineRail

Vertical timeline for bake plans and schedule calculators.

Use:

- thin teal rail
- small circular nodes
- time in a compact label
- task name in bold
- note text below
- status color only when meaningful

## Screen Patterns

### Home

Home is a command sheet.

Top structure:

1. App title and small status line.
2. `NEXT UP` fact strip or sheet.
3. Compact status table: starter, recipe, timeline.
4. Quick actions as cells, not large cards.
5. Recent recipe or diagnosis row.

Avoid a plain menu of big rounded cards.

### Recipes List

Recipes should scan like formula index cards.

Each row should show:

- recipe name
- hydration
- total dough weight
- yield
- starter if linked
- one small method/status cue

Use thin dividers and compact metadata cells.

### Recipe Detail

This is the flagship Modernist screen.

Required order:

1. Recipe title.
2. Short note.
3. Fact strip.
4. Ingredients formula table.
5. Tips or callout if present.
6. Stage directions.
7. Shaping or variation table if present.
8. Actions.

### Starters

Starter screens should feel like culture logs.

Use:

- status fact strip
- feeding log table
- activity chart with teal line
- compact action row
- overdue or health state color only where needed

### Calculators

Calculators are result-first.

Required structure:

1. Result preview at top, even before calculation when possible.
2. Mode selector.
3. Inputs as rows or formula table.
4. Validation inline.
5. Primary action row.
6. Explanation below the work area.

### Photo Rescue

Photo Rescue should use the same system without losing image-first clarity.

Required structure:

1. Subject mode segmented control.
2. Image/sample input.
3. Context fields in compact rows.
4. Analyze action.
5. Result screen with confidence fact strip.
6. `WHAT I SEE`, `DO NOW`, `NEXT BAKE`, and `CAUTION` as ruled sections.

If fallback is used, show exactly:

```text
Using quick rescue checklist
```

### Bake Day Copilot

Bake Day Copilot should feel like a production schedule.

Use:

- target bake time fact strip
- fermentation risk summary
- timeline rail
- compact notes table
- reminder toggle that fails softly on web

## Icon Direction

Use `react-native-vector-icons/MaterialCommunityIcons`.

Preferred icons:

- time: `clock-outline`
- difficulty: `gauge`
- yield: `bread-slice`
- storage: `archive-outline`
- hydration: `water-percent`
- weight: `scale`
- starter: `bacteria`
- temperature: `thermometer`
- timeline: `timeline-clock-outline`
- warning: `alert-circle-outline`
- save: `content-save-outline`

Use icons at 16-22px most of the time. The design should not become icon-heavy.

## Copy Style

Use short expert labels:

- `FORMULA`
- `GENERAL DIRECTIONS`
- `ACTIVE TIME`
- `INACTIVE TIME`
- `NEXT FEED`
- `DO NOW`
- `RISK`
- `YIELD`

Avoid:

- long educational paragraphs above tools
- in-app explanations of the UI
- overly cozy voice
- fake certainty in diagnosis

## Accessibility

- Maintain at least 4.5:1 contrast for body text.
- Tap targets should be at least 44px high where interactive.
- Do not rely on color alone for diagnosis confidence or warnings.
- Keep table text at 13px minimum.
- Use real labels for icon buttons.

## Implementation Notes

- Add Modernist tokens without deleting the existing palette.
- Reuse existing navigation and storage.
- Keep public component APIs stable where possible.
- Make new components small and composable.
- Prefer inline React Native styles via `StyleSheet.create`.
- Run `npx tsc --noEmit` after theme/component changes.
