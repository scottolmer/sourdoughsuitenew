# Replit Agent Prompt Sequence

Use these prompts in order. The strategy is thin vertical slice first: prove the real Gemini Photo Rescue loop before expanding the product.

## Prompt 1: Orientation Only

```text
Read the project structure before editing.

This is SourdoughSuite, an Expo / React Native app. The hackathon features are Photo Rescue and Bake Day Copilot. Use these files as product and technical source of truth:

- replit/specs/prd.md
- replit/specs/technical-spec.md
- replit/specs/ai-prompts.md
- replit/photo-rescue-input.png
- replit/dough-diagnosis-result.png
- replit/bake-day-copilot.png

Do not edit files yet.

Summarize:
1. Current navigation structure.
2. Current theme and reusable components.
3. Current API service pattern.
4. Current notification service pattern.
5. Current local storage patterns.
6. Safest files to modify for Photo Rescue and Bake Day Copilot.
7. Any dependency or Expo web risks.

Important constraints:
- Do not rebuild the app from scratch.
- Do not remove existing tools.
- Do not add auth gates.
- Do not call Gemini from the client.
- Do not hardcode API keys.
- Keep the first demo path browser-friendly in Replit.
```

## Prompt 2: Create The Thin Vertical Slice Plan

```text
Create a step-by-step implementation plan for the first vertical slice:

Home/Tools entry -> Photo Rescue screen -> choose sample/upload image -> POST base64 JSON to Express backend -> backend calls Gemini -> backend validates diagnosis JSON -> app renders result screen -> fallback to Quick Rescue if Gemini fails.

Use these specs:
- replit/specs/prd.md
- replit/specs/technical-spec.md
- replit/specs/ai-prompts.md

Do not implement yet.

The plan must list exact files to create/modify, tests to add, dependencies to install, and verification commands. Keep scope limited to the vertical slice.
```

## Prompt 3: Implement Backend Foundation

```text
Implement the Express backend foundation for Photo Rescue.

Requirements:
- Add an Express server in the same Replit project.
- Add GET /api/health.
- Add POST /api/photo-rescue/analyze.
- Read GEMINI_API_KEY and optional GEMINI_MODEL from environment variables.
- Accept base64 JSON: imageBase64, mimeType, context.
- Validate request size and required fields.
- If GEMINI_API_KEY is missing, return fallback-required response.
- Do not expose raw Gemini errors.
- Keep the app compatible with Expo web and Expo Go.

Use Google AI Studio Gemini API. Follow:
- replit/specs/technical-spec.md
- replit/specs/ai-prompts.md
- https://ai.google.dev/gemini-api/docs/image-understanding
- https://ai.google.dev/gemini-api/docs/structured-output

Add focused tests for response normalization/validation if the repo test setup supports it.

Stop after backend verification and show:
- health route output
- missing-key fallback output
- files changed
```

## Prompt 4: Implement Photo Rescue UI Shell

```text
Implement the Photo Rescue UI shell and navigation.

Requirements:
- Add Photo Rescue to the Tools stack.
- Add a tasteful Home entry point if straightforward.
- Use existing theme, Card, Button, Input, Picker, and icon patterns.
- Add image selection using expo-image-picker.
- Make the default demo path work on Expo web.
- Support subject modes: Dough, Starter, Crumb, Loaf.
- Prioritize Dough / bulk fermentation visually.
- Add optional context fields: stage, room temp, elapsed time, hydration, flour type, starter readiness, notes.
- Add loading, error, and empty states.
- Do not call Gemini directly from the client.
- Call POST /api/photo-rescue/analyze through the app API service.

Use mock result data only when backend is unavailable or returns fallback-required.

Reference visual direction:
- replit/photo-rescue-input.png
- replit/dough-diagnosis-result.png
```

## Prompt 5: Connect Real Gemini Result Screen

