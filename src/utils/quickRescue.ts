import type {
  QuickRescueAnswers,
  PhotoRescueDiagnosis,
  RescueAction,
  BakePlanSeed,
} from '../types/photoRescue';

function makeId(): string {
  return `qr_${Date.now()}`;
}

export function runQuickRescue(answers: QuickRescueAnswers): PhotoRescueDiagnosis {
  const { subject, stage, roomTempF, elapsedMinutes, observedSigns, hydrationPercent, starterReadiness } = answers;
  const signs = observedSigns.map(s => s.toLowerCase());

  const has = (...keywords: string[]): boolean =>
    keywords.some(k => signs.some(s => s.includes(k)));

  let diagnosis = '';
  let confidence: PhotoRescueDiagnosis['confidence'] = 'medium';
  let summary = '';
  let visualEvidence: string[] = [];
  let doNow: RescueAction[] = [];
  let nextBake: string[] = [];
  let risk = '';
  let bakePlanSeed: BakePlanSeed | undefined;
  const missingContextQuestions: string[] = [];

  if (subject === 'dough') {
    if (has('slack', 'shiny', 'collapsed', 'huge bubbles', 'overferment', 'liquid')) {
      diagnosis = 'Likely overfermented dough';
      confidence = 'medium';
      summary = 'Overfermentation breaks down gluten, leaving the dough slack and unable to hold structure. A pan loaf or focaccia is often the best rescue path.';
      visualEvidence = ['Dough spreading rather than holding shape', 'Shiny or wet surface', 'Large irregular bubbles or collapsed top'];
      doNow = [
        { title: 'Shape gently into a pan loaf', details: 'Do not deflate aggressively. Line a loaf pan and proof cold.', minutesFromNow: 10 },
        { title: 'Cold proof immediately', details: 'Refrigerate for 1–2 hours to slow further fermentation before baking.', minutesFromNow: 15 },
        { title: 'Consider a focaccia', details: 'Pour the slack dough into an oiled pan — it may bake beautifully as a flatbread.', minutesFromNow: 10 },
      ];
      nextBake = ['Reduce bulk time by 30–45 minutes.', 'Check bulk earlier using the poke test.', 'Use a slightly cooler room or fridge-ferment.'];
      risk = 'Avoid aggressive folding or reshaping now — the gluten network is weakened.';
      bakePlanSeed = { suggestedStyle: 'overnight-cold-proof', adjustments: ['Use a shorter bulk time.', 'Shape before dough over-relaxes.'] };
    } else if (has('dense', 'few bubbles', 'little rise', 'underferment', 'no rise')) {
      diagnosis = 'Likely underfermented dough';
      confidence = 'medium';
      summary = 'The dough has not had enough time or warmth to develop bubbles and rise. More time in bulk or a warmer spot is typically the fix.';
      visualEvidence = ['Limited rise from original volume', 'Dense, few visible bubbles', 'Dough springs back quickly when poked'];
      doNow = [
        { title: 'Wait 45–60 minutes and recheck', details: 'Move to a warmer spot if possible. Check for 50–75% rise and visible bubbles.', minutesFromNow: 45 },
        { title: 'Do one more fold', details: 'A light fold will help build structure without degassing prematurely.', minutesFromNow: 10 },
      ];
      nextBake = ['Allow more time for bulk, especially in cool kitchens.', 'Try a warmer proving spot or a slightly oven-light trick.', 'Use a stronger or fresher starter.'];
      risk = 'Do not shape until the dough has clearly risen and shows bubbles — underbaked dense crumb is the main risk.';
      bakePlanSeed = { suggestedStyle: 'overnight-cold-proof', adjustments: ['Extend bulk check time.', 'Check dough at 50–75% rise before shaping.'] };
    } else if (has('glossy', 'spreading', 'high hydration', 'weak gluten', 'tears', 'slack')) {
      diagnosis = 'Likely underdeveloped gluten / high hydration handling issue';
      confidence = 'medium';
      summary = 'High hydration dough needs coil folds and patience. The glossy, spreading look is normal early in bulk — but needs gentle development to build structure.';
      visualEvidence = ['Glossy wet surface', 'Dough spreading flat', 'Few visible tension lines'];
      doNow = [
        { title: 'Rest 20 minutes', details: 'Let the flour finish hydrating before any more handling.', minutesFromNow: 20 },
        { title: 'Perform two gentle coil folds', details: 'Use wet hands. Lift the dough from the bottom, fold over. Repeat 4 lifts.', minutesFromNow: 30 },
        { title: 'Avoid adding flour', details: 'Use wet hands instead of flour to prevent a dense crumb.', minutesFromNow: 0 },
      ];
      nextBake = ['Lower hydration by 3–5% to make handling easier.', 'Add an extra fold in the first half of bulk.', 'Track dough temperature for consistency.'];
      risk = 'Do not mix aggressively — tearing the developing gluten network will worsen spread.';
      bakePlanSeed = { suggestedStyle: 'overnight-cold-proof', adjustments: ['Add two coil folds before shaping.', 'Use a conservative bulk check.'] };
    } else if (has('tight', 'tears', 'fast spring', 'not relaxed')) {
      diagnosis = 'Dough may not have relaxed enough yet';
      confidence = 'low';
      summary = 'Tight dough that tears easily usually just needs more rest. Gluten can tighten during folding and needs time to relax.';
      visualEvidence = ['Dough tears during handling', 'Fast spring-back on poke test', 'Surface feels stiff or tight'];
      doNow = [
        { title: 'Rest 20 minutes uncovered', details: 'Leave the dough on the bench or in the bowl and let it relax.', minutesFromNow: 20 },
        { title: 'Continue bulk', details: 'Check poke test again after resting — it should slow down.', minutesFromNow: 20 },
      ];
      nextBake = ['Space folds further apart.', 'Autolyse (rest flour and water before adding starter and salt).', 'Avoid over-mixing during initial combine.'];
      risk = 'Forcing a tight dough into shape tears the gluten. Rest first.';
      missingContextQuestions.push('How long has the dough been in bulk?', 'How many folds have you done so far?');
    } else {
      diagnosis = 'Dough status unclear — review signs below';
      confidence = 'low';
      summary = 'The observations don\'t clearly point to one cause. Review the checklist below and use your best judgment.';
      visualEvidence = ['Unclear indicators from provided signs'];
      doNow = [
        { title: 'Do the poke test', details: 'Poke the dough with a floured finger. Slow indent fill = ready. Fast = more time needed. No spring-back = over.', minutesFromNow: 0 },
        { title: 'Check rise percentage', details: 'Mark the container and measure rise from original volume.', minutesFromNow: 0 },
      ];
      nextBake = ['Track rise visually using a marked jar.', 'Note room temperature each session for consistency.'];
      risk = 'When in doubt, wait and check again in 30 minutes rather than shaping too early.';
      missingContextQuestions.push('How much has the dough risen?', 'What does the surface look like — flat, domed, or bubbly?');
    }

  } else if (subject === 'starter') {
    if (has('mold', 'pink', 'orange', 'fuzzy', 'colored')) {
      diagnosis = 'Mold detected — discard and restart';
      confidence = 'high';
      summary = 'Visible mold (especially pink, orange, or fuzzy growth) means the starter is contaminated. Discarding is the safe choice.';
      visualEvidence = ['Visible colored or fuzzy growth on surface'];
      doNow = [
        { title: 'Discard the starter', details: 'Do not taste or use. Clean the jar thoroughly before starting fresh.', minutesFromNow: 0 },
        { title: 'Start a fresh starter', details: 'Begin with clean equipment, filtered water, and fresh flour.', minutesFromNow: 0 },
      ];
      nextBake = ['Use filtered or bottled water to avoid chlorine issues.', 'Keep the jar clean and covered loosely.', 'Discard and feed regularly during establishment.'];
      risk = 'Food safety — do not attempt to scrape off mold and use the rest. Discard fully.';
    } else if (has('hooch', 'acetone', 'nail polish', 'alcohol', 'hungry', 'liquid on top')) {
      diagnosis = 'Hungry starter — needs feeding';
      confidence = 'high';
      summary = 'Liquid (hooch) on top and acetone-like smell mean the starter has exhausted its food supply. A fresh feed at a larger ratio will help.';
      visualEvidence = ['Liquid layer on top (hooch)', 'Strong sour or acetone smell', 'Starter has likely peaked and collapsed'];
      doNow = [
        { title: 'Feed at a higher ratio', details: 'Try 1:3:3 (starter:flour:water) to give it more food and dilute the acidity.', minutesFromNow: 0 },
        { title: 'Stir in the hooch or pour it off', details: 'Either is fine — stirring it back adds sour flavor.', minutesFromNow: 0 },
      ];
      nextBake = ['Feed on a more regular schedule.', 'Consider storing in the fridge between bakes to slow hunger.', 'Use a higher starter-to-flour ratio if it goes hungry quickly.'];
      risk = 'A very acidic starter may suppress yeast activity — repeated feedings may be needed before it\'s vigorous again.';
      missingContextQuestions.push('When was the starter last fed?', 'What ratio do you normally feed at?');
    } else if (has('doubled', 'domed', 'bubbly', 'airy', 'ready', 'floats')) {
      diagnosis = 'Starter looks ready to use';
      confidence = 'high';
      summary = 'A domed top, visible bubbles, and doubled volume are the classic signs of a starter at or near peak. Time to mix!';
      visualEvidence = ['Doubled or nearly doubled volume', 'Domed top surface', 'Visible bubbles throughout'];
      doNow = [
        { title: 'Mix your dough now', details: 'Use the starter while it\'s at peak activity for best oven spring.', minutesFromNow: 0 },
        { title: 'Float test if unsure', details: 'Drop a small spoonful in water — if it floats, you\'re good.', minutesFromNow: 0 },
      ];
      nextBake = ['Note the time from feed to peak for future planning.', 'Keep the feeding ratio consistent.'];
      risk = 'Starter past its peak (collapsed dome, receding sides) will still work but may produce a denser loaf.';
    } else {
      diagnosis = 'Starter is likely not ready yet';
      confidence = 'medium';
      summary = 'Few bubbles and limited rise suggest the starter hasn\'t reached peak activity. More time or a warmer spot is usually the answer.';
      visualEvidence = ['Limited rise from fed level', 'Few bubbles', 'Dense appearance'];
      doNow = [
        { title: 'Wait and check every hour', details: 'Look for a dome forming and bubbles increasing.', minutesFromNow: 60 },
        { title: 'Move to a warmer spot', details: 'Near (not on) an oven or on top of a fridge can add a few crucial degrees.', minutesFromNow: 0 },
      ];
      nextBake = ['Use a higher feeding ratio for a slower, more predictable rise.', 'Note the room temperature at each feeding for better timing.'];
      risk = 'Mixing with an immature starter can lead to poor fermentation and a dense crumb.';
      missingContextQuestions.push('When was the starter fed?', 'What is the room temperature?');
    }

  } else if (subject === 'crumb') {
    if (has('dense', 'gummy', 'wet', 'heavy')) {
      diagnosis = 'Dense or gummy crumb — likely underfermentation or underbaking';
      confidence = 'medium';
      summary = 'A dense, gummy crumb usually points to underfermentation (not enough rise in bulk), a weak starter, underdeveloped gluten, or pulling the loaf before the internal temp reached 205°F.';
      visualEvidence = ['Dense, tight crumb with few air pockets', 'Gummy or wet texture when cut', 'Heavy loaf with poor oven spring'];
      doNow = [
        { title: 'Check internal temperature', details: 'If you just pulled it, check with a thermometer. 205–210°F means done. Under 200°F means it needs more time.', minutesFromNow: 0 },
        { title: 'Note for next bake', details: 'If fully baked, the issue was likely in fermentation or starter strength.', minutesFromNow: 0 },
      ];
      nextBake = ['Extend bulk until dough shows 60–75% rise.', 'Use a vigorous starter (check float test).', 'Bake to internal temp 205–210°F.', 'Check gluten development before bulk.'];
      risk = 'Gummy crumb can also mean the loaf was cut too soon. Always cool at least 90 minutes.';
    } else if (has('huge holes', 'large holes', 'tunnel', 'uneven', 'dense bottom')) {
      diagnosis = 'Large holes with dense zones — likely shaping or overfermentation issue';
      confidence = 'medium';
      summary = 'A crumb with huge air pockets alongside dense areas usually points to shaping problems (trapped air), overfermentation, or rough handling during final proof.';
      visualEvidence = ['Large irregular holes', 'Dense zones near the bottom', 'Uneven distribution of air pockets'];
      doNow = [
        { title: 'Review your shaping technique', details: 'Large holes often mean air was trapped during shaping. Watch for degassing during pre-shape and final shape.', minutesFromNow: 0 },
        { title: 'Note bulk time for next bake', details: 'If bulk was very long, try reducing by 30 minutes.', minutesFromNow: 0 },
      ];
      nextBake = ['Degas gently during pre-shape.', 'Check bulk timing — look for 50–75% rise, not more.', 'Use even, firm pressure during shaping.'];
      risk = 'Avoid over-shaping high-hydration dough — it tears gluten and worsens the uneven structure.';
    } else if (has('tight', 'uniform', 'very dense', 'no holes')) {
      diagnosis = 'Very tight uniform crumb — likely severe underfermentation';
      confidence = 'medium';
      summary = 'A very tight, nearly hole-free crumb usually means the dough did not ferment long enough or the starter was too weak.';
      visualEvidence = ['Very tight uniform crumb structure', 'Almost no air pockets visible', 'Dense overall texture'];
      doNow = [
        { title: 'Evaluate your starter', details: 'A starter that doesn\'t pass the float test or domed peak may not be strong enough.', minutesFromNow: 0 },
        { title: 'Extend bulk next time', details: 'Aim for 60–75% rise with visible bubbles and a slow poke spring-back.', minutesFromNow: 0 },
      ];
      nextBake = ['Rebuild starter activity with daily feedings.', 'Increase starter percentage to 20–25% of flour weight.', 'Use warmer water to encourage activity.'];
      risk = 'The loaf is likely safe to eat even with a dense crumb — fermentation just didn\'t complete.';
    } else {
      diagnosis = 'Crumb result unclear — more context needed';
      confidence = 'low';
      summary = 'Based on the signs described, a specific crumb issue isn\'t clear. Review the checklist below.';
      visualEvidence = ['Signs did not clearly match a known pattern'];
      doNow = [{ title: 'Photograph and note the crumb pattern', details: 'Send a clearer description for a better diagnosis next time.', minutesFromNow: 0 }];
      nextBake = ['Track fermentation time, starter activity, and baking temp for each bake.'];
      risk = 'Without clear visual clues, start with underfermentation as the most common cause and work from there.';
      missingContextQuestions.push('Is the crumb dense throughout or only in some areas?', 'What was the loaf\'s internal temperature when cut?');
    }

  } else {
    if (has('flat', 'no spring', 'spread', 'wide', 'no ear')) {
      diagnosis = 'Flat loaf — likely overfermentation or weak surface tension';
      confidence = 'medium';
      summary = 'A flat loaf with no oven spring usually results from overfermentation (too much bulk or proof time), weak shaping, or a starter that was past its peak.';
      visualEvidence = ['Loaf spread wide instead of rising', 'Little or no ear from scoring', 'Flat top with no oven spring'];
      doNow = [
        { title: 'Bake it anyway', details: 'The loaf may still taste good as a flatter bread or focaccia-style loaf.', minutesFromNow: 0 },
        { title: 'Review bulk and proof times', details: 'For next bake, aim for 50–75% rise in bulk and finger-dent test for proofing.', minutesFromNow: 0 },
      ];
      nextBake = ['Shorten bulk by 30–45 minutes.', 'Shape more firmly with better surface tension.', 'Use starter at peak, not past it.'];
      risk = 'Scoring at too steep an angle or with a dull blade contributes to no ear — keep the blade at 30–45° and use a fresh blade.';
    } else if (has('pale', 'underbaked crust', 'white crust')) {
      diagnosis = 'Pale crust — likely short steam, short preheat, or overfermented sugars';
      confidence = 'medium';
      summary = 'A pale crust often means the oven or Dutch oven wasn\'t hot enough, or the dough spent too long fermenting and ran low on residual sugars.';
      visualEvidence = ['Pale or light-colored crust', 'Insufficient Maillard browning'];
      doNow = [
        { title: 'Extend uncovered baking', details: 'Remove the lid and bake 5–10 minutes longer if still in the oven, or return to a 450°F oven briefly.', minutesFromNow: 0 },
      ];
      nextBake = ['Preheat oven and Dutch oven for at least 45–60 minutes.', 'Bake uncovered phase longer.', 'Reduce total fermentation time slightly.'];
      risk = 'Do not underbake trying to avoid burning — pale crust usually means a gummy interior.';
    } else if (has('burnt', 'dark', 'too dark', 'black')) {
      diagnosis = 'Overbaked crust — oven temperature too high or baked too long';
      confidence = 'medium';
      summary = 'A very dark or burnt crust can happen with ovens that run hot or when the uncovered phase runs too long.';
      visualEvidence = ['Very dark or blackened crust', 'Possible burning on bottom'];
      doNow = [
        { title: 'Let cool before cutting', details: 'Even a dark crust may hide a good interior — the crumb reveals the truth.', minutesFromNow: 0 },
      ];
      nextBake = ['Lower oven temperature by 25°F.', 'Cover with foil during the last 10 minutes if browning too fast.', 'Check oven calibration with a thermometer.'];
      risk = 'A burnt crust with raw center means the oven is too hot — lower temp and bake longer at a lower heat.';
    } else if (has('blowout', 'crack on side', 'burst', 'splitting')) {
      diagnosis = 'Blowout — likely overproofing or scoring issue';
      confidence = 'medium';
      summary = 'Side blowouts happen when the dough has more spring than the score allows to release, or the dough is overproofed and the crust sets unevenly.';
      visualEvidence = ['Side or bottom crack rather than scored opening', 'Uneven loaf shape'];
      doNow = [
        { title: 'Review scoring angle and depth', details: 'Score at 30–45° with a sharp lame or razor. Shallow scores tear; angled scores bloom.', minutesFromNow: 0 },
      ];
      nextBake = ['Score deeper (1/2 inch) and at an angle.', 'Check proofing — slightly underproofed loaves score and spring better.', 'Use a very sharp blade and replace regularly.'];
      risk = 'Proofing past the optimal window increases blowout risk. Use the dent test before baking.';
    } else {
      diagnosis = 'Loaf result unclear — more context needed';
      confidence = 'low';
      summary = 'The described observations didn\'t clearly match one pattern. Check the general guidance below.';
      visualEvidence = ['Observations did not clearly match a known pattern'];
      doNow = [{ title: 'Cut and photograph the crumb', details: 'The interior tells more than the exterior in most cases.', minutesFromNow: 0 }];
      nextBake = ['Log oven temperature, fermentation times, and hydration for each bake.'];
      risk = 'Most bakes reveal the issue in the crumb — note both interior and exterior patterns.';
      missingContextQuestions.push('Does the loaf have an ear or score opening?', 'What does the bottom crust look like?');
    }
  }

  if (!roomTempF) missingContextQuestions.push('What was the room temperature?');
  if (!elapsedMinutes && subject !== 'crumb' && subject !== 'loaf') missingContextQuestions.push('How long has it been since mixing or feeding?');

  return {
    id: makeId(),
    createdAt: new Date().toISOString(),
    subject,
    stage,
    diagnosis,
    confidence,
    summary,
    visualEvidence,
    doNow,
    nextBake,
    risk,
    missingContextQuestions: missingContextQuestions.slice(0, 4),
    bakePlanSeed,
  };
}

