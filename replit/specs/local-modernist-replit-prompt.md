# Paste-Ready Replit Prompt: Match The Local Modernist Build

Paste this into Replit Agent when you want it to replicate the local simulator version.

```text
You are working on SourdoughSuite, an Expo / React Native sourdough app.

Replit's current version is visually wrong. Match the local simulator build exactly enough that it feels like the same implementation.

Read these files first:
- replit/LOCAL_MODERNIST_REPLIT_HANDOFF.md
- replit/specs/local-modernist-file-map.md
- replit/specs/local-modernist-screen-spec.md
- replit/specs/modernist-formula-cards-style-guide.md
- replit/modernist-screen-system.png

Then inspect the current local source files named in the file map and port the implementation patterns.

Your mission:
1. Add/verify the Modernist shared components:
   - ModernistScreen
   - FormulaSheet
   - RuleHeader
   - FactStrip
   - FormulaTable
   - StageDirections
   - TimelineRail
   - ModernistSegmentedControl
2. Add/verify Photo Rescue:
   - PhotoRescueScreen
   - PhotoRescueResultScreen
   - Quick Rescue fallback rules
   - diagnosis storage
3. Add/verify Bake Planner:
   - BakePlannerScreen
   - BakePlanDetailScreen
   - deterministic timeline generator
   - bake plan storage
4. Update navigation:
   - PhotoRescue
   - PhotoRescueResult
   - BakePlanner
   - BakePlanDetail
5. Update Home and Tools to match the local simulator.
6. Update Recipes list/detail to use formula-index and formula-table patterns.

Non-negotiable visual bug fix:
- On Home, the second section under NEXT UP must be one horizontal 4-cell FactStrip.
- Do not let it become vertical.
- Do not let it become a 2x2 grid.
- In FactStrip, use flexDirection: 'row' on the container and flex: 1 / minWidth: 0 on cells.
- Do not use flexWrap, minWidth: '50%', or flexBasis: '50%' in FactStrip.

Design direction:
- White/paper background.
- Black ink typography.
- Thin teal rules.
- Compact uppercase labels.
- Sparse copper accents.
- No beige/gold dominance.
- No big rounded dashboard cards.

Behavior:
- The sample Photo Rescue path must work without Gemini.
- If backend/Gemini is unavailable, show honest fallback guidance with exactly:
  Using quick rescue checklist
- Bake Planner timeline must be deterministic code, not AI-invented times.

Dependencies:
- Install Expo-compatible versions of expo-image-picker, react-dom, and react-native-web if missing.
- If npm hits the existing React types peer conflict, use npm install --legacy-peer-deps after Expo writes package.json.

Validation:
- Run npx tsc --noEmit.
- Run focused tests:
  npm test -- src/utils/__tests__/photoRescueRules.test.ts src/utils/__tests__/bakePlanner.test.ts src/utils/__tests__/sourdoughCalculations.test.ts --runInBand
- Start Expo web.

Known test caveat:
- Full npm test may fail on __tests__/App.test.tsx because Jest is not transforming React Navigation ESM. Do not spend time on that unless all feature work is done.

Return:
- files changed
- commands run
- what passed
- what failed
- screenshots or simulator notes
```
