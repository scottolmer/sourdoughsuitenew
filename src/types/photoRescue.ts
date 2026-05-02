export type PhotoSubject = 'dough' | 'starter' | 'crumb' | 'loaf';
export type Confidence = 'low' | 'medium' | 'high';
export type ScheduleStyle = 'same-day' | 'overnight-cold-proof';
export type StarterReadiness = 'weak' | 'okay' | 'strong';

export interface PhotoRescueContext {
  subject: PhotoSubject;
  stage?: string;
  roomTempF?: number;
  elapsedMinutes?: number;
  hydrationPercent?: number;
  flourType?: string;
  starterReadiness?: StarterReadiness;
  notes?: string;
}

export interface PhotoRescueRequest {
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  context: PhotoRescueContext;
}

export interface RescueAction {
  title: string;
  details: string;
  minutesFromNow?: number;
}

export interface BakePlanSeed {
  suggestedStyle: ScheduleStyle;
  adjustments: string[];
}

export interface PhotoRescueDiagnosis {
  id: string;
  createdAt: string;
  subject: PhotoSubject;
  stage?: string;
  diagnosis: string;
  confidence: Confidence;
  summary: string;
  visualEvidence: string[];
  doNow: RescueAction[];
  nextBake: string[];
  risk: string;
  missingContextQuestions: string[];
  bakePlanSeed?: BakePlanSeed;
}

export interface QuickRescueAnswers {
  subject: PhotoSubject;
  stage?: string;
  roomTempF?: number;
  elapsedMinutes?: number;
  observedSigns: string[];
  hydrationPercent?: number;
  starterReadiness?: StarterReadiness;
}

export interface BakePlanInput {
  targetBakeAt: string;
  roomTempF: number;
  starterReadiness: StarterReadiness;
  scheduleStyle: ScheduleStyle;
  hydrationPercent: number;
  loafCount: number;
  doughWeightG?: number;
  flourType?: string;
  starterPercent?: number;
  diagnosis?: PhotoRescueDiagnosis;
  remindersEnabled: boolean;
}

export type BakeStepType =
  | 'feed-starter'
  | 'mix'
  | 'fold'
  | 'bulk-check'
  | 'shape'
  | 'cold-proof'
  | 'preheat'
  | 'bake'
  | 'uncover'
  | 'cool';

export interface BakePlanStep {
  id: string;
  type: BakeStepType;
  title: string;
  startsAt: string;
  durationMinutes?: number;
  notes: string;
  reminderEnabled: boolean;
}

export interface BakePlan {
  id: string;
  createdAt: string;
  input: BakePlanInput;
  fermentationRisk: 'low' | 'medium' | 'high';
  temperatureNote: string;
  starterNote: string;
  steps: BakePlanStep[];
}

export interface SavedDiagnosisRecord {
  id: string;
  createdAt: string;
  imageUri?: string;
  diagnosis: PhotoRescueDiagnosis;
}

export interface SavedBakePlanRecord {
  id: string;
  createdAt: string;
  /** ISO timestamp set when the user explicitly starts this bake. */
  startedAt?: string;
  plan: BakePlan;
}
