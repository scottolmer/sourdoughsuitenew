import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotoRescueDiagnosis, SavedDiagnosisRecord } from '../types';

const DIAGNOSES_KEY = '@photo_rescue:diagnoses';
const MAX_RECORDS = 12;

export const photoRescueStorage = {
  async getAll(): Promise<SavedDiagnosisRecord[]> {
    try {
      const json = await AsyncStorage.getItem(DIAGNOSES_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error loading diagnoses:', error);
      return [];
    }
  },

  async getLatest(): Promise<SavedDiagnosisRecord | null> {
    const records = await this.getAll();
    return records[0] || null;
  },

  async getById(id: string): Promise<SavedDiagnosisRecord | null> {
    const records = await this.getAll();
    return records.find(record => record.id === id) || null;
  },

  async save(
    diagnosis: PhotoRescueDiagnosis,
    imageUri?: string
  ): Promise<SavedDiagnosisRecord> {
    const record: SavedDiagnosisRecord = {
      id: diagnosis.id,
      createdAt: new Date().toISOString(),
      imageUri,
      diagnosis,
    };

    const records = await this.getAll();
    const nextRecords = [
      record,
      ...records.filter(item => item.id !== record.id),
    ].slice(0, MAX_RECORDS);

    await AsyncStorage.setItem(DIAGNOSES_KEY, JSON.stringify(nextRecords));
    return record;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(DIAGNOSES_KEY);
  },
};
