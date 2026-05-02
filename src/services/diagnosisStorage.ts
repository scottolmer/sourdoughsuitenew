/**
 * Diagnosis Storage Service
 * Persists Photo Rescue diagnoses so the most recent one can be re-entered
 * from Home and other surfaces.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  PhotoRescueDiagnosis,
  SavedDiagnosisRecord,
} from '../types/photoRescue';

const DIAGNOSES_KEY = '@sourdough_diagnoses';

export const diagnosisStorage = {
  async getAll(): Promise<SavedDiagnosisRecord[]> {
    try {
      const raw = await AsyncStorage.getItem(DIAGNOSES_KEY);
      return raw ? (JSON.parse(raw) as SavedDiagnosisRecord[]) : [];
    } catch (error) {
      console.error('Error loading diagnoses:', error);
      return [];
    }
  },

  async save(
    diagnosis: PhotoRescueDiagnosis,
    imageUri?: string
  ): Promise<SavedDiagnosisRecord> {
    try {
      const all = await this.getAll();
      if (all.some((r) => r.diagnosis.id === diagnosis.id)) {
        return all.find((r) => r.diagnosis.id === diagnosis.id)!;
      }
      const record: SavedDiagnosisRecord = {
        id: `diag_${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUri,
        diagnosis,
      };
      const next = [record, ...all].slice(0, 25);
      await AsyncStorage.setItem(DIAGNOSES_KEY, JSON.stringify(next));
      return record;
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      throw error;
    }
  },

  async getMostRecent(): Promise<SavedDiagnosisRecord | null> {
    const all = await this.getAll();
    if (all.length === 0) return null;
    const sorted = [...all].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0];
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DIAGNOSES_KEY);
    } catch (error) {
      console.error('Error clearing diagnoses:', error);
    }
  },
};