export interface QuickRescueQuestion {
  key: string;
  question: string;
  options: readonly string[];
  displayLabels?: string[];
  multiSelect?: boolean;
}

export const QUICK_RESCUE_QUESTIONS: QuickRescueQuestion[] = [
  {
    key: 'subject',
    question: 'What are you checking?',
    options: ['dough', 'starter', 'crumb', 'loaf'],
    displayLabels: ['Dough', 'Starter', 'Crumb', 'Loaf'],
  },
  {
    key: 'stage',
    question: 'What stage are you in?',
    options: ['Early bulk', 'Late bulk', 'After shaping', 'After proofing', 'Just baked', 'Other / not sure'],
  },
  {
    key: 'elapsed',
    question: 'How long has it been fermenting or since the last feeding?',
    options: ['Less than 2 hours', '2–4 hours', '4–6 hours', '6–10 hours', 'Overnight', 'Not sure'],
  },
  {
    key: 'roomTemp',
    question: 'What is the room temperature?',
    options: ['Below 65°F (cool)', '65–70°F (mild)', '71–74°F (ideal)', '75–79°F (warm)', '80°F+ (hot)', 'Not sure'],
  },
  {
    key: 'signs',
    question: 'What do you see? (pick all that apply)',
    options: [
      'Dense, few bubbles',
      'Slack or spreading',
      'Shiny or wet surface',
      'Collapsed top',
      'Hooch (liquid layer)',
      'Huge holes',
      'Flat loaf',
      'Pale crust',
      'Burnt crust',
      'Blowout / side crack',
      'Tight or tearing',
      'Doubled, domed, bubbly',
      'Gummy crumb',
      'Mold (colored or fuzzy)',
    ],
    multiSelect: true,
  },
  {
    key: 'hydration',
    question: 'What is the hydration, if you know it?',
    options: ['70% or below', '71–75%', '76–80%', '80%+', 'Not sure'],
  },
];
