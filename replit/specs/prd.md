# SourdoughSuite Hackathon PRD

## Product Summary

SourdoughSuite is an artisan baking companion for home bakers. For the Replit hackathon, the app adds two connected features:

1. Photo Rescue
2. Bake Day Copilot

The core story is simple: a baker is stuck in the messy middle of sourdough. They take or upload a photo, get a likely diagnosis based on visible clues, then turn that diagnosis into immediate rescue steps and a personalized bake-day timeline.

The product voice is expert coach with beginner-friendly delivery. The app should feel grounded in professional bread-baker judgment, but never intimidating or overly clinical.

## Goals

- Create a browser-demoable Replit experience first, while preserving Expo Go compatibility.
- Build a real Gemini-powered Photo Rescue vertical slice.
- Keep the app usable if Gemini fails through an honest Quick Rescue fallback.
- Connect Photo Rescue to Bake Day Copilot so the demo feels like one product, not two isolated tools.
- Preserve the existing SourdoughSuite navigation, theme, components, calculators, starter tools, recipes, and profile areas.

## Non-Goals

- Do not rebuild the app from scratch.
- Do not add auth gates.
- Do not call Gemini from the client.
- Do not hardcode API keys.
- Do not require EAS, custom native modules, or native-only dependencies.
- Do not remove existing calculators or screens.
- Do not claim exact diagnosis certainty from a photo.
- Do not make the app unusable without Gemini.

## Primary Audience

Home sourdough bakers who know something is wrong but do not know what to do next.

Secondary audiences:

- Beginner bakers learning to read starter and dough signals.
- Intermediate bakers trying to improve consistency.
- Hackathon judges evaluating whether the product solves a clear problem quickly.

## Positioning

SourdoughSuite turns professional baker triage into a friendly home-baking companion. The AI does not replace expertise; it helps deliver practical, cautious, baker-tested guidance at the moment a user needs it.

Suggested submission line:

> SourdoughSuite helps home bakers rescue sourdough in real time. Photograph your starter, dough, crumb, or loaf, get a likely diagnosis with visual evidence, then turn it into a rescue plan and bake-day schedule.

## Feature 1: Photo Rescue

### Scope

Photo Rescue lets the user analyze a baking photo with Gemini and receive a structured, practical diagnosis.

Supported v1 modes:

- Dough
- Starter
- Crumb
- Loaf

Golden path:

- Dough during bulk fermentation.

Shaped dough is handled as a Dough stage, not a separate top-level mode.

### User Flow

1. User opens Photo Rescue from Home or Tools.
2. User chooses or captures a photo.
3. User chooses subject: Dough, Starter, Crumb, or Loaf.
4. User optionally adds quick context:
   - stage
   - room temperature
   - time since mixing or feeding
   - hydration
   - flour type
   - starter readiness
5. User taps Analyze.
6. App sends image and context to the Replit backend.
7. Backend calls Gemini using the Google AI Studio API.
8. Backend validates and normalizes the response.
9. App renders a diagnosis result.
10. User can start a rescue timer or create a Bake Day Copilot plan.

### Result Requirements

Each diagnosis must include:

- subject
- stage
- diagnosis title
- confidence label: low, medium, or high
- visual evidence
- immediate "Do Now" actions
- "Next Bake" prevention tips
- risk or caution note
- optional missing context questions
- optional suggested rescue timer
- optional Bake Day Copilot handoff context

Confidence must be label-based only. Do not show percentages.

### Low Confidence Behavior

Low confidence is not a dead end. The result should:

- soften language with "I would check..." or "Most likely..."
- explain uncertainty
- provide safe immediate actions
- ask for missing context
- offer "Answer Quick Check"
- offer "Create Conservative Plan"

### Quick Rescue Fallback

If Gemini fails, no API key is configured, or the response cannot be validated, the app must switch to Quick Rescue Mode.

This fallback must be honest. It should say "Using quick rescue checklist" rather than pretending the image was analyzed.

Quick Rescue asks 4-6 questions and returns rule-based guidance using the same output shape where practical.

Example questions:

- What are you checking? Dough, Starter, Crumb, or Loaf.
- What stage are you in?
- How long has it been fermenting or since feeding?
- What is the room temperature?
- What do you see? Dense, bubbly, slack, shiny, collapsed, hooch, tight crumb, huge holes, flat loaf.
- What is hydration, if known?

## Feature 2: Bake Day Copilot

