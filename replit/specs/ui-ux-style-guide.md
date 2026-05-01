# SourdoughSuite UI/UX Style Guide

## Purpose

This document is the visual source of truth for the Replit hackathon UI refresh. Use it with:

- `replit/ui-ux-review-board.png`
- `replit/photo-rescue-input.png`
- `replit/dough-diagnosis-result.png`
- `replit/bake-day-copilot.png`
- `replit/specs/prd.md`
- `replit/specs/technical-spec.md`

The goal is to make SourdoughSuite feel less like a generic utility app and more like a warm, tactile baker's bench: premium, practical, visual, and calm.

## North Star

**Less app. More bakery.**

The app should feel like a professional baker's notebook, bench timer, formula card, and fermentation coach in one place. It should still be fast and usable, but the surface should feel crafted.

## Product Personality

SourdoughSuite is:

- expert, not clinical
- warm, not cute
- premium, not fussy
- visual, not text-heavy
- practical, not decorative
- calm, not sleepy

Avoid:

- generic white-card dashboards
- purple gradients
- stock SaaS styling
- decorative illustrations that do not teach or clarify
- long form screens where the payoff is hidden below the fold
- in-app tutorial copy explaining every UI pattern

## Visual References

### Best Existing References

The strongest current visual direction is in these files:

- `replit/photo-rescue-input.png`
- `replit/dough-diagnosis-result.png`
- `replit/bake-day-copilot.png`

These establish:

- cream background
- dark crust serif display type
- copper/gold primary controls
- thin warm borders
- rounded but not cartoonish cards
- real dough imagery as a hero asset
- visually structured diagnostic cards
- vertical bake timelines

### UX Review Board

Use `replit/ui-ux-review-board.png` as a one-page brief.

It shows the two most important redesign ideas:

1. Home becomes a command center, not a plain menu.
2. Calculators become workbenches with result-first visual instruments.

## Design Tokens

Use the existing theme files as the implementation home:

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`
- `src/theme/index.ts`

### Color Direction

Keep the warm sourdough palette, but make it more deliberate.

Recommended semantic palette:

```ts
const bench = {
  flour: '#FFF9ED',
  parchment: '#F8EEDC',
  linen: '#F2E2C9',
  crust: '#3B2112',
  crustSoft: '#5A3A25',
  crumb: '#B9822B',
  copper: '#C88A1D',
  copperDark: '#8B5A11',
  starterGreen: '#557A3B',
  waterBlue: '#4F7E8A',
  heatRed: '#A84E2E',
  border: '#E3CDAA',
  borderSoft: '#EADBC2',
};
```

Implementation note:

- Do not add a second theme system. Fold these into the existing `colors` object as semantic aliases.
- Existing `primary`, `secondary`, `success`, `warning`, `error`, and `info` values can remain for compatibility.
- New screens/components should prefer semantic aliases such as `bench.crust`, `bench.flour`, and `bench.copper`.

### Typography

Current fonts:

- Playfair Display
- Inter

For the hackathon, keep both to avoid font installation churn.

Use them more intentionally:

- Playfair Display for screen titles, diagnostic conclusions, recipe names, and large result numbers.
- Inter for labels, inputs, navigation, helper text, and compact metrics.

Rules:

- Use Playfair sparingly. It is the premium accent, not body copy.
- Do not use large serif headers inside cramped cards.
- Keep letter spacing at `0` except uppercase micro-labels, which may use `0.6`.
- Prefer strong size contrast over many weights.

### Shape

The app currently uses many large rounded cards. Keep softness, but make shape more disciplined.

Recommended:

- page cards: 22-28 radius
- compact cards: 16-20 radius
- inputs: 14-18 radius
- chips: full pill
- bottom action buttons: 20-24 radius
- image cards: 24-30 radius

Avoid:

- nesting cards inside cards unless it is an actual grouped control
- making every surface pure white
- using shadow as the only separator

### Borders And Shadows

Use:

- warm 1px borders
- very soft brown shadows
- card separation through background tone, border, and spacing

Avoid:

- heavy gray drop shadows
- cold neutral borders
- shadow stacks on every row

### Icon Style

Current library:

- `react-native-vector-icons/MaterialCommunityIcons`

Keep it for speed.

Rules:

- Icons should clarify the object or action.
- Prefer simple line icons in dark crust/copper tones.
- Avoid multi-color icon rows except where color encodes status.
- Do not use emoji in production UI copy.

### Imagery

Use real dough/bread imagery where it helps the user inspect the object:

- Photo Rescue hero image
- diagnosis result image
- recipe image placeholders if cheap
- empty states can use icon-only cards if no real image is available

Avoid:

- generic bakery stock photos as decorative backgrounds
- dark blurred hero images
- abstract gradient backgrounds

## Interaction Patterns

### Home

Home must answer:

> What should I do next?

Not:

> Which tab do I open?

Recommended Home sections:

1. status/header with app identity
2. "Next up" action card
3. active bake plan or starter feeding reminder
4. compact quick tools
5. recent recipe or recent diagnosis
6. social links only if they do not compete with product tasks

### Calculators

Every calculator should be result-first.

Current pattern:

- header
- inputs
- calculate button
- result below

Target pattern:

- visual result preview at top
- compact mode/preset controls
- inputs grouped below
- sticky or near-sticky primary action
- save/share action beside result when applicable

### Starter Tracking

Starter cards should show state, not just metadata.

Prioritize:

- next feeding due
- active/inactive
- health
- flour type
- last fed if available
- rise/feeding visual if available

### Recipes

Recipe cards should scan like formula cards.

Prioritize:

- recipe name
- hydration
- total dough weight
- yield
- starter used
- formula mini-grid

### Photo Rescue

Photo Rescue should keep the mockup direction:

- large image preview
- subject segmented control
- context chips
- one strong Analyze button
- "What I can check" card

### Diagnosis Result

Diagnosis result should feel like a baker marked up the photo:

- image hero with confidence badge
- diagnosis conclusion card
- visual evidence rows
- ordered "Do Now" actions
- next bake prevention chips
- caution note
- clear button into Bake Day Copilot

### Bake Day Copilot

Bake Day Copilot should feel like a schedule instrument:

- top control strip for bake by, room, starter, hydration
- vertical timeline with icons
- schedule reminders toggle
- prominent "Create Bake Plan" action

## Accessibility And Usability

Minimum requirements:

- touch targets at least 44px high
- text contrast suitable on cream backgrounds
- no essential meaning conveyed by color only
- dynamic text should not overlap or truncate badly
- form errors should be inline, not only alerts
- loading states should preserve layout and explain what is happening

## Copy Voice

Voice:

- direct
- helpful
- confident but cautious
- beginner-friendly

Use:

- "Likely underdeveloped gluten"
- "Do now"
- "Next bake"
- "Create bake plan"
- "Using quick rescue checklist"

Avoid:

- "AI magic"
- exact certainty claims
- "Your dough is definitely..."
- long instructional paragraphs on primary screens

## Definition Of Done

The UI/UX refresh is done when:

- Home no longer feels like a static menu.
- Photo Rescue and Bake Day Copilot match the visual quality of the provided mockups.
- At least one major calculator uses the result-first workbench pattern.
- Tools, starter, and recipe list screens feel visually related to the new direction.
- Existing calculators and storage flows still work.
- Expo web starts in Replit.
- The golden hackathon path is visually obvious from Home.
