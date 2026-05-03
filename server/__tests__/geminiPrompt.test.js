const { buildUserPrompt, SYSTEM_INSTRUCTION } = require('../gemini');

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

    const prompt = buildUserPrompt({
      subject: 'loaf',
      stage: 'Just baked',
      elapsedMinutes: 120,
    });

    expect(prompt).toContain('Do not let optional context flip the visual diagnosis');
    expect(prompt).toContain('flat, spread, collapsed, or has little oven spring');
  });
});
