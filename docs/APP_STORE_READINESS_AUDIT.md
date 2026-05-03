# App Store Readiness Audit

Last updated: May 2026

## Summary

The app is close enough to start the App Store process, but it should go through TestFlight before App Review. The biggest remaining blocker is a stable production API URL for Photo Rescue.

## Pass

- Expo/EAS config exists: `app.json`, `eas.json`.
- iOS bundle ID is set to `com.sourdoughsuite.app`.
- App icon asset is 1024 x 1024 PNG without alpha: `assets/app-icon.png`.
- Privacy manifest exists: `ios/SourdoughSuiteNew/PrivacyInfo.xcprivacy`.
- Public privacy policy and terms pages exist under `docs/`.
- Native iOS project now declares photo, camera, notification, and encryption usage.
- Native iOS project is wired for Expo modules and `pod install` completes.
- First release is set to iPhone-only to avoid rushed iPad layout and screenshot risk.
- TypeScript passes with `npx tsc --noEmit`.
- Expo dependencies pass with `npx expo install --check`.
- Focused domain tests pass for bake planning and photo rescue rules.

## Must Fix Before App Review

1. Production API URL
   - File: `src/constants/api.ts`
   - Required action: set `EXPO_PUBLIC_API_BASE_URL` in EAS production builds.
   - Why: native production builds cannot use Replit preview host detection or `localhost`.

2. Apple Developer/App Store Connect setup
   - Required action: create the App Store Connect app with bundle ID `com.sourdoughsuite.app`.
   - Required action: fill the `eas.json` submit values or provide them interactively during `eas submit`.

3. Physical TestFlight testing
   - Required action: install the first TestFlight build on an actual iPhone and run the core flow.
   - Why: App Review commonly rejects crashes, broken backend calls, and incomplete flows.

## Warnings

1. Photo Rescue sends user-selected photos to an AI backend.
   - The privacy policy was updated to disclose this.
   - App Store privacy nutrition labels must also disclose the behavior accurately.

2. The repo includes both Expo config and native iOS files.
   - Native Info.plist and Xcode project settings were updated directly because EAS may build the checked-in iOS project.
   - `npx expo-doctor` still reports this expected non-CNG warning.

3. Full Jest suite may still need configuration work.
   - The focused tests pass. If the full test suite fails because of React Navigation/ESM transform config, treat that as a test harness issue to fix separately.

4. Local Xcode build could not run on this Mac because Xcode reports the iOS 26.4 platform as unavailable for destinations.
   - `pod install` and workspace listing pass, so use EAS/TestFlight as the next build gate.

## Recommended App Review Path

Submit to TestFlight first, not App Review. When TestFlight is installed:

1. Open Dashboard.
2. Open Tools.
3. Run Photo Rescue with the sample image.
4. Create a bake plan.
5. Save/revisit the plan or recipe.
6. Verify no screen crashes and all bottom tabs return to the expected index.
