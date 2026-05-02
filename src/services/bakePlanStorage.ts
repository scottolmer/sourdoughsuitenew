/**
 * Bake Plan Storage Service
 * Persists generated bake plans so the active plan can drive Home.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BakePlan, SavedBakePlanRecord } from '../types/photoRescue';

const BAKE_PLANS_KEY = '@sourdough_bake_plans';

export const bakePlanStorage = {
  async getAll(): Promise<SavedBakePlanRecord[]> {
    try {
      const raw = await AsyncStorage.getItem(BAKE_PLANS_KEY);
      return raw ? (JSON.parse(raw) as SavedBakePlanRecord[]) : [];
    } catch (error) {
      console.error('Error loading bake plans:', error);
      return [];
    }
  },

  async save(plan: BakePlan): Promise<SavedBakePlanRecord> {
    try {
      const all = await this.getAll();
      const existingIndex = all.findIndex((r) => r.plan.id === plan.id);
      const record: SavedBakePlanRecord = existingIndex >= 0
        ? { ...all[existingIndex], plan }
        : {
            id: `record_${Date.now()}`,
            createdAt: new Date().toISOString(),
            plan,
          };
      const next = existingIndex >= 0
        ? all.map((r, i) => (i === existingIndex ? record : r))
        : [record, ...all];
      // Cap to 20 most recent so storage doesn't grow unbounded.
      const trimmed = next.slice(0, 20);
      await AsyncStorage.setItem(BAKE_PLANS_KEY, JSON.stringify(trimmed));
      return record;
    } catch (error) {
      console.error('Error saving bake plan:', error);
      throw error;
    }
  },

  /**
   * The "active" plan is the most-recently created plan whose final bake step
   * is in the future (or, if none qualify, simply the most recent plan).
   * Returns null if nothing has been saved yet.
   */
  async getActive(): Promise<SavedBakePlanRecord | null> {
    const all = await this.getAll();
    if (all.length === 0) return null;
    const now = Date.now();
    const sorted = [...all].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const live = sorted.find((r) => {
      const last = r.plan.steps[r.plan.steps.length - 1];
      if (!last) return false;
      return new Date(last.startsAt).getTime() + 60 * 60 * 1000 > now;
    });
    return live ?? sorted[0];
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BAKE_PLANS_KEY);
    } catch (error) {
      console.error('Error clearing bake plans:', error);
    }
  },
};