### Scope

Bake Day Copilot generates a deterministic bake timeline using user inputs and optional Photo Rescue context.

Default demo path:

- Overnight cold proof.

Same-day bake can exist as an option, but overnight cold proof should be the polished sample flow.

### Required Inputs

- target bake date and time
- room temperature
- starter readiness: weak, okay, strong
- schedule style: same-day or overnight cold proof
- hydration
- dough size or number of loaves

### Optional Inputs

- flour type
- starter percentage / inoculation
- diagnosis context from Photo Rescue
- reminder toggle

### Outputs

- personalized timeline
- fermentation risk level
- temperature adjustment notes
- starter readiness guidance
- stretch-and-fold or coil-fold schedule
- shaping and proofing plan
- preheat and bake steps
- cooling reminder
- optional local notifications

### Planning Approach

Schedule math must be deterministic. Gemini may optionally provide coaching notes, but it must not invent impossible times.

Core rule:

- Use predictable timeline logic for all steps.
- Use Gemini only for plain-English guidance if time allows.

### Reminder Behavior

Reminders are optional and fail-soft.

If local notifications are available and permission is granted, schedule reminders for key steps. If running on web or permission is denied, still create the plan and show "Reminders unavailable here" or similar copy.

## Professional Baker Heuristics

The app should use these distilled heuristics from `Sourdough_101.txt`.

### Starter Readiness

- Ready starter: doubled or nearly doubled, domed top, lots of bubbles, airy look, fresh tangy smell, floats easily.
- Sluggish starter: little rise, dense, few bubbles, may sink, needs feeding.
- Hungry starter: hooch, strong sour smell, acetone/nail-polish smell, peaked and collapsed.
- Mold is a safety stop: recommend discarding and restarting.

### Bulk Fermentation

- Underfermented: 25-30% rise, dense, few bubbles, little jiggle, fast poke spring-back.
- Ready: 50-75% rise, domed, bubbles throughout, visible jiggle, slow spring-back with slight indent.
- Overfermented: flat or collapsed top, large irregular bubbles, shiny/wet surface, possible liquid pooling, little or no spring-back.

### Gluten And Hydration

- Weak gluten: tears easily, little elasticity, slack spread, no tension lines.
- High hydration: sticky and extensible, needs wet hands and gentle handling, may need coil folds.
- Underdeveloped dough can look slack even before fermentation is complete.

### Shaping And Surface Tension

- Good shaping creates visible tension and helps oven spring.
- Poor surface tension causes flat spread, uneven crumb, and poor scoring control.
- Trapped large air pockets can create huge holes plus dense zones.

### Crumb Diagnosis

- Dense/gummy crumb: commonly underfermented, weak starter, underdeveloped gluten, underbaked, or too much whole grain without hydration adjustment.
- Huge holes plus dense areas: often shaping, trapped air, overfermentation, uneven folds, or rough handling.
- Very tight uniform crumb: usually severe underfermentation or weak starter.

### Loaf, Crust, And Scoring

- Flat loaf/no oven spring: overfermented, poor surface tension, too-wet dough, weak starter, or score too deep.
- Pale crust: oven not hot enough, short preheat, insufficient steam, pulled early, or overfermented dough with fewer sugars left.
- Burnt crust/raw center: oven too hot; lower temperature or extend slower bake.
- Ragged blowout: overproofing, dull blade, wrong angle, shallow score, or weak surface tension.
- No ear: scoring angle too vertical, overproofed dough, insufficient steam, shallow score.

## Success Metrics

For hackathon judging:

- User can complete Photo Rescue in under 60 seconds.
- Gemini route returns validated diagnosis JSON.
- If Gemini fails, Quick Rescue still produces useful guidance.
- Bake Day Copilot creates a plausible overnight schedule in under 30 seconds.
- The demo clearly shows the connection from diagnosis to rescue plan.
- The app runs in Replit web demo without account setup.

## MVP Cutline

Protect these:

- Photo Rescue input
- real Gemini backend route
- diagnosis result screen
- Quick Rescue fallback
- deterministic Bake Day Copilot timeline
- demo sample image path

Cut in this order if time gets tight:

1. local history browsing UI
2. Gemini coaching note for Bake Day Copilot
3. actual notification scheduling, keeping visible reminder toggle/state
4. crumb/loaf secondary modes, keeping Dough and Starter
5. polished Home cards, keeping Tools entry
6. saved plans
