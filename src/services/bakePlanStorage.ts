import AsyncStorage from '@react-native-async-storage/async-storage';
import { BakePlan, SavedBakePlanRecord } from '../types';

const BAKE_PLANS_KEY = '@bake_planner:plans';
const MAX_RECORDS = 12;

export const bakePlanStorage = {
  async getAll(): Promise<SavedBakePlanRecord[]> {
    try {
      const json = await AsyncStorage.getItem(BAKE_PLANS_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error loading bake plans:', error);
      return [];
    }
  },

  async getLatest(): Promise<SavedBakePlanRecord | null> {
    const records = await this.getAll();
    return records[0] || null;
  },

  async getById(id: string): Promise<SavedBakePlanRecord | null> {
    const records = await this.getAll();
    return records.find(record => record.id === id) || null;
  },

  async save(plan: BakePlan): Promise<SavedBakePlanRecord> {
    const record: SavedBakePlanRecord = {
      id: plan.id,
      createdAt: new Date().toISOString(),
      plan,
    };

    const records = await this.getAll();
    const nextRecords = [
      record,
      ...records.filter(item => item.id !== record.id),
    ].slice(0, MAX_RECORDS);

    await AsyncStorage.setItem(BAKE_PLANS_KEY, JSON.stringify(nextRecords));
    return record;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(BAKE_PLANS_KEY);
  },
};
