# SourdoughSuite Final QA Checklist

Run this before submission.

## Automated Checks

- [ ] Install dependencies if needed.

```bash
npm install
```

- [ ] TypeScript check.

```bash
npx tsc --noEmit
```

- [ ] Unit tests.

```bash
npm test -- --runInBand
```

- [ ] Expo web starts.

```bash
npm start -- --web
```

- [ ] Backend health route works, if backend exists.

```bash
curl http://localhost:$PORT/api/health
```

## Manual App QA

### Home

- [ ] Home loads.
- [ ] Home feels like a command center, not only a static menu.
- [ ] Photo Rescue entry is visible if implemented.
- [ ] Bake Day Copilot or timeline entry is visible.
- [ ] Tools, Starters, Recipes, Academy/Profile navigation still works.

### Photo Rescue

- [ ] Photo Rescue screen opens.
- [ ] `Use sample dough photo` works.
- [ ] Upload/select image works on web if supported.
- [ ] Subject control supports Dough, Starter, Crumb, Loaf.
- [ ] Dough/bulk path is visually prioritized.
- [ ] Analyze button works.
- [ ] Loading state is clear.
- [ ] Error state is clear.

### Diagnosis Result

- [ ] Diagnosis title renders.
- [ ] Confidence shows low, medium, or high only.
- [ ] No confidence percentages are shown.
- [ ] Visual evidence renders.
- [ ] Do Now actions render.
- [ ] Next Bake tips render.
- [ ] Risk/caution note renders.
- [ ] Missing context questions render for low confidence.
- [ ] Create Bake Plan button works.

### Quick Rescue

- [ ] Missing `GEMINI_API_KEY` triggers fallback.
- [ ] Gemini/network failure triggers fallback.
- [ ] UI says `Using quick rescue checklist`.
- [ ] UI does not imply image analysis happened.
- [ ] Checklist result gives useful safe guidance.
- [ ] Create Bake Plan still works from fallback result.

### Bake Day Copilot

- [ ] Screen opens from Home/Tools.
- [ ] Screen opens from Diagnosis Result.
- [ ] Overnight cold proof default path works.
- [ ] Same-day path works if implemented.
- [ ] Timeline contains mix, folds, bulk check, shape/cold proof, preheat, bake, cool.
- [ ] Temperature/starter/hydration notes render.
- [ ] Reminder toggle does not crash web.
- [ ] Reminder unavailable state is understandable on web.

### Calculators

- [ ] Tools screen opens.
- [ ] Baker's Percentage opens.
- [ ] Baker's Percentage flour mode works.
- [ ] Baker's Percentage total weight mode works.
- [ ] Recipe presets work.
- [ ] Add/remove ingredient works.
- [ ] Save as Recipe still navigates correctly.
- [ ] Timeline Calculator opens.
- [ ] Other existing calculators still open.

### Starters

- [ ] Starters tab opens.
- [ ] Empty state is polished.
- [ ] Starter list renders if data exists.
- [ ] Starter detail route opens.
- [ ] Add Starter route opens.
- [ ] Delete confirmation still works.

### Recipes

- [ ] Recipes tab opens.
- [ ] Empty state is polished.
- [ ] Recipe cards render if data exists.
- [ ] Long recipe names do not overlap badges.
- [ ] Recipe detail route opens.
- [ ] Add Recipe route opens.

### Landing Page

- [ ] `replit/landing-oven-light.html` opens locally.
- [ ] `replit/landing-oven-light.png` matches the selected direction.
- [ ] If static site is updated, `docs/index.html` opens.
- [ ] Landing page CTA is easy to replace with final Replit demo URL.

## Responsive Checks

Check at:

- [ ] mobile width around 390px
- [ ] tablet width around 768px
- [ ] desktop width around 1440px

Verify:

- [ ] no text overlaps
- [ ] buttons remain tappable
- [ ] screenshots/images do not cover important copy
- [ ] bottom tab remains usable
- [ ] keyboard does not block critical calculator actions

## Demo Path QA

Run this path at least three times:

1. [ ] Home.
2. [ ] Photo Rescue.
3. [ ] Use sample dough photo.
4. [ ] Analyze.
5. [ ] Diagnosis Result.
6. [ ] Create Bake Plan.
7. [ ] Bake Day Copilot timeline.
8. [ ] Landing page.

Record any failures and fix before adding stretch features.

## Submission Safety

- [ ] No API keys committed.
- [ ] No auth gate blocks the demo.
- [ ] No required native-only camera path blocks web.
- [ ] No broken bottom tabs.
- [ ] No deleted calculators.
- [ ] No exact diagnosis certainty claims.
- [ ] No hidden dependency on local-only URLs.

## Final Report Template

```text
Final QA:
- TypeScript: PASS/FAIL
- Tests: PASS/FAIL
- Expo web: PASS/FAIL
- Backend health: PASS/FAIL or not applicable
- Gemini path: PASS/FAIL
- Quick Rescue fallback: PASS/FAIL
- Golden demo path: PASS/FAIL
- Landing page: PASS/FAIL

Files changed:
- ...

Known risks:
- ...

Demo steps:
1. ...
```
