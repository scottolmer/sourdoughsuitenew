/**
 * Starter Local Storage Service
 * Stores starters locally using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Starter } from '../types';

const STARTERS_KEY = '@sourdough_starters';

export const starterStorage = {
  // Get all starters
  async getAll(): Promise<Starter[]> {
    try {
      const startersJson = await AsyncStorage.getItem(STARTERS_KEY);
      return startersJson ? JSON.parse(startersJson) : [];
    } catch (error) {
      console.error('Error loading starters:', error);
      return [];
    }
  },

  // Get starter by ID
  async getById(id: number): Promise<Starter | null> {
    try {
      const starters = await this.getAll();
      return starters.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error loading starter:', error);
      return null;
    }
  },

  // Create new starter
  async create(starter: Omit<Starter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Starter> {
    try {
      const starters = await this.getAll();
      const newStarter: Starter = {
        ...starter,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      starters.push(newStarter);
      await AsyncStorage.setItem(STARTERS_KEY, JSON.stringify(starters));
      return newStarter;
    } catch (error) {
      console.error('Error creating starter:', error);
      throw error;
    }
  },

  // Update starter
  async update(id: number, updates: Partial<Starter>): Promise<Starter | null> {
    try {
      const starters = await this.getAll();
      const index = starters.findIndex(s => s.id === id);
      if (index === -1) return null;

      starters[index] = {
        ...starters[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STARTERS_KEY, JSON.stringify(starters));
      return starters[index];
    } catch (error) {
      console.error('Error updating starter:', error);
      throw error;
    }
  },

  // Delete starter
  async delete(id: number): Promise<boolean> {
    try {
      const starters = await this.getAll();
      const filtered = starters.filter(s => s.id !== id);
      await AsyncStorage.setItem(STARTERS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting starter:', error);
      return false;
    }
  },

  // Clear all starters (for testing)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STARTERS_KEY);
    } catch (error) {
      console.error('Error clearing starters:', error);
    }
  },
};
