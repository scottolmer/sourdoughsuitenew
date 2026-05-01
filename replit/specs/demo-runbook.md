# SourdoughSuite Hackathon Demo Runbook

Use this during final prep and judging. The demo should feel calm, visual, and inevitable.

## Core Story

Home bakers fail in the messy middle of sourdough. The dough looks wrong, the starter may be off, and timing gets fuzzy.

SourdoughSuite helps at that exact moment:

1. Photograph the dough.
2. Understand what the app sees.
3. Get practical rescue steps.
4. Turn the diagnosis into a bake-day plan.

## 90-Second Pitch

```text
Sourdough is hard because the most important decisions happen before the bread is baked.

Home bakers stare at sticky dough or a sluggish starter and ask: is this underfermented, overfermented, weak gluten, or just high hydration?

SourdoughSuite turns that uncertainty into a guided workflow.

I can open Photo Rescue, use a sample dough photo or upload my own, add a little context, and get a practical diagnosis. The app shows what it sees, gives immediate Do Now actions, and keeps confidence honest.

Then I can turn that result into Bake Day Copilot, which creates a deterministic timeline for the rest of the bake.

If the AI route is unavailable, Quick Rescue still works as an honest checklist, so the demo and the product do not collapse.

The goal is simple: rescue your sourdough in real time, then learn from the bake.
```

## Golden Demo Click Path

1. Open the Replit web preview.
2. Start on Home.
3. Point out the command-center UI.
4. Click Photo Rescue.
5. Click `Use sample dough photo`.
6. Confirm subject is `Dough`.
7. Confirm context:
   - stage: bulk ferment
   - room: 72F
   - hydration: 78%
8. Click Analyze.
9. Show Diagnosis Result:
   - diagnosis title
   - confidence label
   - visual evidence
   - Do Now actions
   - Next Bake tips
10. Click Create Bake Plan.
11. Show Bake Day Copilot:
   - bake-by time
   - room temperature
   - starter strength
   - hydration
   - vertical timeline
   - reminder toggle/fail-soft state
12. Open the landing page:
   - `replit/landing-oven-light.html`
   - or the deployed/static page if it has been copied into `docs/index.html`

## If Gemini Works

Say:

```text
This is the real Gemini-backed path. The backend receives the image and context, validates the structured response, and the app renders it as baker guidance.
```

Show:

- health route if useful
- diagnosis source as Gemini if visible
- confidence label
- no exact percentages

## If Gemini Fails Or The Key Is Missing

Do not apologize for the fallback. Frame it as product resilience.

Say:

```text
For hackathon reliability, SourdoughSuite has an honest Quick Rescue mode. If the AI route is unavailable, it does not fake an image diagnosis. It switches to a deterministic checklist and still gives useful next steps.
```

Required UI copy:

```text
Using quick rescue checklist
```

Show:

- fallback trigger
- checklist questions
- resulting guidance
- Create Bake Plan still works

## Judge Questions And Short Answers

### What makes this different from a chatbot?

```text
It is a workflow, not a chat box. The app combines image/context input, structured diagnosis, immediate rescue actions, and deterministic bake scheduling.
```

### Why deterministic scheduling?

```text
Bread timing has constraints. AI can help explain, but impossible schedules should not be invented. The timeline math is deterministic so the plan stays plausible.
```

### What happens without the API key?

```text
The app falls back to Quick Rescue and says so clearly. The user still gets safe, practical guidance.
```

### Why sourdough?

```text
Sourdough is visual, time-sensitive, and full of ambiguous signals. It is exactly the kind of craft where guided interpretation helps.
```

## Demo Reset Checklist

Before every run:

- reload web preview
- confirm backend is running
- confirm `GEMINI_API_KEY` is configured if demonstrating real AI
- confirm sample image path works
- clear local state only if it gets in the way
- confirm Home -> Photo Rescue route works
- confirm Create Bake Plan route works

## Screenshot List

Capture these for submission:

1. Home command center.
2. Photo Rescue input with sample dough photo.
3. Diagnosis Result.
4. Bake Day Copilot timeline.
5. Oven Light landing page.

## Screen Recording Flow

Ideal video length: 45-75 seconds.

Recording steps:

1. Home screen.
2. Open Photo Rescue.
3. Use sample dough photo.
4. Analyze.
5. Show diagnosis evidence and Do Now.
6. Create Bake Plan.
7. Show timeline.
8. End on landing page or Home.

## Final Submission Blurb

```text
SourdoughSuite helps home bakers rescue sourdough in real time. Photograph your starter, dough, crumb, or loaf, get a practical diagnosis with visible evidence, then turn that result into a bake-day timeline.
```
