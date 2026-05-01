# SourdoughSuite UI/UX Redesign Implementation Plan

> **For Replit Agent:** Implement this plan task-by-task. Do not rebuild the app from scratch. Preserve existing calculators, storage, navigation, and hackathon feature work. Use checkbox (`- [ ]`) syntax to track progress in your response.

**Goal:** Redesign SourdoughSuite into a visual-first, premium sourdough companion that feels like a baker's bench rather than a generic utility app.

**Architecture:** Keep the current Expo / React Native architecture. Add a small set of shared visual components and semantic theme tokens, then refactor screens in priority order: shared foundation, Home, Photo Rescue, Bake Day Copilot, calculators, starters, recipes, Learn/Profile polish.

**Tech Stack:** Expo, React Native, TypeScript, React Navigation, React Query, AsyncStorage, `react-native-vector-icons/MaterialCommunityIcons`, existing custom theme/components.

---

## Required Reading Before Editing

Read these files first:

- `replit/specs/ui-ux-style-guide.md`
- `replit/ui-ux-review-board.png`
- `replit/photo-rescue-input.png`
- `replit/dough-diagnosis-result.png`
- `replit/bake-day-copilot.png`
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
- `src/screens/Tools/ToolsScreen.tsx`
- `src/screens/Tools/BakersCalculatorScreen.tsx`
- `src/screens/Starters/StartersScreen.tsx`
- `src/components/StarterCard.tsx`
- `src/screens/Recipes/RecipesScreen.tsx`

## Non-Negotiable Constraints

- Do not remove existing calculators.
- Do not remove Photo Rescue or Bake Day Copilot if already implemented.
- Do not add a new bottom tab.
- Do not add a large UI kit.
- Do not hardcode API keys.
- Do not call Gemini from the client.
- Do not make the Replit web demo depend on native-only behavior.
- Do not add auth gates.
- Do not break Expo Go compatibility.
- Do not spend hackathon time on unrelated refactors.

## Visual Target

Use this product thesis everywhere:

> Less app. More bakery.

Translate that into:

- cream/parchment backgrounds
- dark crust typography
- copper/gold primary actions
- warm thin borders
- real dough imagery where useful
- compact metrics and visual instruments
- fewer generic white list cards
- result-first calculators
- Home as a command center

## File Structure Plan

Create these shared UI files if they do not already exist:

- `src/components/Screen.tsx`  
  Shared safe-area/page wrapper with warm background and consistent padding.

- `src/components/SectionHeader.tsx`  
  Small reusable title/subtitle row for sections.

- `src/components/MetricTile.tsx`  
  Compact metric block for hydration, room temp, dough weight, feed due, yield.

- `src/components/SegmentedControl.tsx`  
  Reusable segmented control for subject selection, calculator modes, schedule style.

- `src/components/BenchCard.tsx`  
  Warm card component with variants that better match the new visual direction.

- `src/components/TimelineRail.tsx`  
  Reusable vertical timeline for Bake Day Copilot and timeline calculator.

- `src/components/FormulaPreview.tsx`  
  Result-first formula preview for Baker's Percentage and recipe cards.

- `src/components/ResultHero.tsx`  
  Large visual result block for diagnosis and calculators.

