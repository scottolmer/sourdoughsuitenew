# SourdoughSuite Modernist Formula Cards Handoff

Use this file when the hackathon build should follow the Modernist Formula Cards direction instead of the older warm baker's bench direction.

The mission is to make SourdoughSuite feel like a premium culinary-science app: precise, editorial, data-rich, and easy to demo in Replit.

## Visual North Star

**A Modernist Bread-inspired formula system for mobile.**

The app should feel like:

- a technical recipe card
- a baker's percentage worksheet
- a fermentation lab notebook
- a clean cookbook page adapted to a phone

It should not feel like:

- a tan and golden bakery app
- a generic white-card dashboard
- a cozy recipe blog
- a stock-photo food app
- a SaaS control panel with bread words

## Required Reading

Read these files before editing:

- `replit/specs/modernist-formula-cards-style-guide.md`
- `replit/specs/modernist-redesign-plan.md`
- `replit/specs/modernist-replit-prompts.md`
- `replit/modernist-design-options.png`
- `replit/modernist-screen-system.png`
- `replit/START_HERE.md`
- `replit/specs/prd.md`
- `replit/specs/technical-spec.md`
- `replit/specs/ai-prompts.md`
- `replit/specs/final-qa-checklist.md`

The older files below are still useful for product scope and hackathon flow, but their warm parchment/copper visual direction is superseded by the Modernist docs:

- `replit/specs/ui-ux-style-guide.md`
- `replit/specs/ui-ux-redesign-plan.md`
- `replit/specs/ui-ux-redesign-prompts.md`

## Golden Demo Path

Protect the hackathon path:

1. Open Home.
2. Start Photo Rescue.
3. Use sample dough photo or upload a dough photo.
4. Analyze the image.
5. Render Diagnosis Result.
6. Show visual evidence and Do Now actions.
7. Create Bake Plan.
8. Render Bake Day Copilot timeline.
9. Open the judge-facing landing page if requested.

If Gemini fails or no API key is configured, Quick Rescue must keep the flow useful and honest.

Required fallback copy:

```text
Using quick rescue checklist
```

Do not imply fallback mode analyzed the image.

## First Prompt To Paste Into Replit Agent

```text
You are working on SourdoughSuite, an Expo / React Native sourdough companion app.

Use the Modernist Formula Cards direction as the visual source of truth. Read `replit/MODERNIST_START_HERE.md` first, then read the linked Modernist docs and visual references.

Operate in autonomous hackathon mode. Do not pause for routine edits, installs, file creation, formatting, verification commands, screenshots, or commits. Stop only for destructive actions, missing secrets that cannot be safely mocked, impossible routes/features, or environment blockers you cannot resolve.

Your mission:
1. Preserve the existing app and golden demo path.
2. Redesign the UI around Modernist Formula Cards.
3. Keep Replit web demo compatibility.
4. Make Home, Recipes, Recipe Detail, Starter Detail, Baker's Calculator, Photo Rescue, and Bake Day Copilot feel like one precise editorial system.
5. Keep fallback behavior honest.

Start with orientation only:
- summarize current navigation
- summarize current theme/components
- identify current Photo Rescue and Bake Day Copilot files if they exist
- list the safest files to modify first
- list risks to Expo web
- give the exact implementation order

After orientation, proceed through `replit/specs/modernist-replit-prompts.md` unless you hit a stop condition.
```

## Non-Negotiables

- Do not rebuild the app from scratch.
- Do not remove existing calculators.
- Do not add a large UI kit.
- Do not add a new bottom tab.
- Do not hardcode API keys.
- Do not call Gemini from the client.
- Do not add auth gates to the demo path.
- Do not make Expo web depend on native-only behavior.
- Do not make the UI mostly tan, cream, gold, or brown.

## Completion Bar

The Modernist direction is successful when:

- Home looks like a compact command sheet, not a menu.
- Recipes scan like formula index cards.
- Recipe detail has a real ingredient formula table.
- Calculators show results first and inputs as ruled rows.
- Starter screens show state and feeding history as facts and tables.
- Photo Rescue and Bake Day Copilot use the same rule/table/timeline language.
- The UI still works on a phone, with no dense desktop-only layouts.
