# SourdoughSuite Hackathon Scope Cutline

Use this when time gets tight. The product should feel complete on one golden path instead of broad and unfinished.

## Product Thesis

Protect the story:

> Rescue your sourdough in real time, then turn the rescue into a bake plan.

Everything else is secondary.

## Must Ship

These are non-negotiable for the hackathon demo.

1. Home entry point
   - command-center feel
   - clear Photo Rescue entry
   - clear Bake Day Copilot/timeline entry

2. Photo Rescue input
   - sample dough photo path
   - upload path if browser supports it
   - context fields/chips
   - Analyze button

3. Diagnosis Result
   - diagnosis title
   - confidence label: low, medium, or high
   - visual evidence
   - Do Now actions
   - Next Bake tips
   - caution/risk note

4. Quick Rescue fallback
   - triggers on missing key/API failure
   - says `Using quick rescue checklist`
   - does not pretend image analysis happened
   - returns useful guidance

5. Bake Day Copilot
   - deterministic timeline
   - accepts diagnosis context
   - overnight cold proof default path
   - web-safe reminder behavior

6. Replit web demo
   - app starts
   - golden path works
   - no auth gates
   - no required native-only flow

7. Landing page
   - selected Oven Light direction exists
   - judge can open it
   - demo CTA can be updated

## Should Ship

Do these after Must Ship is stable.

1. UI/UX redesign foundation
   - warm semantic colors
   - shared cards/buttons/inputs
   - stronger typography hierarchy

2. Tools hub grouping
   - Plan
   - Formula
   - Rescue
   - Build

3. Baker's Percentage result-first redesign
   - visual formula preview
   - inline validation
   - save as recipe preserved

4. Starter cards
   - health
   - next feeding
   - overdue state

5. Recipe cards
   - hydration
   - total weight
   - yield
   - starter badge

## Nice To Ship

Only do these if the golden path has been run successfully several times.

1. Baker's Log
   - save diagnosis
   - save bake plan
   - add outcome

2. Learn/Profile polish

3. Extra calculator redesigns beyond Baker's Percentage and Timeline

4. Local notification scheduling beyond fail-soft toggle

5. AI reflection on a completed bake

## Cut First

Cut these immediately if behind schedule:

1. Profile polish.
2. Learn polish.
3. Baker's Log.
4. Secondary calculator polish.
5. Actual notification scheduling.
6. Crumb/loaf/starter advanced mode polish.
7. Animation polish.
8. Additional generated visual assets.

## Do Not Cut

Do not cut these, even if the implementation is simple:

- sample dough photo path
- Quick Rescue fallback
- Create Bake Plan handoff
- deterministic timeline
- clear confidence language
- web compatibility

## Decision Rules

When choosing between two tasks:

- choose demo reliability over visual flourish
- choose one polished path over many partial paths
- choose deterministic fallback over fragile AI-only behavior
- choose existing components over new dependencies
- choose Expo web compatibility over native-only polish

## Minimum Winning Demo

If there are only 30 minutes left, ship this:

1. Home has a clear Photo Rescue button.
2. Photo Rescue can load sample dough photo.
3. Diagnosis Result can render either Gemini or mock/fallback result.
4. Result has Create Bake Plan.
5. Bake Day Copilot shows an overnight timeline.
6. Landing page opens and explains the product.

That is enough to tell the story.