Modify these theme/component files:

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/index.ts`
- `src/components/Card.tsx`
- `src/components/Button.tsx`
- `src/components/BasicInput.tsx`
- `src/components/FloatingActionButton.tsx`

Modify these screens in priority order:

- `src/screens/Home/HomeScreen.tsx`
- `src/screens/Tools/ToolsScreen.tsx`
- `src/screens/Tools/BakersCalculatorScreen.tsx`
- `src/screens/Tools/TimelineCalculatorScreen.tsx`
- Photo Rescue screens, if present
- Bake Day Copilot screens, if present
- `src/screens/Starters/StartersScreen.tsx`
- `src/components/StarterCard.tsx`
- `src/screens/Recipes/RecipesScreen.tsx`
- `src/screens/Learn/LearnScreen.tsx`
- `src/screens/Profile/ProfileScreen.tsx`

## Implementation Phases

### Phase 1: Orient And Protect The App

- [ ] **Step 1: Run project orientation**

Run:

```bash
find src -maxdepth 3 -type f | sort
```

Confirm the current app structure before editing.

- [ ] **Step 2: Run baseline tests**

Run:

```bash
npm test -- --runInBand
```

Expected:

- Tests pass, or existing unrelated failures are recorded before UI work begins.

- [ ] **Step 3: Start Expo web**

Run:

```bash
npm start -- --web
```

Expected:

- App starts or shows an actionable Expo/Replit setup issue.
- Record the local URL used for visual checks.

- [ ] **Step 4: Capture current key screens**

In the Replit preview/browser, inspect:

- Home
- Tools
- Baker's Percentage
- Timeline Calculator
- Starters
- Recipes
- Photo Rescue if present
- Bake Day Copilot if present

Record any existing visual bugs before making changes.

### Phase 2: Theme And Shared Components

- [ ] **Step 1: Add semantic bench colors**

Modify `src/theme/colors.ts`.

Keep existing color keys for compatibility. Add a `bench` object:

```ts
bench: {
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
}
```

- [ ] **Step 2: Add surface and button aliases**

In `src/theme/colors.ts`, update existing compatible values where safe:

```ts
background: {
  default: '#FFF9ED',
  paper: '#FFFDF8',
  subtle: '#F8EEDC',
  dark: '#2A1A10',
}
```

Do not delete existing palette branches.

- [ ] **Step 3: Tighten typography usage**

Modify `src/theme/typography.ts`.

Keep existing fonts. Add semantic helpers:

```ts
roles: {
  display: 'PlayfairDisplay-Bold',
  displayRegular: 'PlayfairDisplay-Regular',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemibold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
}
```

If adding `roles` causes type issues, keep the existing font keys and use them directly.

- [ ] **Step 4: Create `src/components/Screen.tsx`**

Purpose:

- consistent warm background
- optional scroll behavior
- safe default padding
- avoids repeated page wrapper styles

Implementation:

```tsx
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function Screen({
  children,
  scroll = true,
  padded = true,
  style,
  contentStyle,
}: ScreenProps) {
  const content = (
    <View style={[padded && styles.padded, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top']}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing['4xl'],
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
});
```

- [ ] **Step 5: Create `src/components/BenchCard.tsx`**

Purpose:

- warmer replacement for generic card surfaces
- supports `default`, `filled`, `outlined`, `hero`, and `flat` variants

Implementation:

```tsx
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { theme } from '../theme';

interface BenchCardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'hero' | 'flat';
  padding?: keyof typeof theme.spacing;
}

export default function BenchCard({
  children,
  variant = 'default',
  padding = 'lg',
  style,
  ...props
}: BenchCardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: theme.spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.bench?.borderSoft ?? theme.colors.border.light,
  },
  default: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.sm,
  },
  filled: {
    backgroundColor: theme.colors.background.subtle,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.bench?.border ?? theme.colors.border.main,
  },
  hero: {
    backgroundColor: theme.colors.background.paper,
    borderColor: theme.colors.bench?.border ?? theme.colors.border.main,
    ...theme.shadows.md,
  },
  flat: {
    backgroundColor: theme.colors.background.paper,
    borderColor: theme.colors.border.light,
  },
});
```

- [ ] **Step 6: Create `src/components/SectionHeader.tsx`**

Implementation:

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  eyebrow: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench?.copperDark ?? theme.colors.primary[700],
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.bench?.crust ?? theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    lineHeight: 22,
  },
});
```

- [ ] **Step 7: Create `src/components/MetricTile.tsx`**

Implementation:

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

