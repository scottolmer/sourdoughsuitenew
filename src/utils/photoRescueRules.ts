import {
  PhotoRescueDiagnosis,
  PhotoRescueResult,
  QuickRescueAnswers,
  RescueAction,
} from '../types';

const hasAny = (signs: string[], terms: string[]) =>
  signs.some(sign =>
    terms.some(term => sign.toLowerCase().includes(term.toLowerCase()))
  );

const action = (
  title: string,
  details: string,
  minutesFromNow?: number
): RescueAction => ({
  title,
  details,
  minutesFromNow,
});

const baseDiagnosis = (
  answers: QuickRescueAnswers,
  override: Partial<PhotoRescueDiagnosis>
): PhotoRescueDiagnosis => ({
  id: `quick_${Date.now()}`,
  createdAt: new Date().toISOString(),
  subject: answers.subject,
  stage: answers.stage,
  diagnosis: 'Likely fermentation imbalance',
  confidence: 'low',
  summary:
    'Using quick rescue checklist. This guidance is based on your answers, not image analysis.',
  visualEvidence: answers.observedSigns.length
    ? answers.observedSigns
    : ['No photo analysis was available, so the checklist used your selected context.'],
  doNow: [
    action(
      'Pause and check dough state',
      'Look for rise, bubbles, surface tension, and whether the dough springs back slowly.'
    ),
  ],
  nextBake: [
    'Record room temperature, dough temperature, and rise percentage next time.',
    'Use the same bowl or container so rise is easier to compare.',
  ],
  risk:
    'Avoid making aggressive changes from one clue. Confirm with rise, texture, and timing.',
  missingContextQuestions: [
    'How much has the dough risen?',
    'What is the dough temperature?',
  ],
  bakePlanSeed: {
    suggestedStyle: 'overnight-cold-proof',
    adjustments: ['Use conservative fermentation checks before shaping.'],
  },
  ...override,
});

export function createQuickRescueDiagnosis(
  answers: QuickRescueAnswers
): PhotoRescueResult {
  const signs = answers.observedSigns;

  if (
    answers.subject === 'starter' &&
    hasAny(signs, ['mold', 'pink', 'orange', 'fuzzy'])
  ) {
    return {
      source: 'quick-rescue',
      diagnosis: baseDiagnosis(answers, {
        diagnosis: 'Discard starter and restart',
        confidence: 'high',
        summary:
          'Using quick rescue checklist. Mold or colored streaks are a safety stop, not a fermentation problem to troubleshoot.',
        doNow: [
          action(
            'Discard the starter',
            'Do not scrape around mold or colored streaks. Dispose of the starter and sanitize the jar.'
          ),
          action(
            'Restart clean',
            'Use a clean jar, fresh flour, and clean utensils before building a new culture.'
          ),
        ],
        nextBake: [
          'Use a clean jar after each feeding cycle.',
          'Keep the starter covered but not airtight during active fermentation.',
        ],
        risk:
          'Do not taste or bake with a starter that shows mold, pink streaks, orange streaks, or fuzzy growth.',
        missingContextQuestions: [],
        bakePlanSeed: undefined,
      }),
    };
  }

  if (
    answers.subject === 'dough' &&
    (hasAny(signs, ['collapsed', 'shiny', 'slack', 'liquid']) ||
      (answers.elapsedMinutes || 0) >= 360 ||
      (answers.roomTempF || 0) >= 78)
  ) {
    return {
      source: 'quick-rescue',
      diagnosis: baseDiagnosis(answers, {
        diagnosis: 'Likely overfermentation risk',
        confidence: 'medium',
        summary:
          'Using quick rescue checklist. The timing, warm room, or reported slack/collapsed texture points toward dough that may be moving past ideal bulk.',
        doNow: [
          action(
            'Shape or cool the dough now',
            'If the dough still has some strength, shape it gently. If it is very slack, move it cold for 20 minutes first.',
            0
          ),
          action(
            'Use a conservative proof',
            'After shaping, shorten the room-temperature proof and move to cold proof sooner.',
            20
          ),
        ],
        nextBake: [
          'Check bulk earlier in warm rooms.',
          'Use rise percentage plus jiggle, not time alone.',
          'Lower hydration by 3-5 points if handling felt unmanageable.',
        ],
        risk:
          'Avoid long additional room-temperature rests; they can make weak dough spread further.',
        missingContextQuestions: [
          'How much did the dough rise from the start of bulk?',
          'Does it still hold any edge after a gentle fold?',
        ],
        bakePlanSeed: {
          suggestedStyle: 'overnight-cold-proof',
          adjustments: [
            'Shorten the final room-temperature proof.',
            'Use cold proof to slow fermentation after shaping.',
          ],
        },
      }),
    };
  }

  if (
    answers.subject === 'dough' &&
    hasAny(signs, ['dense', 'few bubbles', 'tight', 'no rise'])
  ) {
    return {
      source: 'quick-rescue',
      diagnosis: baseDiagnosis(answers, {
        diagnosis: 'Likely underfermentation',
        confidence: 'medium',
        summary:
          'Using quick rescue checklist. Dense texture, little rise, and few bubbles usually mean the dough needs more fermentation time.',
        doNow: [
          action(
            'Continue bulk fermentation',
            'Keep the dough covered and reassess every 30 minutes for rise, bubbles, and jiggle.',
            30
          ),
          action(
            'Warm gently if needed',
            'If the room is cool, move the dough to a slightly warmer spot without overheating it.'
          ),
        ],
        nextBake: [
          'Start bulk timing when the dough is mixed, but end it by dough cues.',
          'Use a clear-sided container to track rise.',
        ],
      }),
    };
  }

  if (
    answers.subject === 'starter' &&
    hasAny(signs, ['hooch', 'acetone', 'collapsed', 'sour'])
  ) {
    return {
      source: 'quick-rescue',
      diagnosis: baseDiagnosis(answers, {
        diagnosis: 'Hungry starter',
        confidence: 'medium',
        summary:
          'Using quick rescue checklist. Hooch, sharp acetone notes, or collapse after peak usually mean the starter has run through its food.',
        doNow: [
          action(
            'Feed at a higher ratio',
            'Discard and feed 1:3:3 or 1:5:5, then wait for a domed peak before mixing dough.'
          ),
        ],
        nextBake: [
          'Use starter near peak, not long after collapse.',
          'Adjust feeding ratio for room temperature.',
        ],
      }),
    };
  }

  return {
    source: 'quick-rescue',
    diagnosis: baseDiagnosis(answers, {}),
  };
}
