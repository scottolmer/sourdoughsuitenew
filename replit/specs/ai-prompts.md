# SourdoughSuite AI Prompts And Schemas

## Provider

Use Google AI Studio Gemini API.

Backend environment:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`, defaulting to a fast multimodal Gemini model available in Google AI Studio.

The client must never call Gemini directly.

Official references:

- Gemini image understanding: https://ai.google.dev/gemini-api/docs/image-understanding
- Gemini structured outputs: https://ai.google.dev/gemini-api/docs/structured-output

## Gemini System Instruction

Use this as the system instruction or top-level prompt context:

```text
You are Photo Rescue, an expert sourdough triage assistant inside SourdoughSuite.

You are assisting a professional bread baker by reading visual clues from a user's sourdough photo and optional context. Your job is not to claim certainty. Your job is to provide cautious, practical, beginner-friendly visual triage.

Use the language of an expert coach:
- Say "likely", "most likely", or "I would check" when evidence is incomplete.
- Explain the visible evidence behind the diagnosis.
- Give safe immediate next steps.
- Give next-bake prevention tips.
- Ask for missing context when confidence is low.

Do not:
- Claim exact certainty from the image alone.
- Invent exact times or temperatures when context is missing.
- Shame the baker.
- Call the bake a failure.
- Recommend discarding dough unless there is clear visible mold, spoilage, or food-safety risk.
- Give medical or food-safety guarantees.

Professional sourdough heuristics:
- Ready starter: doubled or nearly doubled, domed top, lots of bubbles, airy, fresh tangy smell, floats easily.
- Sluggish starter: little rise, dense, few bubbles, sinks, needs feeding.
- Hungry starter: hooch, strong sour smell, acetone smell, peaked and collapsed.
- Underfermented bulk: 25-30% rise, dense, few bubbles, little jiggle, fast poke spring-back.
- Ready bulk: 50-75% rise, domed, bubbles throughout, jiggle, slow spring-back with slight indent.
- Overfermented bulk: flat/collapsed top, large irregular bubbles, shiny or wet surface, possible liquid pooling, little or no spring-back.
- Weak gluten: tears easily, slack spread, no tension lines, poor shape holding.
- High hydration: sticky and extensible; use wet hands, gentle coil folds, and avoid adding lots of flour late.
- Poor shaping: uneven crumb, large trapped holes, flat spread, weak surface tension.
- Dense/gummy crumb: often underfermentation, weak starter, underdeveloped gluten, underbaking, or whole grain needing more hydration.
- Huge holes plus dense zones: often shaping, trapped air, overfermentation, uneven folds, or rough handling.
- Flat loaf/no oven spring: often overfermentation, weak surface tension, too-wet dough, weak starter, or overly deep scoring.

Return only JSON matching the provided schema.
```

## User Prompt Template

```text
Analyze this sourdough photo.

Context:
- Subject: {{subject}}
- Stage: {{stage}}
- Room temperature: {{roomTempF}}F
- Time since mixing/feeding: {{elapsedMinutes}} minutes
- Hydration: {{hydrationPercent}}%
- Flour type: {{flourType}}
- Starter readiness: {{starterReadiness}}
- User notes: {{notes}}

Focus on the user's selected subject. If the selected subject is dough, prioritize bulk fermentation, gluten development, hydration, and shaping readiness. If the selected subject is starter, prioritize activity, hunger, hooch, mold/spoilage warning signs, and feeding readiness. If the selected subject is crumb, prioritize fermentation, shaping, proofing, baking, and gluten clues. If the selected subject is loaf, prioritize oven spring, spread, crust, scoring, steam, and bake completion clues.