interface MetricTileProps {
  icon?: string;
  label: string;
  value: string;
  tone?: 'default' | 'copper' | 'green' | 'blue' | 'red';
}

const toneColor = (tone: MetricTileProps['tone']) => {
  switch (tone) {
    case 'green':
      return theme.colors.bench?.starterGreen ?? theme.colors.success.dark;
    case 'blue':
      return theme.colors.bench?.waterBlue ?? theme.colors.info.main;
    case 'red':
      return theme.colors.bench?.heatRed ?? theme.colors.error.main;
    case 'copper':
      return theme.colors.bench?.copper ?? theme.colors.primary[600];
    default:
      return theme.colors.bench?.crustSoft ?? theme.colors.text.secondary;
  }
};

export default function MetricTile({ icon, label, value, tone = 'default' }: MetricTileProps) {
  const color = toneColor(tone);

  return (
    <View style={styles.tile}>
      {icon ? <Icon name={icon} size={20} color={color} /> : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 76,
    borderRadius: 18,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.subtle,
    borderWidth: 1,
    borderColor: theme.colors.bench?.borderSoft ?? theme.colors.border.light,
    justifyContent: 'center',
    gap: 4,
  },
  value: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.bench?.crust ?? theme.colors.text.primary,
  },
  label: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
});
```

- [ ] **Step 8: Create `src/components/SegmentedControl.tsx`**

Implementation:

```tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
  icon?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            style={[styles.option, active && styles.optionActive]}
          >
            {option.icon ? (
              <Icon
                name={option.icon}
                size={18}
                color={active ? theme.colors.white : theme.colors.bench?.crustSoft ?? theme.colors.text.secondary}
              />
            ) : null}
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.bench?.border ?? theme.colors.border.main,
    borderRadius: 22,
    padding: 4,
  },
  option: {
    flex: 1,
    minHeight: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  optionActive: {
    backgroundColor: theme.colors.bench?.copper ?? theme.colors.primary[500],
  },
  label: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench?.crustSoft ?? theme.colors.text.secondary,
  },
  labelActive: {
    color: theme.colors.white,
  },
});
```

- [ ] **Step 9: Update Button visual language**

Modify `src/components/Button.tsx`:

- primary uses copper/gold
- secondary uses dark crust
- outline uses warm border
- border radius becomes 20-24
- shadows become warm and lighter

Do not change the component API.

- [ ] **Step 10: Update BasicInput visual language**

Modify `src/components/BasicInput.tsx`:

- warm cream input background
- warm border
- copper focus color
- no cold gray focus glow
- labels use crust-soft text

Do not change the component API.

- [ ] **Step 11: Verify shared components compile**

Run:

```bash
npx tsc --noEmit
```

Expected:

- TypeScript passes, or type issues are fixed before moving on.

Commit after Phase 2:

```bash
git add src/theme src/components
git commit -m "style: add baker bench design foundation"
```

### Phase 3: Home Command Center

Objective:

Home should no longer be a list of generic navigation cards. It should show the user's next meaningful baking action.

- [ ] **Step 1: Replace static quick-action layout**

Modify `src/screens/Home/HomeScreen.tsx`.

Target sections:

1. App identity/header
2. Next Up card
3. Bake Plan / Photo Rescue hero actions
4. Quick tools grid
5. Starter/recipe shortcut

- [ ] **Step 2: Add Home data hooks carefully**

Use existing storage services if cheap:

- `starterStorage.getAll()`
- `getAllRecipes()`
- feeding due helpers from `src/utils/starterHealth.ts`

If data fetching becomes risky, use graceful empty copy and keep the UI structure.

- [ ] **Step 3: Add Next Up card logic**

Priority order:

1. If a starter has `nextFeedingDue`, show the soonest feeding.
2. Else if recipes exist, show "Pick a recipe for your next bake."
3. Else show "Create your first starter."

Suggested copy:

- Eyebrow: `NEXT UP`
- Title examples:
  - `Feed Mabel`
  - `Plan today's bake`
  - `Create your first starter`
