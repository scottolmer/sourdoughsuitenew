import { createQuickRescueDiagnosis } from '../photoRescueRules';

describe('createQuickRescueDiagnosis', () => {
  it('returns honest checklist guidance for overfermented dough signs', () => {
    const diagnosis = createQuickRescueDiagnosis({
      subject: 'dough',
      stage: 'bulk',
      elapsedMinutes: 420,
      roomTempF: 78,
      hydrationPercent: 80,
      starterReadiness: 'strong',
      observedSigns: ['collapsed', 'shiny', 'slack'],
    });

    expect(diagnosis.source).toBe('quick-rescue');
    expect(diagnosis.diagnosis.confidence).toBe('medium');
    expect(diagnosis.diagnosis.diagnosis).toMatch(/overfermentation/i);
    expect(diagnosis.diagnosis.summary).toContain('Using quick rescue checklist');
    expect(diagnosis.diagnosis.doNow[0].title).toMatch(/shape|cool/i);
    expect(diagnosis.diagnosis.bakePlanSeed?.suggestedStyle).toBe(
      'overnight-cold-proof'
    );
  });

  it('safety-stops starter guidance when mold is reported', () => {
    const diagnosis = createQuickRescueDiagnosis({
      subject: 'starter',
      observedSigns: ['mold', 'pink streaks'],
      roomTempF: 72,
    });

    expect(diagnosis.diagnosis.confidence).toBe('high');
    expect(diagnosis.diagnosis.diagnosis).toMatch(/discard/i);
    expect(diagnosis.diagnosis.risk).toMatch(/do not taste/i);
    expect(diagnosis.diagnosis.doNow[0].title).toMatch(/discard/i);
  });
});
