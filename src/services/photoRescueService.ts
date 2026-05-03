import api from './api';
import {
  PhotoRescueContext,
  PhotoRescueDiagnosis,
  PhotoRescueRequest,
  PhotoRescueResult,
  QuickRescueAnswers,
} from '../types';
import { createQuickRescueDiagnosis } from '../utils/photoRescueRules';

interface AnalyzeResponse {
  ok: boolean;
  source?: 'gemini' | 'fallback-required';
  diagnosis?: PhotoRescueDiagnosis;
}

function normalizeConfidence(value: unknown): PhotoRescueDiagnosis['confidence'] {
  return value === 'high' || value === 'medium' || value === 'low'
    ? value
    : 'low';
}

function normalizeDiagnosis(
  diagnosis: PhotoRescueDiagnosis,
  fallbackContext: PhotoRescueContext
): PhotoRescueDiagnosis {
  return {
    ...diagnosis,
    id: diagnosis.id || `diag_${Date.now()}`,
    createdAt: diagnosis.createdAt || new Date().toISOString(),
    subject: diagnosis.subject || fallbackContext.subject,
    stage: diagnosis.stage || fallbackContext.stage,
    confidence: normalizeConfidence(diagnosis.confidence),
    visualEvidence: diagnosis.visualEvidence?.length
      ? diagnosis.visualEvidence
      : ['No visual evidence was returned.'],
    doNow: diagnosis.doNow?.length
      ? diagnosis.doNow
      : [
          {
            title: 'Use the conservative checklist',
            details: 'Confirm dough state with rise, texture, and timing.',
          },
        ],
    nextBake: diagnosis.nextBake?.length
      ? diagnosis.nextBake
      : ['Record room temperature and fermentation timing next bake.'],
    risk:
      diagnosis.risk ||
      'Treat this as guidance, not certainty. Confirm with dough cues.',
    missingContextQuestions: diagnosis.missingContextQuestions || [],
  };
}

export async function analyzePhotoRescue(
  request: PhotoRescueRequest,
  fallbackAnswers: QuickRescueAnswers
): Promise<PhotoRescueResult> {
  try {
    const response = await api.post<AnalyzeResponse>(
      '/photo-rescue/analyze',
      request
    );

    if (response.ok && response.diagnosis) {
      return {
        source: 'gemini',
        diagnosis: normalizeDiagnosis(response.diagnosis, request.context),
      };
    }
  } catch (error) {
    console.warn('Photo Rescue API unavailable, using quick rescue.', error);
  }

  return createQuickRescueDiagnosis(fallbackAnswers);
}

export function createSamplePhotoRequest(
  context: PhotoRescueContext
): PhotoRescueRequest {
  return {
    imageBase64: 'sample-demo-image',
    mimeType: 'image/jpeg',
    context,
  };
}