- Supporting copy:
  - `Due in 42 minutes`
  - `Choose a recipe and build a timeline`

- [ ] **Step 4: Add primary action pair**

Use prominent buttons:

- `Photo Rescue`
- `Bake Day Copilot` if present, otherwise `Timeline Calculator`

Do not invent broken navigation routes. Check `src/navigation/types.ts` and `MainTabNavigator.tsx` first.

- [ ] **Step 5: Add compact quick tools**

Use 2-column `MetricTile` or compact `BenchCard` items for:

- Calculators
- Starters
- Recipes
- Academy

These are secondary to the Next Up card.

- [ ] **Step 6: Remove or de-emphasize social footer**

Social links should not be the final impression of Home during the hackathon demo. If kept, make them small and below product actions.

- [ ] **Step 7: Verify Home navigation**

Manually test:

- Home -> Tools
- Home -> Starters
- Home -> Recipes
- Home -> Learn
- Home -> Photo Rescue if implemented
- Home -> Bake Day Copilot or Timeline Calculator

Commit:

```bash
git add src/screens/Home/HomeScreen.tsx
git commit -m "feat: redesign home as baker command center"
```

### Phase 4: Tools Hub Refresh

Objective:

Tools should feel like a toolbox/workbench, not an undifferentiated list of cards.

- [ ] **Step 1: Group tools**

Modify `src/screens/Tools/ToolsScreen.tsx`.

Recommended groups:

- Plan
  - Timeline Calculator
  - Bake Day Copilot if present
- Formula
  - Baker's Percentage
  - Hydration Converter
  - Recipe Scaler
  - Flour Blend
- Rescue
  - Photo Rescue if present
  - Recipe Rescue
- Build
  - Levain Builder
  - Preferment Calculator
  - Dough Weight
  - Starter Percentage
  - Temperature Calculator

- [ ] **Step 2: Add featured row**

At top, feature:

- Photo Rescue
- Bake Day Copilot
- Baker's Percentage

If Photo Rescue/Bake Day Copilot are not implemented yet, feature Baker's Percentage, Timeline, and Recipe Rescue.

- [ ] **Step 3: Convert tool cards**

Each tool card should show:

- icon
- title
- one-line use case
- small group badge or accent color

Avoid large repeated cards that all look identical.

- [ ] **Step 4: Verify every tool route**

Tap every tool in the Replit preview.

Expected:

- Every existing calculator opens.
- No route names are broken.

Commit:

```bash
git add src/screens/Tools/ToolsScreen.tsx
git commit -m "style: organize tools into baker workbench"
```

### Phase 5: Result-First Calculator Pattern

Objective:

Prove the new calculator UX with Baker's Percentage first, then apply the simpler visual polish to Timeline.

- [ ] **Step 1: Refactor Baker's Percentage top layout**

Modify `src/screens/Tools/BakersCalculatorScreen.tsx`.

New order:

1. Visual formula preview / hydration ring at top
2. Mode segmented control
3. Preset chips
4. Base input
5. Ingredient editor
6. Result table and save action
7. Help text collapsed or placed at bottom

- [ ] **Step 2: Create or use `FormulaPreview`**

Create `src/components/FormulaPreview.tsx` if not already created.

It should accept:

```ts
interface FormulaPreviewProps {
  hydrationPercent: number;
  flourWeight?: string;
  totalWeight?: string;
  items: Array<{ label: string; value: string }>;
}
```

Keep it visual:

- big hydration number
- circular/ring cue if easy with React Native views
- compact ingredient rows

- [ ] **Step 3: Make inputs update preview before calculate**

Preview can show estimated values as the user types.

If live calculation creates risk, show:

- hydration from water percentage
- flour weight
- total percentage

Do not hide all results until Calculate.

- [ ] **Step 4: Replace alert-only validation**

