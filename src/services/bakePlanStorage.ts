/**
 * Bake Plan Storage Service
 * Persists generated bake plans so the active plan can drive Home.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BakePlan, SavedBakePlanRecord } from '../types/photoRescue';
import { shiftPlanToNow } from '../utils/bakeDayTimeline';

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
   * The "active" plan is chosen in priority order:
   * 1. A started plan (has startedAt) whose final step is still in the future.
   * 2. The most-recently created plan whose final step is in the future.
   * 3. The most recent plan overall.
   * Returns null if nothing has been saved yet.
   */
  async getActive(): Promise<SavedBakePlanRecord | null> {
    const all = await this.getAll();
    if (all.length === 0) return null;
    const now = Date.now();
    const isLive = (r: SavedBakePlanRecord) => {
      const last = r.plan.steps[r.plan.steps.length - 1];
      if (!last) return false;
      return new Date(last.startsAt).getTime() + 60 * 60 * 1000 > now;
    };
    // Prefer an explicitly-started live plan
    const startedLive = all
      .filter((r) => !!r.startedAt && isLive(r))
      .sort((a, b) => new Date(b.startedAt!).getTime() - new Date(a.startedAt!).getTime());
    if (startedLive.length > 0) return startedLive[0];

    // Fall back to most-recently created live plan
    const byCreated = [...all].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return byCreated.find(isLive) ?? byCreated[0];
  },

  /**
   * Re-anchors the plan identified by recordId so its first step starts NOW,
   * preserves relative gaps, marks startedAt, and persists.
   */
  async startPlan(recordId: string): Promise<SavedBakePlanRecord> {
    const all = await this.getAll();
    const idx = all.findIndex((r) => r.id === recordId);
    if (idx === -1) throw new Error(`No plan found with id ${recordId}`);
    const shifted = shiftPlanToNow(all[idx].plan);
    const updated: SavedBakePlanRecord = {
      ...all[idx],
      startedAt: new Date().toISOString(),
      plan: { ...shifted, id: `plan_${Date.now()}` },
    };
    const next = all.map((r, i) => (i === idx ? updated : r));
    await AsyncStorage.setItem(BAKE_PLANS_KEY, JSON.stringify(next));
    return updated;
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BAKE_PLANS_KEY);
    } catch (error) {
      console.error('Error clearing bake plans:', error);
    }
  },
};
