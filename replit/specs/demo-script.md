# SourdoughSuite Hackathon Demo Script

## One-Line Pitch

SourdoughSuite helps home bakers rescue sourdough in real time: take a photo, get a likely diagnosis with visual evidence, then turn it into a practical rescue plan and bake-day schedule.

## Short Submission Description

SourdoughSuite is an artisan baking companion built around professional bread-baker decision making. For this hackathon, I added Photo Rescue and Bake Day Copilot. Photo Rescue uses Gemini vision through a Replit backend to analyze a starter, dough, crumb, or loaf photo and return a cautious diagnosis, visual evidence, immediate rescue steps, and next-bake improvements. Bake Day Copilot turns that diagnosis into a personalized timeline with fermentation checks, folds, shaping, cold proof, preheating, baking, cooling, and optional reminders.

The product is designed for the moment home bakers usually feel lost: the dough looks wrong, the clock is moving, and they need to know what to do next.

## 2-Minute Demo Flow

### 0:00-0:15 - Set The Problem

"I am a professional bread baker, and one of the most common things beginners ask is: does this dough look right? Sourdough recipes give times, but dough responds to temperature, starter strength, flour, hydration, and handling. So I built SourdoughSuite to help home bakers read what is in front of them."

### 0:15-0:35 - Open Photo Rescue

Open SourdoughSuite in the Replit web demo.

Tap Photo Rescue from Home or Tools.

Say:

"The golden path is bulk fermentation, because this is where most beginners get stuck and where a timely rescue can save the bake."

### 0:35-1:05 - Analyze Dough Photo

Select the sample dough image or upload a photo.

Choose:

- Subject: Dough
- Stage: Bulk fermentation
- Room temp: 72F
- Hydration: 78%
- Starter: strong

Tap Analyze.

Say:

"The image goes to a Replit backend, not directly from the client. The backend calls Gemini with a strict JSON schema, validates the response, then returns a normalized diagnosis."

### 1:05-1:30 - Show Diagnosis

Highlight:

- likely diagnosis
- confidence label
- visual evidence
- Do Now actions
- Next Bake tips
- risk note

Say:

"The app does not pretend to know with certainty. It says what is most likely, shows the visible evidence, and gives practical next steps. That is how a good baker coaches: clear, useful, and honest."

### 1:30-1:50 - Create Bake Plan

Tap Create Bake Plan.

Show Bake Day Copilot populated with overnight cold proof defaults.

Say:

"The diagnosis is not a dead-end result. It becomes action. Bake Day Copilot creates a deterministic schedule, so the times are predictable, while the diagnosis informs the coaching notes."

### 1:50-2:00 - Fallback Story

Say:

"If Gemini is unavailable, the app does not fake it. It switches to Quick Rescue Mode, a professional baker checklist that still gives useful guidance. That keeps the demo and the product reliable."

## 5-Minute Demo Flow

Use the 2-minute flow, then add:

1. Show Starter mode briefly.
2. Show Quick Rescue manually.
3. Toggle reminders on Bake Day Copilot.
4. Open an existing calculator to show the app foundation.
5. Mention saved local diagnoses/plans if implemented.

## Judge-Facing Talking Points

- The product solves a real, intuitive problem: home bakers cannot always interpret visual dough signals.
- The app is demoable in the browser through Replit.
- The AI is used where it has leverage: visual triage and structured guidance.
- Deterministic logic handles schedules so the model does not invent timing.
- The fallback is honest and useful.
- The app is grounded in professional bread-baker heuristics from actual teaching material.

## Technical Talking Points

- Expo / React Native frontend.
- Express backend in the same Replit project.
- Google AI Studio Gemini API with image input.
- Base64 JSON image upload for Expo web/mobile simplicity.
- Gemini structured JSON output with backend validation.
- AsyncStorage for recent local records.
- Expo notifications for optional local reminders where supported.
- No client-side API key exposure.

## Fallback Explanation

Use this if asked why fallback exists:

"A live AI call should enhance the product, not make it fragile. If Gemini is unavailable, SourdoughSuite switches to Quick Rescue Mode and clearly labels it as a checklist. That preserves trust and lets the baker keep moving."

## Exact Demo Inputs

Photo Rescue:

- subject: Dough
- stage: Bulk fermentation
- room temperature: 72F
- elapsed time: 3.5 hours
- hydration: 78%
- flour type: Bread flour
- starter readiness: Strong
- notes: Dough is glossy and spreading more than expected.

Bake Day Copilot:

- target bake: Tomorrow 9:00 AM
- room temperature: 70F
- starter readiness: Strong
- schedule style: Overnight cold proof
- hydration: 75%
- loaves: 1
- reminders: On if available

## Submission Copy

```text
SourdoughSuite is an artisan baking companion for home bakers. For the Replit hackathon, I added Photo Rescue and Bake Day Copilot.

Photo Rescue uses Gemini vision through a Replit backend to analyze a photo of dough, starter, crumb, or loaf. It returns a likely diagnosis, confidence label, visual evidence, immediate rescue actions, next-bake prevention tips, and a caution note. The feature is intentionally honest: it does not claim certainty from a photo, and if Gemini is unavailable it switches to a clearly labeled Quick Rescue checklist.

Bake Day Copilot turns that diagnosis into a practical schedule. It uses deterministic timeline logic for starter feeding, mixing, folds, bulk checks, shaping, cold proofing, preheating, baking, and cooling, with optional reminders when supported.

As a professional bread baker, I built the app around the real heuristics I use when students show me their dough: rise percentage, bubbles, surface tension, poke response, starter readiness, crumb structure, and oven spring clues. The result is a friendly AI-assisted coach for the moment when a home baker needs help most.
```

## Backup Demo If Gemini Fails

1. Open Photo Rescue.
2. Select Dough.
3. Trigger or show Quick Rescue Mode.
4. Answer:
   - stage: bulk
   - room temp: 72F
   - elapsed: 3.5 hours
   - signs: glossy, slack, spreading, few tension lines
   - hydration: 78%
5. Show rule-based likely diagnosis.
6. Tap Create Bake Plan.
7. Show overnight timeline.

Narration:

"This is the reliability layer. The AI route is real, but the app still helps when a network call or API key fails."