Current calculators use `Alert.alert` for invalid input. For Baker's Percentage, add inline validation state:

- missing flour weight
- missing total weight
- invalid percentages

Keep alerts only if necessary.

- [ ] **Step 5: Preserve Save as Recipe**

Do not break `handleSaveAsRecipe`.

Manual test:

- enter 500g flour
- calculate
- save as recipe
- verify Add Recipe opens with prefilled formula

- [ ] **Step 6: Refresh Timeline Calculator visual layout**

Modify `src/screens/Tools/TimelineCalculatorScreen.tsx`.

Use:

- result summary near top
- vertical timeline rail for steps after calculation
- target time as a warm control card
- no large "How to use" block above important content

- [ ] **Step 7: Verify calculator behavior**

Run existing calculation tests:

```bash
npm test -- src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
```

Manual tests:

- Baker's Percentage flour mode
- Baker's Percentage total mode
- add/remove ingredient
- load preset
- Timeline select time
- Timeline add/remove step
- calculate backwards schedule

Commit:

```bash
git add src/components/FormulaPreview.tsx src/screens/Tools/BakersCalculatorScreen.tsx src/screens/Tools/TimelineCalculatorScreen.tsx
git commit -m "feat: make calculators result-first workbenches"
```

### Phase 6: Photo Rescue UI Alignment

Objective:

Make implemented Photo Rescue screens match the provided mockups. If Photo Rescue is not implemented yet, keep this phase for the agent that builds it.

- [ ] **Step 1: Locate Photo Rescue files**

Run:

```bash
find src -type f | grep -i "photo\\|rescue\\|diagnosis"
```

- [ ] **Step 2: Align input screen**

Use `replit/photo-rescue-input.png`.

Required visual structure:

- warm full screen
- large title `Photo Rescue`
- image preview card
- subject segmented control: Starter, Dough, Loaf, Crumb
- context chips: stage, room temp, hydration
- prominent `Analyze Dough` or `Analyze Starter` button
- "What I can check" card

- [ ] **Step 3: Align result screen**

Use `replit/dough-diagnosis-result.png`.

Required visual structure:

- image hero with confidence badge
- diagnosis conclusion card
- `WHAT I SEE` evidence rows
- `DO NOW` ordered action list
- `NEXT BAKE` prevention chips
- bottom action button: `Start Rescue Timer` or `Create Bake Plan`

- [ ] **Step 4: Keep confidence language safe**

Only show:

- low confidence
- medium confidence
- high confidence

Never show exact percentages.

- [ ] **Step 5: Verify fallback honesty**

When Gemini is unavailable, UI must say:

```text
Using quick rescue checklist
```

Do not imply image analysis happened.

Commit:

```bash
git add src
git commit -m "style: align photo rescue with premium diagnosis UI"
```

### Phase 7: Bake Day Copilot UI Alignment

Objective:

Make Bake Day Copilot match the mockup and feel like a schedule instrument.

- [ ] **Step 1: Locate Bake Day files**

Run:

```bash
find src -type f | grep -i "bake\\|copilot\\|timeline"
```

- [ ] **Step 2: Align top control strip**

Use `replit/bake-day-copilot.png`.

Controls:

- Bake by
- Room
- Starter
- Hydration

Each should look like a compact metric/control tile.

- [ ] **Step 3: Align timeline**

Use a vertical rail:

- icon circle on left
- time and step name on right
- solid rail for active same-day steps
- dotted rail for cold proof / overnight gap if present

Required steps:

- Mix dough
- Coil fold
- Bulk check
- Shape + cold proof
- Preheat
- Bake

- [ ] **Step 4: Add insight card**

Example:

```text
Cool room: expect slower fermentation
Lower temps slow fermentation. Great for flavor - plan a little extra time.
```

This should be generated deterministically from inputs where possible.

- [ ] **Step 5: Preserve reminder fail-soft behavior**

Reminder toggle must not break web.

Commit:

