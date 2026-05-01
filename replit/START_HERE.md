# SourdoughSuite Replit Handoff - Start Here

This is the front door for the Replit hackathon agent.

The mission is to build a browser-demoable SourdoughSuite experience with a polished UI/UX, a reliable Photo Rescue path, Bake Day Copilot, honest fallback behavior, and a simple landing page.

## Execution Mode

Operate in autonomous hackathon mode.

Do not pause for permission before routine edits, package installs, file creation, formatting, verification commands, screenshots, or commits inside the Replit workspace.

Only stop and ask Scott if:

- an action would delete existing work
- a required route or feature is impossible without a major product decision
- a secret or API key is missing and cannot be mocked safely
- the app cannot run due to an environment blocker that cannot be resolved
- implementing the requested change would require removing existing calculators, tabs, storage flows, or the Replit web path

Otherwise, make reasonable decisions from the docs and keep moving phase by phase.

## Product North Star

**Less app. More bakery.**

SourdoughSuite should feel like a premium baker's bench:

- warm cream/parchment backgrounds
- dark crust typography
- copper/gold primary actions
- real dough imagery where useful
- visual instruments instead of long generic forms
- Home as a command center
- calculators as result-first workbenches
- Photo Rescue and Bake Day Copilot matching the supplied mockups

## Golden Hackathon Path

Protect this path above everything else:

1. Open Home.
2. Start Photo Rescue.
3. Use sample dough photo or upload a dough photo.
4. Analyze the image.
5. Render Diagnosis Result.
6. Show visual evidence and Do Now actions.
7. Create Bake Plan.
8. Render Bake Day Copilot timeline.
9. Open the landing page for judges.

If Gemini fails or no API key is configured, Quick Rescue must keep the flow useful and honest.

Required fallback copy:

```text
Using quick rescue checklist
```

Do not imply fallback mode analyzed the image.

## First Prompt To Paste Into Replit Agent

```text
You are working on SourdoughSuite, an Expo / React Native sourdough companion app.

Read `replit/START_HERE.md` first, then follow the linked docs in order.

Operate in autonomous hackathon mode. Do not pause to ask for permission before routine edits, installs, file creation, formatting, verification commands, screenshots, or commits. Only stop for destructive actions, missing secrets that cannot be safely mocked, impossible routes/features, or environment blockers you cannot resolve.

Your mission:
1. Preserve the existing app.
2. Make the golden demo path work.
3. Redesign the UI/UX around "Less app. More bakery."
4. Keep Replit web demo compatibility.
5. Add or polish the selected Oven Light landing page direction.

Start with orientation only:
- summarize the current navigation
- summarize the current theme/components
- identify whether Photo Rescue exists and where
- identify whether Bake Day Copilot exists and where
- identify web/backend/env risks
- list your phase-by-phase execution order

After orientation, proceed without waiting unless you hit a stop condition.
```

## Reading Order

Read these first:

- `replit/START_HERE.md`
- `replit/specs/prd.md`
- `replit/specs/technical-spec.md`
- `replit/specs/ai-prompts.md`

Then UI/UX:

- `replit/specs/ui-ux-style-guide.md`
- `replit/specs/ui-ux-redesign-plan.md`
- `replit/specs/ui-ux-redesign-prompts.md`
- `replit/ui-ux-review-board.png`
- `replit/photo-rescue-input.png`
- `replit/dough-diagnosis-result.png`
- `replit/bake-day-copilot.png`

Then operations:

- `replit/specs/environment-checklist.md`
- `replit/specs/demo-runbook.md`
- `replit/specs/final-qa-checklist.md`
- `replit/specs/scope-cutline.md`

Then optional stretch:

- `replit/specs/bakers-log-addendum.md`

## Key Assets

- Photo Rescue mockup: `replit/photo-rescue-input.png`
- Diagnosis Result mockup: `replit/dough-diagnosis-result.png`
- Bake Day Copilot mockup: `replit/bake-day-copilot.png`
- UI/UX review board: `replit/ui-ux-review-board.png`
- Selected landing page HTML: `replit/landing-oven-light.html`
- Selected landing page PNG: `replit/landing-oven-light.png`

## Build Order

### 1. Orient

Inspect code before editing. Find:

- navigation routes
- Home and Tools entry points
- existing API service pattern
- backend/server files if present
- current Photo Rescue files if present
- current Bake Day Copilot files if present
- existing tests
- Expo web command behavior

### 2. Protect Demo Safety

Add a sample/demo mode if it does not exist.

Required behavior:

- visible "Use sample dough photo" option
- sample path works without camera permissions
- missing Gemini key triggers Quick Rescue
- fallback result is useful, not a dead end

### 3. Backend And API

Follow `replit/specs/technical-spec.md`.

Required:

- health route
- Photo Rescue analyze route
- backend reads `GEMINI_API_KEY`
- no raw Gemini errors shown to users
- client does not call Gemini directly

### 4. Photo Rescue

Implement or polish:

- Photo Rescue input
- image selection and sample image path
- context controls
- loading and error states
- diagnosis rendering
- Quick Rescue fallback

### 5. Bake Day Copilot

Implement or polish:

- deterministic timeline
- diagnosis handoff from Photo Rescue
- overnight cold proof default path
- reminder toggle that fails softly on web

### 6. UI/UX Refresh

Follow `replit/specs/ui-ux-redesign-plan.md`.

Protect:

- Home command center
- Photo Rescue visual quality
- Diagnosis Result visual quality
- Bake Day Copilot visual quality
- at least one result-first calculator pattern

### 7. Landing Page

The selected direction is Oven Light:

- `replit/landing-oven-light.html`
- `replit/landing-oven-light.png`

After the app golden path works, adapt this into the app's static website, usually `docs/index.html`, or keep it as the judge-facing landing page if time is tight.

Do not spend landing-page time before the app demo path works.

### 8. Final QA

Run `replit/specs/final-qa-checklist.md`.

Return:

- files changed
- commands run
- what passed
- what failed
- known risks
- exact demo steps

## Never Do These

- do not rebuild the app from scratch
- do not add auth
- do not add subscriptions
- do not add a new bottom tab
- do not remove existing calculators
- do not hardcode API keys
- do not call Gemini from the client
- do not make notifications required for the demo
- do not claim exact diagnosis certainty from an image
- do not show confidence percentages

## Confidence Language

Allowed:

- low confidence
- medium confidence
- high confidence

Not allowed:

- 87% confident
- definitely
- guaranteed diagnosis

## End State

The handoff is successful when a judge can:

1. Open the demo.
2. Understand the product in under 15 seconds.
3. Run a dough Photo Rescue.
4. See useful diagnosis evidence.
5. Create a bake timeline.
6. Understand that fallback mode is honest.
7. See a polished landing page that matches the app direction.
