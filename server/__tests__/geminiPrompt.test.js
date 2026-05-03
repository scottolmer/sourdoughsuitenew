const {
  applyBakerGuardrails,
  buildUserPrompt,
  SYSTEM_INSTRUCTION,
} = require('../gemini');

describe('Photo Rescue Gemini prompt', () => {
  it('treats the selected subject as weak context when the image clearly differs', () => {
    const prompt = buildUserPrompt({
      subject: 'dough',
      stage: 'Late bulk',
      elapsedMinutes: 180,
    });

    expect(prompt).toContain('User-selected subject: dough');
    expect(prompt).toContain('may be wrong if the image clearly shows another category');
    expect(prompt).toContain('return the visible category as "subject"');
  });

  it('prevents timing context from overriding visible overproofed loaf evidence', () => {
    expect(SYSTEM_INSTRUCTION).toContain('Visual evidence beats timing context');
    expect(SYSTEM_INSTRUCTION).toContain('Overproofed baked loaf');
    expect(SYSTEM_INSTRUCTION).toContain('Do not call a visibly flat, spread loaf underproofed');
    expect(SYSTEM_INSTRUCTION).toContain('Overproofed / overfermented crumb');
    expect(SYSTEM_INSTRUCTION).toContain('huge caverns plus collapsed or');

    const prompt = buildUserPrompt({
      subject: 'loaf',
      stage: 'Just baked',
      elapsedMinutes: 120,
    });

    expect(prompt).toContain('Do not let optional context flip the visual diagnosis');
    expect(prompt).toContain('flat, spread, collapsed, has little oven spring');
    expect(prompt).toContain('Likely overproofed or overfermented crumb');
  });

  it('rewrites cavernous crumb responses away from underproofing', () => {
    const guarded = applyBakerGuardrails({
      id: 'diag_test',
      createdAt: new Date().toISOString(),
      subject: 'crumb',
      diagnosis: 'Imbalanced Fermentation and/or Shaping Issues',
      confidence: 'medium',
      summary:
        'Very large, cavernous holes beside denser areas may indicate underfermentation or shaping issues.',
      visualEvidence: [
        'Presence of very large, irregular, cavernous holes within the crumb structure.',
        'Uneven distribution of air pockets, with significant voids existing alongside denser areas.',
        'The gluten around the holes looks collapsed, webby, stretched, and fragile.',
      ],
      doNow: [{ title: 'Review the crumb', details: 'Compare visual signs.' }],
      nextBake: ['Track fermentation time.'],
      risk: 'Context may suggest underfermentation.',
      missingContextQuestions: [],
    });

    expect(guarded.diagnosis).toBe(
      'Likely overproofed or overfermented crumb with shaping contribution'
    );
    expect(guarded.summary).toContain('overproofing/overfermentation');
    expect(guarded.risk).toContain('Do not treat this as underproofed');
  });

  it('does not force overproofing when starter strength and gluten/shaping are better explanations', () => {
    const guarded = applyBakerGuardrails({
      id: 'diag_live_style_weak_starter',
      createdAt: new Date().toISOString(),
      subject: 'crumb',
      diagnosis: 'Uneven crumb with large holes and dense patches',
      confidence: 'medium',
      summary:
        'There are several large irregular holes with tighter denser crumb beside them.',
      visualEvidence: [
        'Presence of several very large, irregular, cavernous holes in the crumb.',
        'Areas of tighter, denser crumb adjacent to the large voids.',
      ],
      doNow: [
        {
          title: 'Evaluate dough handling',
          details:
            'The dough may have had insufficient gluten development and weak structure during shaping.',
        },
      ],
      nextBake: [
        'Strengthen your starter: ensure your starter is very active and strong before mixing.',
        'Focus on gentle but effective shaping to build stronger surface tension.',
      ],
      risk: 'No food safety issue is apparent.',
      missingContextQuestions: [
        'How active was your starter when you mixed the dough?',
      ],
      bakePlanSeed: {
        suggestedStyle: 'overnight-cold-proof',
        adjustments: [
          'Ensure starter is at peak activity before mixing.',
          'Build more gluten strength during bulk.',
        ],
      },
    });

    expect(guarded.diagnosis).toBe(
      'Likely weak starter with weak gluten development and shaping issues'
    );
  });

  it('prefers weak starter when a flat dense crumb has weak gluten and shaping clues', () => {
    expect(SYSTEM_INSTRUCTION).toContain('Weak starter / weak fermentation strength');

    const prompt = buildUserPrompt({
      subject: 'crumb',
      stage: 'Just cut',
    });

    expect(prompt).toContain('weak starter or weak fermentation strength');

    const guarded = applyBakerGuardrails({
      id: 'diag_weak_starter',
      createdAt: new Date().toISOString(),
      subject: 'crumb',
      diagnosis: 'Likely overproofed or overfermented crumb with shaping contribution',
      confidence: 'medium',
      summary:
        'The loaf appears flat with a dense, compressed crumb, weak gluten structure, and uneven holes likely affected by shaping.',
      visualEvidence: [
        'Flattened loaf profile with limited lift.',
        'Dense compressed crumb through much of the slice.',
        'Weak gluten development and shaping issues are visible.',
        'Some larger irregular holes appear beside tight dense areas.',
      ],
      doNow: [{ title: 'Review starter', details: 'Check starter strength before the next bake.' }],
      nextBake: ['Shorten bulk fermentation.'],
      risk: 'No food safety issue is apparent.',
      missingContextQuestions: [],
    });

    expect(guarded.diagnosis).toBe(
      'Likely weak starter with weak gluten development and shaping issues'
    );
    expect(guarded.summary).toContain('weak starter');
    expect(guarded.nextBake).toContain('Strengthen the starter before mixing: feed at peak activity for several cycles and use it only when it reliably doubles or triples on schedule.');
  });
});