```bash
git add src
git commit -m "style: align bake day copilot with timeline instrument"
```

### Phase 8: Starter Tracking Refresh

Objective:

Make starters visually communicate state.

- [ ] **Step 1: Redesign `StarterCard`**

Modify `src/components/StarterCard.tsx`.

Card priority:

1. starter name
2. health/status badge
3. next feeding due
4. flour type
5. starter type
6. notes, if present

Use `MetricTile` style sub-surfaces instead of a plain label/value list.

- [ ] **Step 2: Add overdue visual distinction**

If `isFeedingOverdue(starter.nextFeedingDue)`:

- use heat red accent
- show `Overdue`
- make the next feeding row prominent

- [ ] **Step 3: Refresh empty state**

Modify `src/screens/Starters/StartersScreen.tsx`.

Empty state should feel like a starter bench card:

- title: `Start your first culture`
- text: short, practical
- primary action: `Add Starter`

Remove emoji from production copy.

- [ ] **Step 4: Verify starter flows**

Manual:

- empty state
- add starter
- starter list
- starter detail
- delete starter confirmation

Commit:

```bash
git add src/components/StarterCard.tsx src/screens/Starters/StartersScreen.tsx
git commit -m "style: make starter cards show fermentation state"
```

### Phase 9: Recipe Cards Refresh

Objective:

Recipes should scan like formula cards.

- [ ] **Step 1: Redesign recipe card**

Modify `src/screens/Recipes/RecipesScreen.tsx`.

Each card should show:

- recipe name
- starter badge if linked
- hydration tile
- total weight tile
- yield tile if present
- flour/water/salt/starter formula mini-grid

- [ ] **Step 2: Improve empty state**

Empty state:

- title: `Your recipe bench is ready`
- text: `Save formulas from calculators or build one from scratch.`
- action: `Add Recipe`

No emoji.

- [ ] **Step 3: Check text wrapping**

Recipe names and starter badge must not overlap.

Manual test with:

- long recipe name
- long starter name
- missing description
- missing yield

Commit:

```bash
git add src/screens/Recipes/RecipesScreen.tsx
git commit -m "style: redesign recipes as formula cards"
```

### Phase 10: Learn And Profile Polish

Objective:

Make secondary screens feel related without spending too much time.

- [ ] **Step 1: Refresh Learn screen**

Modify `src/screens/Learn/LearnScreen.tsx`.

Keep video functionality.

Visual changes:

- warm background
- premium featured card
- category segmented/chip controls matching the new style
- smaller shadows
- consistent section headers

- [ ] **Step 2: Refresh Profile screen**

Modify `src/screens/Profile/ProfileScreen.tsx`.

Visual changes:

- warm background
- grouped settings sections
- less generic row styling
- consistent icons and borders

Do not add new account/auth behavior.

Commit:

```bash
git add src/screens/Learn/LearnScreen.tsx src/screens/Profile/ProfileScreen.tsx
git commit -m "style: polish secondary screens"
```

### Phase 11: Navigation And Bottom Tab Polish

Objective:

Make navigation match the new warm premium surface.

- [ ] **Step 1: Update bottom tab styling**

Modify `src/navigation/MainTabNavigator.tsx`.

Recommended:

- warm off-white background
- copper active color
- crust-soft inactive color
- slightly lower icon size contrast
- lighter top border
- no oversized tab height unless needed for safe area

- [ ] **Step 2: Update stack header styling**

In each stack navigator, add shared `screenOptions` if practical:

```tsx
screenOptions={{
  headerStyle: { backgroundColor: theme.colors.background.default },
  headerTintColor: theme.colors.bench?.crust ?? theme.colors.text.primary,
  headerTitleStyle: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: 22,
  },
  headerShadowVisible: false,
}}
```

If this creates platform issues, apply only to the most visible stacks.

- [ ] **Step 3: Verify route labels**

Make sure tab labels remain:

