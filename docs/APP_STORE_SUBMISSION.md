# Sourdough Suite iOS App Store Submission Runbook

Last updated: May 2026

This repo is ready to use the normal Expo/EAS path:

1. GitHub is the source of truth.
2. EAS Build creates the iOS App Store binary in the cloud.
3. App Store Connect receives the build for TestFlight and App Review.

## Current App Identity

- App name: `Sourdough Suite`
- Bundle ID: `com.sourdoughsuite.app`
- Version: `1.0.0`
- iOS build number: `1` locally, with EAS production auto-increment enabled
- Supported device family: iPhone only for first release
- Privacy policy: `https://scottolmer.github.io/sourdoughsuitenew/privacy-policy.html`
- Terms: `https://scottolmer.github.io/sourdoughsuitenew/terms-of-service.html`
- Support URL: `https://scottolmer.github.io/sourdoughsuitenew/support.html`

## Must Do Before First TestFlight Build

- Enroll in the Apple Developer Program.
- Create the app in App Store Connect using bundle ID `com.sourdoughsuite.app`.
- Configure EAS/Expo credentials interactively.
- Deploy the Photo Rescue API to a stable HTTPS production host.
- Set `EXPO_PUBLIC_API_BASE_URL` for EAS production builds, for example:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value https://YOUR_API_HOST/api
```

Photo Rescue will fall back to Quick Rescue if the backend is unavailable, but App Review should see the intended AI-backed flow working.

## Local Verification Completed

- `npx tsc --noEmit`
- `npm test -- src/utils/__tests__/bakePlanner.test.ts src/utils/__tests__/photoRescueRules.test.ts --runInBand`
- `npx expo install --check`
- `npx expo-doctor`
- `pod install` from `ios/`
- `xcodebuild -workspace ios/SourdoughSuiteNew.xcworkspace -list`

Note: `npx expo-doctor` still reports the expected warning that native config fields may not sync automatically because this repo includes checked-in `ios/` and `android/` folders. The iOS native files were updated directly.

Note: a local `xcodebuild` compile could not run on this Mac because Xcode reports the iOS 26.4 platform as unavailable for build destinations. The next true native compile check should be an EAS production build or a local Xcode install with the matching iOS platform installed.

## Build And Submit

```bash
npm install
npx eas login
npx eas build:configure
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

If you want EAS to submit automatically after the build:

```bash
npx eas build --platform ios --profile production --auto-submit
```

## App Store Connect Metadata Draft

- Name: `Sourdough Suite`
- Subtitle: `Rescue, plan, bake`
- Category: `Food & Drink`
- Secondary category: `Productivity`
- Age rating: `4+` unless Apple flags AI/photo upload as requiring a different answer in the questionnaire
- Keywords, 100 chars max:

```text
sourdough,bread,baking,starter,recipe,fermentation,levain,dough,bakery,calculator
```

## Description Draft

Sourdough Suite is a professional baker's sourdough toolkit for the messy middle of bread making: diagnosing dough problems, planning bake days, managing starter care, saving recipes, and calculating formulas.

Built by a professional baker for real bakery decisions, Sourdough Suite helps you:

- Use Photo Rescue to triage dough, starter, crumb, and loaf issues
- Build bake-day timelines from room temperature, hydration, starter readiness, and target bake time
- Calculate baker's percentages, hydration, levain, flour blends, dough weight, and more
- Track starter feedings and readiness
- Save bake plans and formulas into My Recipes

The app keeps guidance practical and honest. Photo Rescue does not pretend certainty from a single image; it gives likely causes, confidence, and next steps so you can make a better call at the bench.

## Review Notes Draft

Sourdough Suite does not require login.

Suggested review path:

1. Open Tools.
2. Open Photo Rescue.
3. Use the sample dough photo or upload a baking photo.
4. Review the diagnosis and next steps.
5. Create a bake plan from the diagnosis.
6. Save the bake plan as a recipe.

Photo Rescue uses an HTTPS backend configured by `EXPO_PUBLIC_API_BASE_URL`. If the AI service is temporarily unavailable, the app displays a Quick Rescue fallback so the user can continue without crashing.

## Screenshots Needed

For first release, iPhone screenshots are required in App Store Connect. Capture actual current UI:

- Dashboard / home
- Photo Rescue input
- Diagnosis result
- Bake Planner
- Tools list
- Recipe detail or Starter Log

Because first release is configured as iPhone-only, iPad screenshots are not required.

## Remaining Checks Before Submit

- Run `npx tsc --noEmit`.
- Run focused tests:

```bash
npm test -- src/utils/__tests__/bakePlanner.test.ts src/utils/__tests__/photoRescueRules.test.ts --runInBand
```

- Run an actual EAS production build.
- Install the TestFlight build on a physical iPhone.
- Verify Photo Rescue with production backend.
- Verify local notification permission appears only after user action.
- Confirm App Store privacy nutrition labels match the privacy policy.
