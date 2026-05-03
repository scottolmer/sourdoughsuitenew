import type {
  BakePlanInput,
  BakePlan,
  BakePlanStep,
  BakeStepType,
} from '../types/photoRescue';
import type { MaterialCommunityIconName } from '../types/icons';

function addMinutes(isoString: string, minutes: number): string {
  const d = new Date(isoString);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function subtractMinutes(isoString: string, minutes: number): string {
  return addMinutes(isoString, -minutes);
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getBulkMinutes(input: BakePlanInput): number {
  const { roomTempF, starterReadiness, hydrationPercent } = input;

  let base = 270;

  if (roomTempF < 68) base = 360;
  else if (roomTempF >= 68 && roomTempF <= 74) base = 270;
  else if (roomTempF >= 75 && roomTempF <= 79) base = 210;
  else if (roomTempF >= 80) base = 180;

  if (starterReadiness === 'weak') base = Math.round(base * 1.2);
  else if (starterReadiness === 'strong') base = Math.round(base * 0.85);

  return base;
}

function getFeedStarterLeadMinutes(input: BakePlanInput): number {
  const { starterReadiness, roomTempF } = input;
  let base = 360;
  if (starterReadiness === 'weak') base = 480;
  else if (starterReadiness === 'strong') base = 240;
  if (roomTempF < 68) base = Math.round(base * 1.15);
  else if (roomTempF >= 75) base = Math.round(base * 0.85);
  return base;
}

function getTemperatureNote(roomTempF: number): string {
  if (roomTempF < 68) return 'Your kitchen is cool. Fermentation will be slower — consider a warm spot or slightly longer bulk time.';
  if (roomTempF <= 74) return 'Room temperature is ideal. Follow the timeline as-is.';
  if (roomTempF <= 79) return 'Room is warm. Check bulk earlier and keep an eye on rise speed.';
  return 'High heat alert — fermentation moves fast at this temperature. Watch bulk closely and shape promptly.';
}

function getStarterNote(starterReadiness: BakePlanInput['starterReadiness']): string {
  if (starterReadiness === 'weak') return 'Your starter needs extra time to peak. Feed it well in advance and only mix when you see clear dome and bubbles.';
  if (starterReadiness === 'strong') return 'Your starter is active. It may peak quickly — watch for dome and plan mixing accordingly.';
  return 'Your starter is in good shape. Follow the timeline with regular checks.';
}

function getHydrationNote(hydrationPercent: number): string {
  if (hydrationPercent >= 80) return 'High hydration dough: expect a looser feel, use wet hands, and build strength gradually.';
  if (hydrationPercent >= 75) return 'Moderately high hydration: use gentle folds and avoid adding extra flour too early.';
  if (hydrationPercent <= 65) return 'Lower hydration dough: expect more resistance during mixing and shaping.';
  return 'Balanced hydration: follow the timeline, then trust dough expansion and surface tension.';
}

function getFermentationRisk(input: BakePlanInput): 'low' | 'medium' | 'high' {
  const { roomTempF, starterReadiness, hydrationPercent } = input;
  let riskScore = 0;
  if (roomTempF >= 80) riskScore += 2;
  else if (roomTempF >= 75) riskScore += 1;
  if (starterReadiness === 'strong') riskScore += 1;
  if (hydrationPercent >= 80) riskScore += 1;
  if (riskScore >= 3) return 'high';
  if (riskScore >= 1) return 'medium';
  return 'low';
}

function makeStep(
  type: BakeStepType,
  title: string,
  startsAt: string,
  notes: string,
  durationMinutes?: number,
  reminders = false
): BakePlanStep {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    startsAt,
    durationMinutes,
    notes,
    reminderEnabled: reminders,
  };
}

export function generateBakePlan(input: BakePlanInput): BakePlan {
  const steps: BakePlanStep[] = [];
  const bakeAt = input.targetBakeAt;
  const reminders = input.remindersEnabled;
  const { hydrationPercent, scheduleStyle, diagnosis } = input;

  const extraFoldsFromDiagnosis =
    diagnosis?.bakePlanSeed?.adjustments?.some(a =>
      a.toLowerCase().includes('coil fold') || a.toLowerCase().includes('extra fold')
    ) ?? false;

  const preheatAt = subtractMinutes(bakeAt, 45);
  const coolAt = addMinutes(bakeAt, 45);

  if (scheduleStyle === 'overnight-cold-proof') {
    const shapeAt = subtractMinutes(bakeAt, 11 * 60);
    const bulkMinutes = getBulkMinutes(input);
    const mixAt = subtractMinutes(shapeAt, bulkMinutes);
    const bulkCheckAt = subtractMinutes(shapeAt, 30);
    const fold1At = addMinutes(mixAt, 30);
    const fold2At = addMinutes(mixAt, 60);
    const fold3At = extraFoldsFromDiagnosis ? addMinutes(mixAt, 90) : null;
    const feedLeadMins = getFeedStarterLeadMinutes(input);
    const feedAt = subtractMinutes(mixAt, feedLeadMins);
    const coldProofAt = addMinutes(shapeAt, 15);
    const uncoverAt = subtractMinutes(bakeAt, 10);

    const feedNotes = [
      'Feed your starter and let it reach peak activity before mixing.',
      input.starterReadiness === 'weak' ? 'Watch closely — only mix once the starter is clearly domed and active.' : '',
    ].filter(Boolean).join(' ');

    steps.push(makeStep('feed-starter', 'Feed Starter', feedAt, feedNotes, undefined, reminders));

    const mixNotes = [
      `Mix flour, water (${hydrationPercent}%), salt, and active starter.`,
      hydrationPercent >= 75 ? 'Use wet hands and resist the urge to add extra flour.' : '',
      hydrationPercent >= 80 ? 'High hydration — expect the dough to feel quite slack at first.' : '',
    ].filter(Boolean).join(' ');
    steps.push(makeStep('mix', 'Mix Dough', mixAt, mixNotes, 30, reminders));

    steps.push(makeStep('fold', 'Stretch & Fold — Set 1', fold1At,
      hydrationPercent >= 75
        ? 'Perform gentle coil folds with wet hands. Do 4 lifts, rotating the bowl each time.'
        : 'Do 4 stretch-and-folds, one in each compass direction.',
      10, reminders));

    steps.push(makeStep('fold', 'Stretch & Fold — Set 2', fold2At,
      'The dough should feel more cohesive now. Do another round of 4 folds. Look for tension building.', 10, reminders));

    if (fold3At) {
      steps.push(makeStep('fold', 'Coil Fold — Set 3 (Recommended)', fold3At,
        'Extra fold recommended from your photo rescue results. Helps build strength in high-hydration or slack dough.', 10, reminders));
    }

    const bulkCheckNotes = [
      'Check for 50–75% rise from original volume, a domed surface, and visible bubbles.',
      'Dough should jiggle gently and leave a slow-filling indent when poked.',
      input.roomTempF >= 75 ? 'Room is warm — check a bit earlier if the dough looks very active.' : '',
    ].filter(Boolean).join(' ');
    steps.push(makeStep('bulk-check', 'Bulk Fermentation Check', bulkCheckAt, bulkCheckNotes, undefined, reminders));

    const shapeNotes = [
      'Pre-shape, rest 20–30 min, then final shape into a boule or batard.',
      hydrationPercent >= 75 ? 'Use a light dusting of rice flour for the banneton and work quickly.' : '',
    ].filter(Boolean).join(' ');
    steps.push(makeStep('shape', 'Shape Dough', shapeAt, shapeNotes, 30, reminders));

    steps.push(makeStep('cold-proof', 'Cold Proof (Overnight)', coldProofAt,
      'Cover the shaped dough tightly and transfer to the fridge. Cold proof for 8–14 hours.', undefined, false));

    steps.push(makeStep('preheat', 'Preheat Oven + Dutch Oven', preheatAt,
      'Set oven to 500°F (260°C) with your Dutch oven inside. Preheat for at least 45 minutes.', 45, reminders));

    if (uncoverAt !== preheatAt) {
      steps.push(makeStep('uncover', 'Remove Dough from Fridge', uncoverAt,
        'Pull the dough out of the fridge just before baking. Cold dough scores more cleanly.', 10, false));
    }

    steps.push(makeStep('bake', 'Bake', bakeAt,
      'Score dough, place in Dutch oven. Bake covered 20 min at 500°F, then uncovered 20–25 min at 450°F until deep brown.', 45, reminders));

    steps.push(makeStep('cool', 'Cool on Wire Rack', coolAt,
      'Rest at least 90 minutes before cutting. The crumb sets as it cools — cutting early causes gummy texture.', 90, false));

  } else {
    const bulkMinutes = getBulkMinutes(input);
    const shapeAt = subtractMinutes(preheatAt, 90);
    const mixAt = subtractMinutes(shapeAt, bulkMinutes);
    const fold1At = addMinutes(mixAt, 30);
    const fold2At = addMinutes(mixAt, 60);
    const bulkCheckAt = subtractMinutes(shapeAt, 30);
    const feedAt = subtractMinutes(mixAt, getFeedStarterLeadMinutes(input));
    const proofAt = addMinutes(shapeAt, 15);

    steps.push(makeStep('feed-starter', 'Feed Starter', feedAt,
      'Feed starter to peak activity before mixing.', undefined, reminders));

    steps.push(makeStep('mix', 'Mix Dough', mixAt,
      `Mix all ingredients. Hydration: ${hydrationPercent}%.`, 30, reminders));

    steps.push(makeStep('fold', 'Stretch & Fold — Set 1', fold1At,
      'Perform 4 folds, rotating bowl each time.', 10, reminders));

    steps.push(makeStep('fold', 'Stretch & Fold — Set 2', fold2At,
      'Second set of folds. Dough should feel stronger.', 10, reminders));

    steps.push(makeStep('bulk-check', 'Bulk Check', bulkCheckAt,
      'Check for 50–75% rise, visible bubbles, and gentle jiggle.', undefined, reminders));

    steps.push(makeStep('shape', 'Shape Dough', shapeAt,
      'Shape into final form. Build surface tension.', 30, reminders));

    steps.push(makeStep('cold-proof', 'Proof at Room Temp', proofAt,
      'Cover and proof at room temperature until poke test shows slow spring-back.', 60, false));

    steps.push(makeStep('preheat', 'Preheat Oven + Dutch Oven', preheatAt,
      'Preheat oven with Dutch oven to 500°F for at least 45 min.', 45, reminders));

    steps.push(makeStep('bake', 'Bake', bakeAt,
      'Score dough, bake covered 20 min at 500°F, then uncovered 20–25 min at 450°F.', 45, reminders));

    steps.push(makeStep('cool', 'Cool on Wire Rack', coolAt,
      'Rest at least 90 minutes before slicing.', 90, false));
  }

  steps.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    fermentationRisk: getFermentationRisk(input),
    temperatureNote: getTemperatureNote(input.roomTempF),
    starterNote: getStarterNote(input.starterReadiness),
    hydrationNote: getHydrationNote(input.hydrationPercent),
    steps,
  };
}

