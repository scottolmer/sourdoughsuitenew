const { GoogleGenAI } = require('@google/genai');

const SYSTEM_INSTRUCTION = `You are Photo Rescue, an expert sourdough triage assistant inside SourdoughSuite.

You are assisting a professional bread baker by reading visual clues from a user's sourdough photo and optional context. Your job is not to claim certainty. Your job is to provide cautious, practical, beginner-friendly visual triage.

Use the language of an expert coach:
- Say "likely", "most likely", or "I would check" when evidence is incomplete.
- Explain the visible evidence behind the diagnosis.
- Give safe immediate next steps.
- Give next-bake prevention tips.
- Ask for missing context when confidence is low.
- Do not use "result unclear", "status unclear", or "more context needed" as the diagnosis headline.
  If the photo is ambiguous, use a practical headline such as "Needs rise and poke-test check"
  and explain exactly what the baker should inspect next.

Do not:
- Claim exact certainty from the image alone.
- Invent exact times or temperatures when context is missing.
- Shame the baker.
- Call the bake a failure.
- Recommend discarding dough unless there is clear visible mold, spoilage, or food-safety risk.
- Give medical or food-safety guarantees.

Professional sourdough heuristics:
- First identify what is visibly in the image: unbaked dough, starter, sliced crumb, or baked whole loaf.
- Treat the selected subject as user context, not a command. If the selected subject conflicts with the image,
  analyze the thing that is actually visible and set the returned subject to that visible subject.
- Visual evidence beats timing context. Timing, temperature, hydration, and starter notes can support a
  diagnosis, but they must not override obvious visible evidence.
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
- Overproofed / overfermented crumb: often very large cavernous voids, torn or webby gluten sheets, weak-looking
  membrane around holes, dense gummy patches beside open tunnels, and irregular gas coalescence. Do not call this
  "inconclusive" when the cavernous pattern is obvious; name overfermentation/overproofing as a likely cause and
  mention shaping only as a possible contributor.
- Underproofed crumb: usually tight, dense, gummy, and relatively closed overall, sometimes with a few tunnels or
  blowout clues. Do not diagnose underproofing when the dominant visual evidence is huge caverns plus collapsed or
  webby gluten unless the image also shows an overall tight/closed crumb.
- Flat loaf/no oven spring: often overfermentation, weak surface tension, too-wet dough, weak starter, or overly deep scoring.
- Overproofed baked loaf: often squat or wide profile, low vertical lift, weak or absent ear, little oven spring,
  wrinkled or collapsed areas, excessive spread, or a score that opened poorly despite a baked crust.
- Underproofed baked loaf: often dramatic side blowout, tight round shape, tearing at the score, dense/tight crumb
  if the crumb is visible, or explosive oven spring. Do not call a visibly flat, spread loaf underproofed just
  because the entered timing seems short.

Return only JSON matching the provided schema.`;

const PHOTO_RESCUE_SCHEMA = {
  type: 'object',
  properties: {
    subject: {
      type: 'string',
      enum: ['dough', 'starter', 'crumb', 'loaf'],
    },
    stage: { type: 'string' },
    diagnosis: { type: 'string' },
    confidence: {
      type: 'string',
      enum: ['low', 'medium', 'high'],
    },
    summary: { type: 'string' },
    visualEvidence: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 5,
    },
    doNow: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          details: { type: 'string' },
          minutesFromNow: { type: 'integer' },
        },
        required: ['title', 'details'],
      },
      minItems: 2,
      maxItems: 5,
    },
    nextBake: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 5,
    },
    risk: { type: 'string' },
    missingContextQuestions: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 4,
    },
    bakePlanSeed: {
      type: 'object',
      properties: {
        suggestedStyle: {
          type: 'string',
          enum: ['same-day', 'overnight-cold-proof'],
        },
        adjustments: {
          type: 'array',
          items: { type: 'string' },
          maxItems: 4,
        },
      },
      required: ['suggestedStyle', 'adjustments'],
    },
  },
  required: [
    'subject',
    'diagnosis',
    'confidence',
    'summary',
    'visualEvidence',
    'doNow',
    'nextBake',
    'risk',
    'missingContextQuestions',
  ],
};

function buildUserPrompt(context) {
  return `Analyze this sourdough photo.

Context:
- User-selected subject: ${context.subject || 'not specified'} (may be wrong if the image clearly shows another category)
- Stage: ${context.stage || 'not specified'}
- Room temperature: ${context.roomTempF != null ? context.roomTempF + 'F' : 'not specified'}
- Time since mixing/feeding: ${context.elapsedMinutes != null ? context.elapsedMinutes + ' minutes' : 'not specified'}
- Hydration: ${context.hydrationPercent != null ? context.hydrationPercent + '%' : 'not specified'}
- Flour type: ${context.flourType || 'not specified'}
- Starter readiness: ${context.starterReadiness || 'not specified'}
- User notes: ${context.notes || 'none'}

First classify what is visibly shown in the image, then analyze that visible category. If the user-selected subject conflicts with the image, say so briefly in the summary and return the visible category as "subject".

If the visible subject is dough, prioritize bulk fermentation, gluten development, hydration, and shaping readiness. If the visible subject is starter, prioritize activity, hunger, hooch, mold/spoilage warning signs, and feeding readiness. If the visible subject is crumb, prioritize fermentation, shaping, proofing, baking, and gluten clues. If the visible subject is a whole baked loaf, prioritize oven spring, loaf height versus spread, ear/score opening, crust, side blowouts, collapse, and bake completion clues.

Do not let optional context flip the visual diagnosis. In particular, if a baked loaf visibly looks flat, spread, collapsed, has little oven spring, or if a sliced crumb shows huge caverns with torn/webby structure and dense gummy patches, do not diagnose it as underproofed solely because the entered time seems short. Treat that as conflicting context and explain the conflict.

For sliced crumb photos with giant irregular caverns and dense patches, prefer a diagnosis headline like "Likely overproofed or overfermented crumb" or "Likely overfermentation with shaping contribution" over a generic "uneven crumb" headline.

Give a likely diagnosis, confidence label, visual evidence, do-now actions, next-bake prevention tips, and risk/caution note.`;
}

