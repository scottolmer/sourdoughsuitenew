import { BakePlan, BakePlanInput, BakePlanStep, Confidence } from '../types';

const minutes = (value: number) => value * 60 * 1000;

const isoMinus = (date: Date, minutesToSubtract: number) =>
  new Date(date.getTime() - minutes(minutesToSubtract)).toISOString();

const isoPlus = (date: Date, minutesToAdd: number) =>
  new Date(date.getTime() + minutes(minutesToAdd)).toISOString();

function getFermentationRisk(input: BakePlanInput): Confidence {
  let score = 0;

  if (input.roomTempF >= 80) score += 2;
  else if (input.roomTempF >= 76 || input.roomTempF < 68) score += 1;

  if (input.starterReadiness === 'weak') score += 2;
  else if (input.starterReadiness === 'strong' && input.roomTempF >= 76) score += 1;

  if (input.hydrationPercent >= 82) score += 2;
  else if (input.hydrationPercent >= 75) score += 2;

  if (input.diagnosis?.confidence === 'high') score += 1;

  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

function getBulkMinutes(input: BakePlanInput) {
  let bulk = 270;

  if (input.roomTempF < 68) bulk += 75;
  else if (input.roomTempF >= 80) bulk -= 75;
  else if (input.roomTempF >= 76) bulk -= 45;

  if (input.starterReadiness === 'weak') bulk += 60;
  if (input.starterReadiness === 'strong') bulk -= 20;

  return Math.max(180, Math.min(420, bulk));
}

function getStarterBuildMinutes(input: BakePlanInput) {
  if (input.starterReadiness === 'weak') return 480;
  if (input.starterReadiness === 'strong') return 240;
  return input.roomTempF < 70 ? 420 : 360;
}

function makeStep(
  input: BakePlanInput,
  type: BakePlanStep['type'],
  title: string,
  startsAt: string,
  notes: string,
  durationMinutes?: number
): BakePlanStep {
  return {
    id: `${type}_${startsAt}`,
    type,
    title,
    startsAt,
    durationMinutes,
    notes,
    reminderEnabled: input.remindersEnabled,
  };
}

function getTemperatureNote(input: BakePlanInput) {
  if (input.roomTempF >= 80) {
    return 'Hot room: fermentation will move faster and overfermentation risk is elevated. Check dough earlier than the clock suggests.';
  }
  if (input.roomTempF >= 75) {
    return 'Warm room: fermentation will move faster. Use the early side of each check window.';
  }
  if (input.roomTempF < 68) {
    return 'Cool room: fermentation will move slowly. Expect longer bulk or use a warmer spot.';
  }
  return 'Moderate room: standard fermentation windows should be reliable, but dough cues still win over the clock.';
}

function getStarterNote(input: BakePlanInput) {
  if (input.starterReadiness === 'weak') {
    return 'Weak starter: build it earlier and mix only after it is bubbly, domed, and near peak.';
  }
  if (input.starterReadiness === 'strong') {
    return 'Strong starter: expect confident fermentation and watch warm dough carefully.';
  }
  return 'Okay starter: use a conservative check before mixing and avoid starting with a collapsed culture.';
}

function getHydrationNote(input: BakePlanInput) {
  if (input.hydrationPercent >= 82) {
    return 'Very high hydration: use wet hands, gentle coil folds, and expect more spread.';
  }
  if (input.hydrationPercent >= 75) {
    return 'High hydration: coil folds and gentle handling will preserve structure.';
  }
  return 'Moderate hydration: standard stretch-and-fold handling should work well.';
}

export function generateBakePlan(input: BakePlanInput): BakePlan {
  const targetBake = new Date(input.targetBakeAt);
  const bakeDuration = input.loafCount > 1 ? 48 : 42;
  const preheatAt = isoMinus(targetBake, 45);
  const uncoverAt = isoPlus(targetBake, 22);
  const coolAt = isoPlus(targetBake, bakeDuration);

  const bulkMinutes = getBulkMinutes(input);
  const shapeLead =
    input.scheduleStyle === 'overnight-cold-proof' ? 12 * 60 : bakeDuration + 180;
  const shapeAt = isoMinus(targetBake, shapeLead);
  const shapeDate = new Date(shapeAt);
  const bulkCheckAt = isoMinus(shapeDate, 30);
  const mixAt = isoMinus(shapeDate, bulkMinutes);
  const mixDate = new Date(mixAt);
  const feedAt = isoMinus(mixDate, getStarterBuildMinutes(input));

  const steps: BakePlanStep[] = [
    makeStep(
      input,
      'feed-starter',
      'Feed starter',
      feedAt,
      getStarterNote(input),
      getStarterBuildMinutes(input)
    ),
    makeStep(
      input,
      'mix',
      'Mix dough',
      mixAt,
      `${input.hydrationPercent}% hydration, ${input.loafCount} loaf plan. ${getHydrationNote(input)}`,
      30
    ),
    makeStep(
      input,
      'fold',
      'First fold',
      isoPlus(mixDate, 30),
      'Build strength gently. Use coil folds for high-hydration dough.',
      5
    ),
    makeStep(
      input,
      'fold',
      'Second fold',
      isoPlus(mixDate, 60),
      'Look for smoother surface and more elasticity.',
      5
    ),
    makeStep(
      input,
      'fold',
      'Third fold if needed',
      isoPlus(mixDate, 90),
      'Skip this if the dough already feels strong and airy.',
      5
    ),
    makeStep(
      input,
      'bulk-check',
      'Bulk check',
      bulkCheckAt,
      'Look for rise, bubbles, a domed surface, and jiggle before shaping.',
      15
    ),
    makeStep(
      input,
      'shape',
      'Shape',
      shapeAt,
      'Create surface tension without degassing the dough aggressively.',
      25
    ),
  ];

  if (input.scheduleStyle === 'overnight-cold-proof') {
    steps.push(
      makeStep(
        input,
        'cold-proof',
        'Cold proof',
        isoPlus(shapeDate, 30),
        'Refrigerate covered. Cold proof builds flavor and slows fermentation.',
        shapeLead - 75
      )
    );
  }

  steps.push(
    makeStep(
      input,
      'preheat',
      'Preheat oven',
      preheatAt,
      'Preheat Dutch oven or baking steel thoroughly.',
      45
    ),
    makeStep(
      input,
      'bake',
      'Bake covered',
      targetBake.toISOString(),
      'Score cold dough and load with steam or a covered vessel.',
      22
    ),
    makeStep(
      input,
      'uncover',
      'Uncover and finish bake',
      uncoverAt,
      'Bake until deeply colored and the loaf feels light for its size.',
      bakeDuration - 22
    ),
    makeStep(
      input,
      'cool',
      'Cool before slicing',
      coolAt,
      'Rest at least 90 minutes so the crumb can set fully.',
      90
    )
  );

  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    fermentationRisk: getFermentationRisk(input),
    temperatureNote: getTemperatureNote(input),
    starterNote: getStarterNote(input),
    hydrationNote: getHydrationNote(input),
    steps: steps.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    ),
  };
}