```text
Finish the Photo Rescue vertical slice.

Requirements:
- Convert selected image to base64 JSON.
- Send imageBase64, mimeType, and context to /api/photo-rescue/analyze.
- Render validated diagnosis result:
  - subject/stage
  - diagnosis
  - confidence label
  - summary
  - visual evidence
  - Do Now actions
  - Next Bake tips
  - risk/caution note
  - missing context questions for low confidence
- Add buttons:
  - Start Rescue Timer
  - Create Bake Plan
  - Answer Quick Check when fallback or low confidence
- Save recent diagnosis locally if cheap.
- If Gemini fails, clearly show Quick Rescue Mode, not a fake AI result.

Run the app and verify the complete browser demo path.
```

## Prompt 6: Implement Quick Rescue Fallback

```text
Implement Quick Rescue Mode.

Requirements:
- Trigger when Gemini is unavailable, key is missing, response validation fails, or user taps Answer Quick Check.
- Ask 4-6 simple questions.
- Use deterministic rules from replit/specs/ai-prompts.md.
- Return the same general result shape as Photo Rescue.
- Copy must say "Using quick rescue checklist."
- Do not imply image analysis happened in fallback mode.
- Add focused tests for the fallback rule engine.
```

## Prompt 7: Implement Bake Day Copilot

```text
Implement Bake Day Copilot.

Requirements:
- Add Bake Day Copilot to Tools and Home if straightforward.
- Required inputs:
  - target bake date/time
  - room temperature
  - starter readiness
  - schedule style
  - hydration
  - loaf count or dough size
- Default demo path: overnight cold proof.
- Generate deterministic timeline using replit/specs/technical-spec.md.
- Include feed starter, mix, folds, bulk check, shape, cold proof, preheat, bake, uncover, cool.
- Accept optional diagnosis context from Photo Rescue's Create Bake Plan button.
- Show fermentation risk, starter note, temperature note, and hydration note.
- Add focused tests for the timeline generator.

Reference visual direction:
- replit/bake-day-copilot.png
```

## Prompt 8: Add Optional Reminders

```text
Add optional local reminders for Bake Day Copilot.

Requirements:
- Use existing expo-notifications service patterns.
- Schedule reminders only if supported and permission is granted.
- Fail softly on web or permission denial.
- Timeline must still work without reminders.
- Show a visible unavailable/permission state.
- Do not make notifications a blocker for plan creation.
- Add a small test or platform guard for unsupported environments if practical.
```

## Prompt 9: Polish Demo And Submission State

```text
Polish the hackathon demo.

Requirements:
- Make the golden path obvious:
  1. Open Photo Rescue.
  2. Analyze dough photo.
  3. View likely diagnosis.
  4. Start rescue timer or create Bake Day Copilot plan.
  5. See overnight timeline.
- Add sample/demo state if no image is selected.
- Improve loading, empty, error, and fallback states.
- Ensure copy uses expert-coach beginner-friendly voice.
- Ensure confidence is low/medium/high only.
- Ensure no UI claims exact certainty.
- Ensure app remains usable without Gemini.
- Run tests and Expo web verification.

Do not spend time on unrelated refactors.
```

## Prompt 10: Final Verification

```text
Run final verification for the hackathon build.

Verify:
- Expo web starts in Replit.
- Health route returns ok.
- Photo Rescue can call real Gemini with GEMINI_API_KEY.
- Missing GEMINI_API_KEY triggers honest Quick Rescue fallback.
- Diagnosis result screen renders all required fields.
- Bake Day Copilot creates overnight cold proof timeline.
- Reminder toggle does not break web.
- Existing calculators still open.
- No auth gate blocks the demo.
- No API keys are committed.

Return:
- files changed
- commands run
- what passed
- known risks
- exact demo steps
```

## Cutline Reminder

If time gets tight, protect:

- real Gemini Photo Rescue route
- diagnosis result screen
- Quick Rescue fallback
- deterministic Bake Day Copilot
- browser-demoable sample path

Cut:

1. history browsing UI
2. Gemini coaching notes for Bake Day Copilot
3. actual notification scheduling
4. crumb/loaf modes
5. polished Home cards
6. saved plans