Give a likely diagnosis, confidence label, visual evidence, do-now actions, next-bake prevention tips, and risk/caution note.
```

## Gemini JSON Schema

Use this schema with Gemini structured output.

```json
{
  "type": "object",
  "properties": {
    "subject": {
      "type": "string",
      "enum": ["dough", "starter", "crumb", "loaf"]
    },
    "stage": {
      "type": "string"
    },
    "diagnosis": {
      "type": "string"
    },
    "confidence": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "summary": {
      "type": "string"
    },
    "visualEvidence": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2,
      "maxItems": 5
    },
    "doNow": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "details": { "type": "string" },
          "minutesFromNow": { "type": "integer" }
        },
        "required": ["title", "details"]
      },
      "minItems": 2,
      "maxItems": 5
    },
    "nextBake": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2,
      "maxItems": 5
    },
    "risk": {
      "type": "string"
    },
    "missingContextQuestions": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 4
    },
    "bakePlanSeed": {
      "type": "object",
      "properties": {
        "suggestedStyle": {
          "type": "string",
          "enum": ["same-day", "overnight-cold-proof"]
        },
        "adjustments": {
          "type": "array",
          "items": { "type": "string" },
          "maxItems": 4
        }
      },
      "required": ["suggestedStyle", "adjustments"]
    }
  },
  "required": [
    "subject",
    "diagnosis",
    "confidence",
    "summary",
    "visualEvidence",
    "doNow",
    "nextBake",
    "risk",
    "missingContextQuestions"
  ]
}
```

## Example Diagnosis JSON

```json
{
  "subject": "dough",
  "stage": "bulk",
  "diagnosis": "Likely underdeveloped gluten with high hydration",
  "confidence": "medium",
  "summary": "The dough looks glossy and slack, with limited surface tension for this stage.",
  "visualEvidence": [
    "Glossy wet surface",
    "Dough is spreading instead of holding a rounded shape",
    "Few visible tension lines"
  ],
  "doNow": [
    {
      "title": "Rest 20 minutes",
      "details": "Let the flour hydrate and the dough relax before handling again.",
      "minutesFromNow": 20
    },
    {
      "title": "Coil fold twice",
      "details": "Use wet hands and do two gentle coil folds spaced 30 minutes apart.",
      "minutesFromNow": 30
    },
    {
      "title": "Avoid extra flour",
      "details": "Adding flour late can make the loaf dense. Use wet hands instead."
    }
  ],
  "nextBake": [
    "Lower hydration by 3-5 percentage points.",
    "Add one more fold in the first half of bulk.",
    "Track dough temperature and check bulk earlier."
  ],
  "risk": "Do not mix aggressively at this stage because the gluten network may tear.",
  "missingContextQuestions": [
    "How much has the dough risen since mixing?",
    "Does the dough jiggle when you move the bowl?"
  ],
  "bakePlanSeed": {
    "suggestedStyle": "overnight-cold-proof",
    "adjustments": [
      "Add two coil folds before shaping.",
      "Use a conservative bulk check before final shaping."
    ]
  }
}
```

## Backend Call Shape With `@google/genai`

This is implementation guidance, not required exact code.

```ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
  contents: [
    {
      inlineData: {
        mimeType: request.mimeType,
        data: request.imageBase64
      }
    },
    {
      text: userPrompt
    }
  ],
  config: {
    responseMimeType: 'application/json',
    responseJsonSchema: photoRescueSchema
  }
});

const parsed = JSON.parse(response.text || '{}');
```

## Quick Rescue Rules

Quick Rescue is rule-based and honest. It should display "Using quick rescue checklist."

### Dough

- Dense, few bubbles, less than 40% rise: likely underfermented. Do now: wait 45-60 minutes, recheck rise and jiggle.
- Slack, shiny, collapsed, huge bubbles: likely overfermented. Do now: shape gently, cold proof shorter, bake as a pan loaf if too slack.
- Glossy, spreading, high hydration, few tension lines: likely weak gluten/high hydration. Do now: rest, coil fold, use wet hands.
- Tight, tears easily, fast spring-back: not relaxed enough. Do now: rest 20 minutes and continue bulk.

### Starter

- Doubled, domed, bubbly: ready to use.
- Flat, few bubbles, dense: feed and wait for peak.
- Hooch or acetone: hungry; feed, possibly use larger ratio.
- Mold: discard and restart.

### Crumb

- Dense/gummy throughout: likely underfermented, weak starter, underbaked, or underdeveloped gluten.
- Huge holes plus dense bottom: likely shaping issue, trapped air, or overfermentation.
- Tight uniform crumb: likely severe underfermentation or weak starter.

### Loaf

- Flat, wide, no oven spring: likely overfermented or weak surface tension.
- Pale crust: preheat longer, bake uncovered longer, use covered steam phase.
- Burnt crust/raw center: lower oven temperature and bake longer.
- Blowout: check proofing, scoring angle, blade sharpness, and surface tension.
