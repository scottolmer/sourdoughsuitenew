import { generateBakePlan } from '../bakePlanner';

describe('generateBakePlan', () => {
  it('creates an overnight cold proof timeline ending at the target bake time', () => {
    const plan = generateBakePlan({
      targetBakeAt: '2026-05-03T18:00:00.000Z',
      roomTempF: 72,
      starterReadiness: 'okay',
      scheduleStyle: 'overnight-cold-proof',
      hydrationPercent: 78,
      loafCount: 2,
      doughWeightG: 1800,
      starterPercent: 20,
      remindersEnabled: true,
    });

    const bake = plan.steps.find(step => step.type === 'bake');
    const preheat = plan.steps.find(step => step.type === 'preheat');
    const coldProof = plan.steps.find(step => step.type === 'cold-proof');
    const mix = plan.steps.find(step => step.type === 'mix');

    expect(plan.fermentationRisk).toBe('medium');
    expect(bake?.startsAt).toBe('2026-05-03T18:00:00.000Z');
    expect(preheat?.startsAt).toBe('2026-05-03T17:15:00.000Z');
    expect(coldProof).toBeDefined();
    expect(mix).toBeDefined();
    expect(new Date(mix!.startsAt).getTime()).toBeLessThan(
      new Date(coldProof!.startsAt).getTime()
    );
    expect(plan.steps.every(step => step.reminderEnabled)).toBe(true);
  });

  it('raises fermentation risk for hot rooms, weak starter, and very high hydration', () => {
    const plan = generateBakePlan({
      targetBakeAt: '2026-05-03T18:00:00.000Z',
      roomTempF: 82,
      starterReadiness: 'weak',
      scheduleStyle: 'same-day',
      hydrationPercent: 84,
      loafCount: 1,
      remindersEnabled: false,
    });

    expect(plan.fermentationRisk).toBe('high');
    expect(plan.temperatureNote).toMatch(/faster|overfermentation/i);
    expect(plan.starterNote).toMatch(/weak/i);
    expect(plan.steps.every(step => step.reminderEnabled)).toBe(false);
  });
});