/**
 * Re-anchors every step in a plan so the first step starts RIGHT NOW,
 * preserving all relative durations between steps.
 */
export function shiftPlanToNow(plan: BakePlan): BakePlan {
  if (plan.steps.length === 0) return plan;
  const sorted = [...plan.steps].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  const firstStepMs = new Date(sorted[0].startsAt).getTime();
  const deltaMs = Date.now() - firstStepMs;
  const shiftedSteps = plan.steps.map((step) => ({
    ...step,
    startsAt: new Date(new Date(step.startsAt).getTime() + deltaMs).toISOString(),
  }));
  return { ...plan, steps: shiftedSteps };
}

export const STEP_ICON_MAP: Record<BakeStepType, MaterialCommunityIconName> = {
  'feed-starter': 'bacteria',
  'mix': 'blender',
  'fold': 'hand-wave',
  'bulk-check': 'magnify',
  'shape': 'circle-outline',
  'cold-proof': 'snowflake',
  'preheat': 'fire',
  'bake': 'pot-steam',
  'uncover': 'tray-arrow-up',
  'cool': 'thermometer-low',
};

export function formatStepTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatStepDay(isoString: string): string {
  const now = new Date();
  const d = new Date(isoString);
  const diffDays = Math.floor((d.setHours(0,0,0,0) - now.setHours(0,0,0,0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