function stripMarkdownFences(text) {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

function validateDiagnosis(parsed) {
  const validConfidence = ['low', 'medium', 'high'];
  const validSubjects = ['dough', 'starter', 'crumb', 'loaf'];

  if (!validConfidence.includes(parsed.confidence)) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }
  if (!validSubjects.includes(parsed.subject)) {
    throw new Error(`Invalid subject: ${parsed.subject}`);
  }
  if (typeof parsed.diagnosis !== 'string' || !parsed.diagnosis) {
    throw new Error('diagnosis must be a non-empty string');
  }
  if (typeof parsed.summary !== 'string' || !parsed.summary) {
    throw new Error('summary must be a non-empty string');
  }
  if (typeof parsed.risk !== 'string' || !parsed.risk) {
    throw new Error('risk must be a non-empty string');
  }
  if (!Array.isArray(parsed.visualEvidence) || parsed.visualEvidence.length === 0) {
    throw new Error('visualEvidence must be a non-empty array');
  }
  if (!Array.isArray(parsed.doNow) || parsed.doNow.length === 0) {
    throw new Error('doNow must be a non-empty array');
  }
  for (const action of parsed.doNow) {
    if (typeof action !== 'object' || action === null) {
      throw new Error('each doNow item must be an object');
    }
    if (typeof action.title !== 'string' || !action.title) {
      throw new Error('each doNow item must have a non-empty title string');
    }
    if (typeof action.details !== 'string' || !action.details) {
      throw new Error('each doNow item must have a non-empty details string');
    }
  }
  if (!Array.isArray(parsed.nextBake) || parsed.nextBake.length === 0) {
    throw new Error('nextBake must be a non-empty array');
  }
  if (!Array.isArray(parsed.missingContextQuestions)) {
    throw new Error('missingContextQuestions must be an array');
  }
  return parsed;
}

function hasAny(text, keywords) {
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function applyBakerGuardrails(diagnosis) {
  const evidenceText = [
    diagnosis.diagnosis,
    diagnosis.summary,
    diagnosis.risk,
    ...(diagnosis.visualEvidence || []),
  ].join(' ');

  const hasCaverns = hasAny(evidenceText, [
    'cavern',
    'large, irregular',
    'very large',
    'giant',
    'tunnel',
    'large holes',
    'large air pockets',
    'significant voids',
  ]);
  const hasDensePatches = hasAny(evidenceText, [
    'dense',
    'denser',
    'gummy',
    'tight areas',
    'collapsed',
    'webby',
    'fragile',
    'stretched',
  ]);
  const mentionsUnderproof = hasAny(evidenceText, [
    'underferment',
    'underproof',
    'under-proof',
  ]);

  if (diagnosis.subject === 'crumb' && hasCaverns && hasDensePatches) {
    const nextBake = [
      'Shorten bulk or final proof and judge readiness by rise, dough feel, and surface strength rather than time alone.',
      'Shape gently but deliberately so you do not trap large air pockets.',
      'Watch for slack, fragile dough or a collapsing surface before baking.',
      ...(diagnosis.nextBake || []),
    ].slice(0, 5);

    return {
      ...diagnosis,
      diagnosis: 'Likely overproofed or overfermented crumb with shaping contribution',
      confidence: diagnosis.confidence === 'low' ? 'medium' : diagnosis.confidence,
      summary:
        'The crumb shows very large cavernous voids next to denser patches and stretched, fragile-looking gluten. That pattern points more toward overproofing/overfermentation and gas coalescence, with shaping possibly trapping or exaggerating the large pockets.',
      visualEvidence: [
        'Very large, irregular caverns or tunnels are visible in the crumb.',
        'Dense patches sit beside the large voids instead of a consistent open crumb.',
        'The gluten around the holes looks stretched, webby, or fragile.',
        ...(diagnosis.visualEvidence || []),
      ].slice(0, 5),
      nextBake,
      risk: mentionsUnderproof
        ? 'The optional timing/context conflicts with the visual evidence. Do not treat this as underproofed unless the overall crumb is tight and closed; the visible pattern is more consistent with overproofing/overfermentation plus shaping contribution.'
        : diagnosis.risk,
    };
  }

  return diagnosis;
}

async function callGemini(imageBase64, mimeType, context) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const userPrompt = buildUserPrompt(context);

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseJsonSchema: PHOTO_RESCUE_SCHEMA,
    },
  });

  const rawText = response.text || '';
  const cleaned = stripMarkdownFences(rawText);
  const parsed = JSON.parse(cleaned);
  return applyBakerGuardrails(validateDiagnosis(parsed));
}

module.exports = { callGemini, buildUserPrompt, SYSTEM_INSTRUCTION, applyBakerGuardrails };
