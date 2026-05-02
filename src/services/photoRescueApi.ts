import { API_ENDPOINTS } from '../constants/api';
import api from './api';
import type { PhotoRescueRequest, PhotoRescueDiagnosis } from '../types/photoRescue';

export class PhotoRescueFallbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhotoRescueFallbackError';
  }
}

interface AnalyzeSuccessResponse {
  ok: true;
  source: 'gemini';
  diagnosis: PhotoRescueDiagnosis;
}

interface AnalyzeFallbackResponse {
  ok: false;
  source: 'fallback-required';
  errorCode: string;
  message: string;
}

type AnalyzeResponse = AnalyzeSuccessResponse | AnalyzeFallbackResponse;

export async function analyzePhoto(request: PhotoRescueRequest): Promise<PhotoRescueDiagnosis> {
  try {
    const response = await api.post<AnalyzeResponse>(
      API_ENDPOINTS.PHOTO_RESCUE.ANALYZE,
      request
    );

    if (response.ok && response.source === 'gemini') {
      return response.diagnosis;
    }

    throw new PhotoRescueFallbackError(
      (response as AnalyzeFallbackResponse).message || 'Gemini unavailable. Use Quick Rescue.'
    );
  } catch (err) {
    if (err instanceof PhotoRescueFallbackError) {
      throw err;
    }
    throw new PhotoRescueFallbackError(
      'Could not reach the server. Use Quick Rescue checklist.'
    );
  }
}