- Home
- Tools
- Starters
- Recipes
- Profile

Do not add a sixth tab.

Commit:

```bash
git add src/navigation/MainTabNavigator.tsx
git commit -m "style: warm navigation chrome"
```

### Phase 12: Final Visual QA

- [ ] **Step 1: Run TypeScript**

```bash
npx tsc --noEmit
```

Expected:

- No TypeScript errors.

- [ ] **Step 2: Run tests**

```bash
npm test -- --runInBand
```

Expected:

- Tests pass, or any unrelated existing failures are clearly documented.

- [ ] **Step 3: Run Expo web**

```bash
npm start -- --web
```

Manually verify:

- Home command center
- Tools hub
- Baker's Percentage
- Timeline Calculator
- Starters list/empty state
- Recipes list/empty state
- Photo Rescue if present
- Diagnosis result if present
- Bake Day Copilot if present
- Learn
- Profile

- [ ] **Step 4: Mobile viewport check**

Use Replit/browser responsive tools or Expo preview.

Check:

- iPhone-sized viewport
- wide desktop/web viewport
- long recipe names
- long starter names
- empty states
- keyboard on calculator inputs

- [ ] **Step 5: Golden hackathon path**

Verify this path is obvious:

1. Home
2. Photo Rescue
3. Analyze dough photo or sample
4. Diagnosis Result
5. Create Bake Plan
6. Bake Day Copilot timeline

If Photo Rescue/Bake Day Copilot are not implemented yet, verify Home clearly points to the best available substitute and leave a note for the feature agent.

## Acceptance Criteria

The Replit UI/UX refresh is acceptable when:

- `replit/ui-ux-review-board.png` direction is visible in the app.
- Home is task-forward, not a static menu.
- Tools are grouped and scannable.
- Baker's Percentage is result-first.
- Timeline has a visual schedule treatment.
- Starter cards show state at a glance.
- Recipe cards scan like formula cards.
- Photo Rescue, if present, visually matches the mockup direction.
- Bake Day Copilot, if present, visually matches the mockup direction.
- No existing calculator route is broken.
- Expo web starts.
- No API keys are committed.

## Suggested Commit Sequence

Use frequent commits:

```bash
git commit -m "style: add baker bench design foundation"
git commit -m "feat: redesign home as baker command center"
git commit -m "style: organize tools into baker workbench"
git commit -m "feat: make calculators result-first workbenches"
git commit -m "style: align photo rescue with premium diagnosis UI"
git commit -m "style: align bake day copilot with timeline instrument"
git commit -m "style: make starter cards show fermentation state"
git commit -m "style: redesign recipes as formula cards"
git commit -m "style: polish secondary screens"
git commit -m "style: warm navigation chrome"
```

## If Time Gets Tight

Protect these in order:

1. Theme/shared foundation
2. Home command center
3. Photo Rescue visual alignment
4. Bake Day Copilot visual alignment
5. Baker's Percentage result-first pattern
6. Tools grouping
7. Starter and recipe card refresh
8. Learn/Profile polish

Cut these first:

1. Profile polish
2. Learn polish
3. Secondary calculator redesigns beyond Baker's Percentage and Timeline
4. Advanced animations
5. Any new visual asset generation

## Final Replit Agent Response Format

When complete, return:

```text
UI/UX refresh complete.

Files changed:
- ...

Verification:
- npm test -- --runInBand: PASS/FAIL
- npx tsc --noEmit: PASS/FAIL
- Expo web: PASS/FAIL

Manual QA:
- Home: PASS/FAIL
- Tools: PASS/FAIL
- Baker's Percentage: PASS/FAIL
- Timeline: PASS/FAIL
- Starters: PASS/FAIL
- Recipes: PASS/FAIL
- Photo Rescue: PASS/FAIL or not implemented yet
- Bake Day Copilot: PASS/FAIL or not implemented yet

Known risks:
- ...

Demo path:
1. ...
```
