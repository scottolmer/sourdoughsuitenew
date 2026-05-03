# Local Modernist File Map

This is the file-level source of truth for replicating the local simulator build in Replit.

## Package Changes

Modify:

- `package.json`
- `package-lock.json`

Added dependencies:

- `expo-image-picker`
- `react-dom`
- `react-native-web`

## Theme And Compatibility

Modify:

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/index.ts`
- `src/components/Card.tsx`
- `src/components/Button.tsx`
- `src/components/BasicInput.tsx`
- `src/components/Input.tsx`
- `src/services/notificationService.ts`

Create:

- `src/types/react-native-vector-icons.d.ts`

Important compatibility fixes:

- Add `theme.colors.modernist`.
- Keep old color aliases such as `border.default`, `border.medium`, `warning.default`, `warning.medium`, `error.default`, `error.medium`.
- Add `required?: boolean` to `InputProps` because Add/Edit Recipe already pass that prop.
- Add `shouldShowBanner` and `shouldShowList` to Expo notification behavior.
- Add a declaration for `react-native-vector-icons/MaterialCommunityIcons`.

## Shared Modernist Components

Create exactly these components:

- `src/components/ModernistScreen.tsx`
- `src/components/FormulaSheet.tsx`
- `src/components/RuleHeader.tsx`
- `src/components/FactStrip.tsx`
- `src/components/FormulaTable.tsx`
- `src/components/StageDirections.tsx`
- `src/components/TimelineRail.tsx`
- `src/components/ModernistSegmentedControl.tsx`

Critical component:

- `FactStrip` must be one horizontal row. Do not wrap cells into two rows.

## Domain Logic And Tests

Create:

- `src/utils/photoRescueRules.ts`
- `src/utils/bakePlanner.ts`
- `src/utils/__tests__/photoRescueRules.test.ts`
- `src/utils/__tests__/bakePlanner.test.ts`

Modify:

- `src/types/index.ts`

Types added:

- `PhotoSubject`
- `Confidence`
- `ScheduleStyle`
- `StarterReadiness`
- `PhotoRescueContext`
- `PhotoRescueRequest`
- `RescueAction`
- `BakePlanSeed`
- `PhotoRescueDiagnosis`
- `QuickRescueAnswers`
- `PhotoRescueResult`
- `BakePlanInput`
- `BakeStepType`
- `BakePlanStep`
- `BakePlan`
- `SavedDiagnosisRecord`
- `SavedBakePlanRecord`

## Services

Create:

- `src/services/photoRescueStorage.ts`
- `src/services/bakePlanStorage.ts`
- `src/services/photoRescueService.ts`

Behavior:

- Save recent diagnoses and bake plans to AsyncStorage.
- `photoRescueService` may call `/photo-rescue/analyze`, but must fall back to `createQuickRescueDiagnosis`.
- The sample-photo demo path must work without a backend.

## Screens

Create:

- `src/screens/PhotoRescue/PhotoRescueScreen.tsx`
- `src/screens/PhotoRescue/PhotoRescueResultScreen.tsx`
- `src/screens/BakePlanner/BakePlannerScreen.tsx`
- `src/screens/BakePlanner/BakePlanDetailScreen.tsx`

Modify:

- `src/screens/Home/HomeScreen.tsx`
- `src/screens/Tools/ToolsScreen.tsx`
- `src/screens/Recipes/RecipesScreen.tsx`
- `src/screens/Recipes/RecipeDetailScreen.tsx`

## Navigation

Modify:

- `src/navigation/types.ts`
- `src/navigation/MainTabNavigator.tsx`

Add to `ToolsStackParamList`:

```ts
PhotoRescue: undefined;
PhotoRescueResult: { diagnosisId: string };
BakePlanner: { diagnosisId?: string } | undefined;
BakePlanDetail: { planId: string };
```

Add screens to `ToolsStack()` before existing calculators:

- `PhotoRescue`
- `PhotoRescueResult`
- `BakePlanner`
- `BakePlanDetail`

## Do Not Touch Unless Needed

Leave these alone unless compile errors require a narrow compatibility fix:

- Existing calculator logic
- Starter storage shape
- Recipe storage shape
- Bottom tab count
- Auth hooks
- Query provider
